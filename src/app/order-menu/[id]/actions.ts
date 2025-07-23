"use server"

import { revalidatePath } from "next/cache";
import { createCart, getCart } from "../../../../lib/cart"
import { prisma } from "../../../../lib/prisma";

export async function incrementProductQuantity(productId: number, flavor: string, size: string){
    let variantId = 0;
    if (productId === 2){
        if(size === "1L"){
            const variant = await prisma.productVariant.findFirst({
                where: {
                    productId: productId,
                    AND: [
                        {
                            attributes:{
                                path:['flavor'],
                                equals: flavor
                            },
                        },
                        {
                            attributes:{
                                path:['size'],
                                equals: size
                            }
                        },
                        {
                            attributes:{
                                path:['packaging'],
                                equals: "bottle"
                            }
                        }
                    ]
                }
            })
            if(!variant) {
                throw new Error(`Variant tidak ditemukan untuk produk ${productId} dengan ukuran ${size} dan rasa ${flavor}`);
            }
            variantId = variant.id;
        } else {
            const variant = await prisma.productVariant.findFirst({
                where: {
                    productId: productId,
                    attributes: {
                        path: ['size'],
                        equals: size
                    },
                    AND: {
                        attributes:{
                            path: ['flavor'],
                            equals: flavor
                        }
                    }
                }
            })
            if(!variant) {
                throw new Error(`Variant tidak ditemukan untuk produk ${productId} dengan ukuran ${size} dan rasa ${flavor}`);
            }
            variantId = variant.id;
        }

    } else if (productId === 3){
        const variant = await prisma.productVariant.findFirst({
            where: {
                productId: productId,
                attributes:{
                    path: ['flavor'],
                    equals: flavor
                },
                AND: {
                    attributes:{
                        path: ['Type'],
                        equals: "premium"   
                    }
                }
            }
        })
        if(!variant) {
            throw new Error(`Variant tidak ditemukan untuk produk ${productId} dengan ukuran ${size} dan rasa ${flavor}`);
        }
        variantId = variant.id;
    }
    
    const cart = (await getCart()) ?? (await createCart());

    const articleInCart = cart.items.find(item => item.variantId === variantId)

    if(articleInCart){
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: {
                    update: {
                        where: { id: articleInCart.id },
                        data: { quantity: {increment: 1}},
                    },
                },
            },
        });
    } else {
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: {
                    create: {
                        variantId: variantId,
                        quantity: 1,
                        isSelected: true
                    }
                }
            }
        })
    }

    revalidatePath("/order-menu/[id]", "layout")
}