import Midtrans from "midtrans-client-typescript"
import { NextRequest, NextResponse } from "next/server";
import { ShoppingCart } from "../../../../lib/cart";
import CreateSnapShot from "../../../../lib/snapShotCart";

// Inisialisasi Snap client. Pastikan environment variable sudah benar.
const snap = new Midtrans.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true', // Pastikan konversi ke boolean benar
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request: NextRequest) {
    try {
        const body: ShoppingCart = await request.json();

        // Validasi sederhana untuk memastikan body dan item ada
        if (!body || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { message: "Invalid request body. Cart items are required." },
                { status: 400 }
            );
        }

        // 1. Memproses detail item dan menghitung total
        let totalAmount = 0;
        const itemDetails = body.items.map(product => {
            const { variant, quantity } = product;
            const subtotal = variant.price * quantity;
            totalAmount += subtotal;

            return {
                id: variant.id.toString(),
                name: variant.name,
                price: variant.price,
                quantity: quantity
            };
        });

        // 2. Membuat Order ID yang unik
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        const orderId = `ORDER-${timestamp}-${random}`;

        // 3. (Opsional tapi direkomendasikan) Menyimpan snapshot keranjang belanja
        try {
            await CreateSnapShot(orderId, body);
            console.log('Snapshot created successfully for order:', orderId);
        } catch (snapshotError) {
            console.error('Error creating snapshot:', snapshotError);
            // Anda bisa memilih untuk menghentikan proses jika snapshot gagal, atau tetap lanjut
        }

        // 4. Menyusun parameter LENGKAP untuk Midtrans
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: totalAmount
            },
            item_details: itemDetails,
        };

        console.log("Parameter yang dikirim ke Midtrans:", JSON.stringify(parameter, null, 2));

        // 5. Memanggil API Midtrans untuk membuat token
        // FIX: `createTransactionToken` mengembalikan sebuah objek, bukan hanya string token.
        const token = await snap.createTransactionToken(parameter);
        
        console.log("Respons dari Midtrans:", token);

        if (!token) {
            // Jika token tidak ada, kemungkinan ada error dari Midtrans
            throw new Error('No token received from Midtrans. Response: ' + JSON.stringify(token));
        }
        
        // 7. Mengirim token kembali ke client
        return NextResponse.json({ token });

    } catch (error) {
        // Penanganan error yang lebih baik
        console.error("Error saat membuat token pembayaran:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { message: "Failed to create payment token", error: errorMessage },
            { status: 500 }
        );
    }
}
