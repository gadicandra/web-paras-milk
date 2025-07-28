'use client';

import { useRef, useState } from "react";
import { ShoppingCart } from "../../../lib/cart";
import { MidtransStatusResponse, SnapTransactionResult } from "../../../@types/midtrans";
import { executeCallback, getPaymentStatusGroup, validateMidtransResponse } from "../../../utils/midtrans";

export default function Checkout({ cart }: { cart: ShoppingCart | null }){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const processingRef = useRef(false);

    const handleSnapCallBack = (
        result: SnapTransactionResult,
        callbackType: 'success' | "pending"
    ): void => {
        if(processingRef.current){
            console.log("Already processing, ignoring duplicate callback")
            return;
        }
        console.log(`Payment ${callbackType}:`, result);
        processingRef.current = true;
        const transactionId = result.order_id || result.transaction_id;
        if(transactionId && typeof transactionId === "string"){
            checkTransactionStatus(transactionId);
        } else {
            setError('No transaction ID received from payment gateway');
            setLoading(false);
            processingRef.current = false;
        }
    }

    const handleCheckout = () => {
        processingRef.current = false
        const processPayment = async (): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                console.log('Cart exists:', !!cart);
                console.log('Cart data:', cart);
                console.log('Cart items count:', cart?.items?.length || 0);
                console.log('Cart data being sent:', cart);
                console.log('Cart stringified:', JSON.stringify(cart));

                if (!cart) {
                    throw new Error('Cart is empty or undefined');
                }

                if (!cart.items || cart.items.length === 0) {
                    throw new Error('No items in cart');
                }

                const response = await fetch("/api/tokenizer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cart)
                });

                console.log('=== RESPONSE DEBUG ===');
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                console.log('Response statusText:', response.statusText);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response text:', errorText);
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const result = await response.json(); 

                if(!result.token){
                    throw new Error('No Payment Token Received')
                }

                window.snap.pay(result.token, {
                    onSuccess: (snapResult) => {
                        console.log('Payment success:', snapResult);
                        handleSnapCallBack(snapResult, 'success');
                    },
                    onPending: (snapResult) => {
                        console.log("Payment pending:", snapResult)
                        handleSnapCallBack(snapResult, "pending");
                    },
                    onError: (snapResult) => {
                        console.log("Payment error:", snapResult)
                        setError("Payment failed. Please try again.");
                        setLoading(false);
                        processingRef.current = false;
                    },
                    onClose: () => {
                        console.log('Payment popup closed');
                        setLoading(false)
                        processingRef.current = false;
                    }
                })
            } catch(err){
                console.log('=== ERROR DEBUG ===');
                console.error("Full error object:", err);
                
                let errorMessage = "Unknown error occurred";
                
                if (err instanceof Error) {
                    errorMessage = err.message;
                    console.error("Error name:", err.name);
                    console.error("Error stack:", err.stack);
                } else {
                    console.error("Non-Error thrown:", err);
                }

                // Handle specific error types
                if (errorMessage.includes('AbortError')) {
                    errorMessage = 'Request timeout. Please check your connection and try again.';
                } else if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
                    errorMessage = 'Network error. Please check your connection.';
                }

                console.log("Final error message:", errorMessage);
                setError(errorMessage);
                setLoading(false);
                processingRef.current = false;
            } finally {
                console.log("=== CHECKOUT DEBUG END ===");
            }
        };

        processPayment();
    }

    const checkTransactionStatus = async (transactionId: string): Promise<void> => {
        try {
            const response = await fetch(`/api/transaction-status/${transactionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const rawData = await response.json();
            const statusResult = validateMidtransResponse(rawData);
            
            console.log('Transaction status:', statusResult);
            handleTransactionResult(statusResult);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to check transaction status';
            console.error('Status check error:', errorMessage);
            setError(errorMessage);
            setLoading(false);
            processingRef.current = false;
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionResult = (result: MidtransStatusResponse): void => {
        const statusGroup = getPaymentStatusGroup(result.transaction_status);
        
        switch (statusGroup) {
            case 'success':
                console.log('Payment successful');
                executeCallback(onPaymentSuccess, result);
                break;
            case 'pending':
                console.log('Payment pending');
                executeCallback(onPaymentPending, result);
                break;
            case 'failed':
                console.log('Payment failed');
                executeCallback(onPaymentFailed, result);
                break;
            default:
                console.log('Unknown payment status:', result.transaction_status);
                setError(`Unknown payment status: ${result.transaction_status}`);
                setLoading(false);
                processingRef.current = false;
        }
    };

    const onPaymentSuccess = (result: MidtransStatusResponse): void => {
        console.log("Payment completed successfully", result.order_id);
        setError(null);
        setLoading(false);
        processingRef.current = false;
        window.location.href = window.location.origin + "/invoice"
    }

    const onPaymentPending = (result: MidtransStatusResponse): void => {
        console.log("Payment is pending", result.order_id);
        setError(null);
        setLoading(false);
        processingRef.current = false;
    }

    const onPaymentFailed = (result: MidtransStatusResponse): void => {
        console.log("Payment failed:", result.order_id);
        setError("Payment was unsuccessful. Please try again.");
        setLoading(false);
        processingRef.current = false;
    }

    const clearError = (): void => {
        setError(null);
    }

    return(
        <div className="checkout-container">
            {error && (
                <div className="error-message mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{error}</p>
                    <button 
                        onClick={clearError}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Clear Error
                    </button>
                </div>
            )}
            <button 
            onClick={handleCheckout}
            disabled={loading || !cart}
            className={`btn btn-primary sm:w-[200px] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
                !cart ? 'opacity-50 cursor-not-allowed' : ""
            }`}
            >
                {loading ? "Processing..." : "Checkout"}
            </button>
        </div>
    )
}
