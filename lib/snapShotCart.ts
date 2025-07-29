import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { ShoppingCart } from "./cart";

export default async function CreateSnapShot(orderId: string, body: ShoppingCart ){
    const session = await getServerSession(authOptions)

    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)

    if(!session){
        throw Error("User Not Logged In")
    }
    
    for (const item of body.items){
        const { variant, quantity, cartId} = item
        await prisma.snapShotCart.create({
            data: {
                sessionId: orderId,
                userId: session.user.id,
                variantId: variant.id,
                quantity: quantity,
                priceSnapshot: variant.price,
                subTotal: quantity * variant.price,
                expiresAt: oneHourFromNow,
                cartId: cartId
            }
        })
    }
}