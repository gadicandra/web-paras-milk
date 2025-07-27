import Midtrans from "midtrans-client-typescript"
import { NextRequest, NextResponse } from "next/server";

interface PaymentRequestBody{
    id: string;
    productName: string;
    price: number;
    quantity: number;
}


const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.SECRET,
    clientKey: process.env.NEXT_PUBLIC_CLIENT
})

export async function POST(request: NextRequest) {
    const body: PaymentRequestBody = await request.json()
    const {id, productName, price, quantity} = body;

    const parameter = {
        item_details: {
            name: productName,
            price: price,
            quantity: quantity
        },
        transaction_details: {
            order_id: id,
            gross_amount: price * quantity
        }
    }

    const token = await snap.createTransactionToken(parameter);
    console.log(token)
    return NextResponse.json({ token })
}