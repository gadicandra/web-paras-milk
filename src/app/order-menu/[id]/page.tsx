import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { Metadata } from "next";
import { cache } from "react";
import { getUniqueFlavors, getUniqueSize } from "../../../../lib/data";
import DynamicPage from "./DynamicPage";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getProduct = cache(async (id: number) => {
  const product = await prisma.product.findUnique({ where: { id: id } });
  if (!product) notFound();
  return product;
});

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const numId = Number(id);
  const variant = await getProduct(numId);
  return {
    title: variant.name,
    description: variant.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const numId = Number(id);
  const product = await getProduct(numId);
  const flavor = await getUniqueFlavors(numId);
  const size = await getUniqueSize(numId);
  return (
    <div className="flex max-w-7xl items-center">
        <div className="max-w-4xl p-4 md:p-8">
            <DynamicPage numId={numId} product={product} flavors={flavor} sizes={size}/>
        </div>
    </div>
  );
}
