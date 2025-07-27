'use client';

import { useState } from "react";
import { ShoppingCart } from "../../../lib/cart";

export default function Checkout({ cart }: { cart: ShoppingCart | null }){
    const [loading, setLoading] = useState(false);

    const handleCheckout = () => {
        const processPayment = async () => {
            setLoading(true);

            try {
                const response = await fetch("/api/tokenizer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cart)
                });

                console.log('Response status:', response.status)
                console.log('Response status:', response.ok)

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response text:', errorText);
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const result = await response.json(); 
                console.log('API Response:', result)

                if(!result.token){
                    throw new Error('No Payment Token Received')
                }

                window.snap.pay(result.token)
            } catch(err){
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        processPayment();
    }

    return(
        <button 
        onClick={handleCheckout}
        disabled={loading}
        className={`btn btn-primary sm:w-[200px] ${
            loading ? 'opacity-50 cursor-now-allowed' : ''
        }`}
        >
            Checkout
        </button>
    )
}