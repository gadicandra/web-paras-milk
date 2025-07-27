import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";


export type CartWithProducts = Prisma.CartGetPayload<{
    include: { items: {include: {variant: true}}}
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: { variant: true }
}>;

export type ShoppingCart = CartWithProducts & {
    size: number,
    subtotal: number,
}

export async function getCart(): Promise<ShoppingCart | null> {
    const session = await getServerSession(authOptions)
    let cart: CartWithProducts | null = null

    if(session){
        cart = await prisma.cart.findFirst({
            where: {userId : session.user.id},
            include: { items: { include: { variant:true }}}
        })
    } else {
        const localCartId = (await cookies()).get("localCartId")?.value;
        cart = localCartId 
        ? await prisma.cart.findUnique({
            where: {id: parseInt(localCartId,10)},
            include: { items: { include: {variant: true } } }
        })
        : null;
    }

    if(!cart){
        return null
    }

    return {
        ...cart,
        size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: cart.items.reduce((acc, item) => acc + item.quantity * item.variant.price, 0),
    };
}

export async function createCart(): Promise<ShoppingCart>{
    const session = await getServerSession(authOptions)

    let newCart: Cart;

    if(session){
        newCart = await prisma.cart.create({
            data: {userId: session.user.id}
        })
    } else {
        newCart = await prisma.cart.create({
            data: {}
        });
        
        (await cookies()).set("localCartId", newCart.id.toString())
    }

    (await cookies()).set("localCartId", newCart.id.toString())

    return{
        ...newCart,
        items: [],
        size: 0,
        subtotal: 0
    }
}

export async function mergeAnonymousCartIntoUserCart(userId: string){
    const localCartId = (await cookies()).get("localCartId")?.value
    const localCart = localCartId 
    ? await prisma.cart.findUnique({
        where: {id: parseInt(localCartId,10)},
        include: { items: true }
    })
    : null;
    
    if(!localCart) return;

    const userCart = await prisma.cart.findFirst({
        where: {userId},
        include: { items: true },
    })

    await prisma.$transaction(async tx => {
        if(userCart){
            const mergedCartItems = mergeCartItems(localCart.items, userCart.items)

            await tx.cartItem.deleteMany({
                where: { cartId: userCart.id}
            })

            await tx.cart.update({
                where: { id: userCart.id },
                data: {
                    items: {
                        createMany: {
                            data: mergedCartItems.map(item => ({
                                variantId: item.variantId,
                                quantity: item.quantity
                            }))
                        }
                    }
                }
            })
        } else {
            await tx.cart.create({
                data: {
                    userId: userId,
                    items: {
                        createMany: {
                            data: localCart.items.map(item => ({
                                variantId: item.variantId,
                                quantity: item.quantity
                            }))
                        }
                    }
                }
            })
        }

        await tx.cart.delete({
            where: { id: localCart.id }
        });

        (await cookies()).set("localCartId", "");
    })
}

function mergeCartItems(...cartItems: CartItem[][]){
    return cartItems.reduce((acc, items) => {
        items.forEach(item => {
            const existingItem = acc.find((i) => i.variantId === item.variantId);
            if(existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                acc.push(item)
            }
        });
        return acc;
    }, [] as CartItem[])
}
