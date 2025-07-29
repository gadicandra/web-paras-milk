import Midtrans from "midtrans-client-typescript"
import { NextRequest, NextResponse } from "next/server";
import { ShoppingCart } from "../../../../lib/cart";
import CreateSnapShot from "../../../../lib/snapShotCart";


const snap = new Midtrans.Snap({
    isProduction: Boolean(process.env.MIDTRANS_IS_PRODUCTION),
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
})

export async function POST(request: NextRequest) {
    try{
        const body: ShoppingCart = await request.json()

        function createItemDetails(body: ShoppingCart){
            let totalAmount = 0;
            const timestamp = Date.now();
            const random= Math.random().toString(36).substring(2,15);
            const orderId = `ORD-${timestamp}-${random}`

            const itemDetails = body.items.map(product => {
                const { variant, quantity} = product
                const subtotal = variant.price * quantity;
                totalAmount += subtotal;

                return{
                    id: variant.id.toString(),
                    name: variant.name,
                    price: variant.price,
                    quantity: quantity
                }
            })

            return { orderId, itemDetails, totalAmount }
        }

        const { orderId, itemDetails, totalAmount } = createItemDetails(body)
        try {
            await CreateSnapShot(orderId, body);
            console.log('Snapshot created successfully for order:', orderId);
        } catch (snapshotError) {
            console.error('Error creating snapshot:', snapshotError);
        }
        const parameter = {
            item_details: itemDetails,
            transaction_details: {
                order_id: orderId,
                gross_amount: totalAmount
            }
        }
    
        const token = await snap.createTransactionToken(parameter);
        console.log(token)

        if (!token) {
            throw new Error('No token received from Midtrans');
        }
        return NextResponse.json({ token })
    } catch (error){
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: "Failed to create payment token", error: errorMessage },
            { status: 500 } // Gunakan status 500 (Internal Server Error)
        );
    }
}