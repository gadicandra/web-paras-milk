import Midtrans from "midtrans-client-typescript"
import { NextRequest, NextResponse } from "next/server";
import { ShoppingCart } from "../../../../lib/cart";

const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.SECRET,
    clientKey: process.env.NEXT_PUBLIC_CLIENT
})

export async function POST(request: NextRequest) {
    const body: ShoppingCart = await request.json()

    function createItemDetails(body: ShoppingCart){
        let totalAmount = 0;
        const cartId = body.items[0].id

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

        return { cartId, itemDetails, totalAmount }
    }

    const { cartId, itemDetails, totalAmount } = createItemDetails(body)
    const parameter = {
        item_details: itemDetails,
        transaction_details: {
            order_id: cartId,
            gross_amount: totalAmount
        }
    }

    const token = await snap.createTransactionToken(parameter);
    console.log(token)
    return NextResponse.json({ token })
}