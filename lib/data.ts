import { prisma } from "./prisma";

export async function getUniqueFlavors(productId: number): Promise<string[]>{
    try{
        const flavorsResult = await prisma.$queryRaw<Array<{ flavor: string}>>`
        SELECT DISTINCT attributes->>'flavor' AS flavor
        FROM "product_variant"
        WHERE product_id = ${productId}
        `;

        const flavors = flavorsResult.map(item => item.flavor);
        return flavors
    } catch (error){
        console.error("Database Error: Gagal mengambil data rasa.", error);
        return [];
    }
}

export async function getUniqueSize(productId: number): Promise<string[]>{
    try{
        const sizeResult = await prisma.$queryRaw<Array<{ size: string }>>`
        SELECT DISTINCT attributes->>'size' AS size
        FROM "product_variant"
        WHERE product_id = ${productId}
        `;

        const sizes = sizeResult.map(item => item.size);
        return sizes
    } catch (error){
        console.error("Database Error: Gagal mengambil data ukuran.", error);
        return [];
    }
}