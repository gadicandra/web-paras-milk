import Link from "next/link";
import React from "react";

export default function Thankspage(){
    return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-4">
            <h3 className="text-center">Terimakasih telah melakukan pembayaran</h3>
            <Link href="/" className="text-center"></Link>
        </div>
    )
}