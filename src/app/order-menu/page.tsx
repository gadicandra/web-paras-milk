import ProductCard from "@/components/ProductCard";
import { prisma } from "../../../lib/prisma";
// import Image from "next/image";
// import Link from "next/link";

 export default async function OrderMenu(){
    const products = await prisma.product.findMany();
    return (
        <div>
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* <Link href={"/order-menu/" + products[0].id} className="hero rounded-xl bg-base-200">
                    <div className="hero-content flex-col lg:flex-row">
                        <Image
                            src={products[0].imageUrl}
                            alt={products[0].name}
                            width={400}
                            height={800}
                            className="w-[100px] rounded-lg shadow-2xl"
                            priority
                            />
                        <div>
                            <h1 className="text-5xl font-bold">{products[0].name}</h1>
                            <p className="py-6">{products[0].description}</p>
                        </div>
                    </div>
                </Link> */}
                {products.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))}
            </div>
        </div>
    )
 }