"use client";

import Image from "next/image";
import { CartItemWithProduct } from "../../../lib/cart";
import Link from "next/link";
import { formatPrice } from "../../../lib/format";
import { JSX, useTransition } from "react";
import { setProductQuantity } from "./actions";

interface CartEntryProps {
    cartItem: CartItemWithProduct,
    setProductQuantity: (variantId: number, quantity: number) => Promise<void>;
}

export default function CartEntry({cartItem: {variant, quantity}}: CartEntryProps){
    const [isPending, startTransition] = useTransition()
    const quantityOptions: JSX.Element[] = []
    for(let i = 1; i <= 99; i++){
        quantityOptions.push(
            <option value={i} key={i}>
                {i}
            </option>
        )
    }
    return(
        <div>
            <div>
                <div className="flex flex-wrap items-center gap-3">
                    {variant.imageUrl && <Image
                    src={variant.imageUrl}
                    alt={variant.name}
                    width={200}
                    height={200}
                    className="rounded-lg"
                    />}
                </div>
                <div>
                    <Link href={"/order-menu/" + variant.id} className="font-bold">
                        {variant.name}
                    </Link>
                    <div>Price: {formatPrice(variant.price)}</div>
                    <div className="my-1 flex items-center gap-2">
                        Quantity:
                        <select
                        className="select select-bordered w-full max-w-[80px]"
                        defaultValue={quantity}
                        onChange={e => {
                            const newQuantity = parseInt(e.currentTarget.value)
                            startTransition(async () => {
                                await setProductQuantity(variant.id, newQuantity)
                            })
                        }}
                        >
                            <option value={0}>0 (Remove)</option>
                            {quantityOptions}
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        Total: {formatPrice(variant.price * quantity)}
                        {isPending && <span className="loading loading-spinner loading-sm" />}
                    </div>
                    
                </div>
            </div>
            <div className="divider"></div>
        </div>
    )
}