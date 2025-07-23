import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "../../../lib/prisma";

export const Metadata = {
    title: "Add Product Variant - Paras Milk"
}

async function addProductVariant(formData: FormData){
    "use server"

    const productId = Number(formData.get("product_id"));
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price"));
    const imageUrl = formData.get("image_url")?.toString();

    if(!productId || !name || !price || !imageUrl){
        throw Error("Missing Required Fields")
    }

    await prisma.productVariant.create({
        data: {
            product: {
                connect: {
                    id: productId,
                }
            },
            name,
            price, 
            imageUrl
        }
    })
}

export default async function AddProductVariantPage(){
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
        }
    });

    return(
        <div>
            <h1>Add Product Variant</h1>
            <form action={addProductVariant}>
                <select
                    required
                    name="product_id"
                >
                    <option value="" disabled selected>-- Pilih Produk --</option>
                    {products.map((product) => <option key={product.id} value={product.id}>
                        {product.name}
                    </option>)}
                </select>
                <input
                    required
                    name="name"
                    placeholder="Name"
                    className="input input-bordered mb-3 w-full"
                />
                <input
                    required
                    name="price"
                    placeholder="Price"
                    className="input input-bordered mb-3 w-full"
                />
                <input
                    required
                    name="image_url"
                    placeholder="Image Url"
                    className="input input-bordered mb-3 w-full"
                />
                <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
            </form>
        </div>
    )
}
