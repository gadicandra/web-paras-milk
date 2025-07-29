import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "../../../../lib/prisma";
import { Metadata } from "next";
import Image from "next/image";

interface TransactionDetailPageProps{
    params: Promise<{
        sessionId: string;
    }>
}

const getTransactionDetail = cache(async (sessionId: string) => {
    const transactionDetails = await prisma.transactionDetail.findMany({ 
        where: {
            sessionId: sessionId
        },
        include: {
            variant: true
        }
    });

    if(transactionDetails.length === 0){
         notFound();
    }
    return transactionDetails
})

export async function generateMetadata({ params }: TransactionDetailPageProps): Promise<Metadata> {
  const { sessionId } = await params
  return {
    title: `Detail Transaksi - ${sessionId}`
  };
}

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps){
    const { sessionId } = await params;
    const transactionDetails = await getTransactionDetail(sessionId)
    const totalAmount = transactionDetails.reduce((sum, item) => sum + Number(item.subTotal), 0);
    return(
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Detail Transaksi</h1>
                <p className="text-sm text-gray-500 mb-6">Order ID: {sessionId}</p>
                <div className="space-y-4 mb-6">
                    {transactionDetails.map((detail) => (
                        <div key={detail.id} className="flex justify-between items-center border-b pb-4">
                            <div className="flex items-center">
                                <div className="w-16 h-16 mr-4 flex-shrink-0">
                                    {detail.variant.imageUrl ? (
                                        <Image 
                                            src={detail.variant.imageUrl} 
                                            alt={detail.variant.name}
                                            width={64} // Wajib untuk gambar eksternal
                                            height={64} // Wajib untuk gambar eksternal
                                            className="w-full h-full object-cover rounded-md" 
                                        />
                                    ) : (
                                        // Placeholder jika tidak ada gambar
                                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">{detail.variant.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {detail.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(detail.price))}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold text-gray-800">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(detail.subTotal))}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end items-center pt-4 border-t">
                    <p className="text-lg font-bold text-gray-800">Total Pembayaran:</p>
                    <p className="text-lg font-bold text-blue-600 ml-4">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalAmount)}
                    </p>
                </div>
            </div>
        </div>
    );
}