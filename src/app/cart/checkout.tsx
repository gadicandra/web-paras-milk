'use client';

import { useState } from "react";
import { product } from "../../../lib/product"

export default function Checkout(){
    const [loading, setLoading] = useState(false);


    const handleCheckout = () => {
        const processPayment = async () => {
            setLoading(true);

            const data = {
                id: product.id,
                productName: product.name,
                price: product.price,
                quantity: product.quantity
            };
            console.log('Sending data:', data);

            try {
                const response = await fetch("/api/tokenizer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
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