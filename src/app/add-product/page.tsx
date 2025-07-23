import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import FormSubmitButton from "@/components/FormSubmitButton";
import { authOptions } from "../../../lib/auth";

export const metadata = {
  title: "Add Product - Paras Milk"
}

async function addProduct(formData: FormData){
  "use server"

  const session = await getServerSession(authOptions)
  
  if(!session){
    redirect("/api/auth/signin?callbackUrl=/add-product")
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageurl")?.toString();

  if(!name || !description || !imageUrl){
    throw Error("Missing required fields")
  }

  // for(let i = 0; i < 50; i++){
  //   await prisma.product.create({
  //     data: {name, description, imageUrl}
  //   })
  // }

  await prisma.product.create({
    data: {name, description, imageUrl}
  })

  redirect("/");
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions)
  if(!session){
    redirect("/api/auth/signin?callbackUrl=/add-product")
  }
  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name"
          className="input input-bordered mb-3 w-full"
        />
        <textarea 
        required
        name="description"
        placeholder="description"
        className="textarea-bordered text area mb-3 w-full"
        />
        <input
          required
          name="imageurl"
          placeholder="Image Url"
          className="input input-bordered mb-3 w-full"
        />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
