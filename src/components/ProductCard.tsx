import { Product, ProductVariant } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
    product: Product
}

export default function ProductCard({product}: ProductCardProps){
    return(
        <Link
        href={"/order-menu/" + product.id}
        className="card w-full bg-base-100 hover:shadow-xl transition-shadow"
        >
            <figure>
                <Image 
                src={product.imageUrl}
                alt={product.name}
                width={800}
                height={400}
                className="h-[100px] object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {product.name}
                </h2>
                <p>{product.description}</p>
            </div>
        </Link>
    )
}