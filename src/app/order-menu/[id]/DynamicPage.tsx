"use client"

import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./actions";
import { Product } from "@prisma/client";
import { useState } from "react";

interface DynamicPageProps {
    numId: number
    product: Product
    flavors: string[]
    sizes: string[]
}

export default function DynamicPage({numId, product, flavors, sizes}: DynamicPageProps){
    const [flavorSelected, setFlavorSelected] = useState("Plain");
    const [sizeSelected, setSizeSelected] = useState("500ml")

    const getImageUrl = (id: number, flavor: string, size: string): string => {
        if(id === 3){
            switch(flavor){
                case "Kopi":
                    return "/product/kopi_premium.png";
                case "Matcha":
                    return "/product/matcha_premium.jpg";
                default:
                    return product.imageUrl;
            }
        } else if(id === 2){
            switch(size){
                case "250ml":
                    return "/product/susu_250ml.png";
                case "500ml":
                    return "/product/susu_500ml.png";
                case "1L":
                    return "/product/susu_1L_botol.png";
                default:
                    return product.imageUrl;
            }
        }
        return product.imageUrl;
    }

    const id = numId
    const dynamicImageUrl = getImageUrl(id, flavorSelected, sizeSelected);
    console.log("State Rasa:", flavorSelected);
    console.log("State Ukuran:", sizeSelected);
    console.log("URL Gambar yang Dihasilkan:", dynamicImageUrl);
    if(numId === 2){
        const handleFlavorSelected = (flavor: string) => {
            setFlavorSelected(flavor);
        };
        const handleSizeSelected = (size: string) => {
            setSizeSelected(size);
        };
        return (
            <div className="flex flex-col sm:flex-row">
                <div className="flex justify-center sm:w-1/2 pt-4">
                    <Image
                        key={`${flavorSelected}-${sizeSelected}-${dynamicImageUrl}`}
                        src={dynamicImageUrl}
                        alt={`Susu ${flavorSelected} ${sizeSelected}`}
                        width={300}
                        height={300}
                        className="w-[30%] object-cover rounded-lg"
                        priority
                    />
                </div>
                <div className="sm:w-1/2 p-6 flex flex-col justify-center space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold mt-1">{`Susu ${flavorSelected} ${sizeSelected}`}</h1>
                        <span className="mt-2 inline-block bg-yellow-400 text-white text-cs font-semibold px-3 py-1 rounded-full">Best Seller</span>
                    </div>
                    <p className="py-3">{product.description}</p>
                    <div className="flex flex-col gap-3">
                        <div>Flavor</div>
                        <div className="flex flex-row">
                            {flavors.map((flavor) => (
                                <button 
                                key={flavor}
                                onClick={() => handleFlavorSelected(flavor)}
                                className={`px-5 py-2 mr-2 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out hover:cursor-pointer
                                    ${flavorSelected === flavor ? 'bg-blue-600 border-transparent shadow-lg':'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
                                >{flavor}</button>
                            ))}
                        </div>
                        <div>Size</div>
                        <div className="flex flex-row">
                            {sizes.map((size)=> (
                                <button 
                                key={size}
                                onClick={() => handleSizeSelected(size)}
                                className={`px-5 py-2 mr-2 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out hover:cursor-pointer 
                                    ${sizeSelected === size ? 'bg-blue-600 border-transparent shadow-lg':'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
                                >{size}</button>
                            ))}
                        </div>
                    </div>
                    <AddToCartButton
                    productId={numId}
                    flavor={flavorSelected}
                    size={sizeSelected}
                    incrementProductQuantity={incrementProductQuantity}
                    />
                </div>
            </div>
        )
    } else if(numId === 3){
        const handleFlavorSelected = (flavor: string) => {
            setFlavorSelected(flavor);
        };
        return (
            <div className="flex flex-col sm:flex-row">
                <div className="flex justify-center sm:w-1/2 pt-4">
                        <Image
                        key={`${flavorSelected}-${dynamicImageUrl}`}
                        src={dynamicImageUrl}
                        alt={`Susu Premium ${flavorSelected}`}
                        width={300}
                        height={300}
                        className="w-[30%] object-cover rounded-lg"
                        priority
                    />
                </div>
                <div className="sm:w-1/2 p-6 flex flex-col space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold mt-1">{`Paras Milk Premium ${flavorSelected}`}</h1>
                        <span className="mt-2 inline-block bg-yellow-400 text-white text-cs font-semibold px-3 py-1 rounded-full">Best Seller</span>
                    </div>
                    <p className="py-3">{product.description}</p>
                    <div className="flex flex-col gap-3">
                        <div>Flavor</div>
                        <div className="flex flex-row">
                            {flavors.map((flavor) => (
                                <button 
                                key={flavor}
                                onClick={() => handleFlavorSelected(flavor)}
                                className={`px-5 py-2 mr-2 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out hover:cursor-pointer
                                    ${flavorSelected === flavor ? 'bg-blue-600 border-transparent shadow-lg':'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
                                >{flavor}</button>
                            ))}
                        </div>
                        <AddToCartButton
                        productId={numId}
                        flavor={flavorSelected}
                        size={sizeSelected}
                        incrementProductQuantity={incrementProductQuantity}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
