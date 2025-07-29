import Midtrans from "midtrans-client-typescript"
import { NextRequest, NextResponse } from "next/server";
import { ShoppingCart } from "../../../../lib/cart";
import CreateSnapShot from "../../../../lib/snapShotCart";


const snap = new Midtrans.Snap({
    isProduction: Boolean(process.env.MIDTRANS_IS_PRODUCTION),
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
})

const validateEnvVars = () => {
    console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
    console.log('MIDTRANS_SERVER_KEY exists:', !!process.env.MIDTRANS_SERVER_KEY);
    console.log('NEXT_PUBLIC_MIDTRANS_CLIENT_KEY exists:', !!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
    console.log('MIDTRANS_IS_PRODUCTION:', process.env.MIDTRANS_IS_PRODUCTION);
    
    if (process.env.MIDTRANS_SERVER_KEY) {
        console.log('Server key prefix:', process.env.MIDTRANS_SERVER_KEY.substring(0, 3));
        console.log('Server key length:', process.env.MIDTRANS_SERVER_KEY.length);
    }
    
    if (process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
        console.log('Client key prefix:', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY.substring(0, 3));
        console.log('Client key length:', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY.length);
    }
    
    const requiredVars = {
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
        isProduction: process.env.MIDTRANS_IS_PRODUCTION
    };

    console.log('All environment variables validated successfully');
    return requiredVars;
};

export async function POST(request: NextRequest) {
    try{

        const envVars = validateEnvVars();
        
        console.log('Initializing Midtrans Snap with:');
        console.log('- isProduction:', envVars.isProduction === 'true');
        console.log('- serverKey prefix:', envVars.serverKey?.substring(0, 6) + '...');
        console.log('- clientKey prefix:', envVars.clientKey?.substring(0, 6) + '...');

        // Initialize Midtrans Snap dengan error handling
        try {
            console.log('Midtrans Snap initialized successfully');
        } catch (snapError) {
            console.error('Error initializing Midtrans Snap:', snapError);
            throw new Error(`Failed to initialize Midtrans: ${snapError}`);
        }

        const body: ShoppingCart = await request.json()

        function createItemDetails(body: ShoppingCart){
            let totalAmount = 0;
            const timestamp = Date.now();
            const random= Math.random().toString(36).substring(2,15);
            const orderId = `ORD-${timestamp}-${random}`

            const itemDetails = body.items.map(product => {
                const { variant, quantity} = product
                const subtotal = variant.price * quantity;
                totalAmount += subtotal;

                return{
                    id: variant.id.toString(),
                    name: variant.name,
                    price: variant.price,
                    quantity: quantity
                }
            })

            return { orderId, itemDetails, totalAmount }
        }

        const { orderId, itemDetails, totalAmount } = createItemDetails(body)
        try {
            await CreateSnapShot(orderId, body);
            console.log('Snapshot created successfully for order:', orderId);
        } catch (snapshotError) {
            console.error('Error creating snapshot:', snapshotError);
        }
        const parameter = {
            item_details: itemDetails,
            transaction_details: {
                order_id: orderId,
                gross_amount: totalAmount
            }
        }
    
        const token = await snap.createTransactionToken(parameter);
        console.log(token)

        if (!token) {
            throw new Error('No token received from Midtrans');
        }
        return NextResponse.json({ token })
    } catch (error){
        console.error("Error creating Midtrans token:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: "Failed to create payment token", error: errorMessage },
            { status: 500 } // Gunakan status 500 (Internal Server Error)
        );
    }
}