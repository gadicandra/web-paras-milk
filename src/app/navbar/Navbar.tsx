import Link from "next/link";
import Image from "next/image";
import { getCart } from "../../../lib/cart";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function NavBar(){
    const session = await getServerSession(authOptions);
    const cart = await getCart();
    return(
        <div className="bg-base-100">
            <div className="navbar max-w-7xl m-auto flex-col sm:flex-row">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost">
                        <Image src={"/logo/logo_paras.png"} height={40} width={40} alt="Paras Logo" />
                        Paras Milk
                    </Link>
                </div>
                <div className="flex-none">
                    <ShoppingCartButton cart={cart} />
                    <UserMenuButton session={session} />
                </div>
            </div>
        </div>

    )
}