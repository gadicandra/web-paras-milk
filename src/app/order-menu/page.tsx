import ProductCard from "@/components/ProductCard";
import { prisma } from "../../../lib/prisma";

 export default async function OrderMenu(){
    const products = await prisma.product.findMany();
    return (
        <div>
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))}
            </div>
        </div>
    )
 }