import { getCart } from "../../../lib/cart"
import { formatPrice } from "../../../lib/format";
import SnapMidtrans from "./actionMidtrans";
import { setProductQuantity } from "./actions";
import CartEntry from "./cartEntry";
import Checkout from "./checkout";

export const metadata = {
    title: "Your Cart - Paras Milk"
}

export default async function CartPage(){
    const cart = await getCart();

    return (
    <div>
        <SnapMidtrans/>
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cart?.items.map(cartItem => 
            <CartEntry cartItem={cartItem} key={cartItem.id} setProductQuantity={setProductQuantity} />
        )}
        {!cart?.items.length && <p>Your cart is empty.</p>}
        <div className="flex flex-col items-end sm:items-center">
            <p className="mb-3 font-bold">
                Total: {formatPrice(cart?.subtotal || 0)}
            </p>
            <Checkout/>
        </div>
    </div>)
}