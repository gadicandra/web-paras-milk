import { MidtransStatusResponse } from "../../../../../@types/midtrans";
import crypto from 'crypto'
import { prisma } from "../../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatusGroup, MidtransError, validateMidtransResponse } from "../../../../../utils/midtrans";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY as string;

function validateSignature(payload: MidtransStatusResponse): boolean {
    const { order_id, status_code, gross_amount, signature_key } = payload;

    if(!signature_key){
        console.error('No signature_key provided in webhook payload');
        return false;
    }

    const stringToHash = order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY;

    const calculatedSignature = crypto
        .createHash('sha512')
        .update(stringToHash)
        .digest('hex');

    const isSignatureValid = calculatedSignature === signature_key;
    return isSignatureValid;
}

async function handlePaymentSuccess(sessionId: string){
    try{
        console.log(`Processing payment success for session: ${sessionId}`)

        const result = await prisma.$transaction(async (tx) => {
            const snapshotItems = await tx.snapShotCart.findMany({
                where: { sessionId },
                include: {
                    cart: {
                        include: { user: true}
                    }
                }
            })

            if(snapshotItems.length === 0){
                throw new Error("No snapshot found for this sessionId")
            }

            const userId = snapshotItems[0].userId;
            const totalAmount = snapshotItems.reduce((sum, item) =>
                sum + Number(item.subTotal), 0
            );

            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    sessionId: sessionId,
                    totalAmount: Math.round(totalAmount),
                    status: 'completed',
                    paymentMethod: 'midtrans',
                    details: {
                        create: snapshotItems.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.priceSnapshot,
                            subTotal: item.subTotal
                        }))
                    }
                },
                include: {
                    details: true
                }
            })

            console.log(`Transaction created with ID: ${transaction.id}`);

            const deletedCount = await tx.snapShotCart.deleteMany({
                where: { sessionId }
            })

            console.log(`Deleted ${deletedCount.count} snapshot items`)

            const cartId = snapshotItems[0].cartId;
            const clearedCartItems = await tx.cartItem.deleteMany({
                where: { cartId }
            })

            console.log(`Cleared ${clearedCartItems.count} cart items`);

            return {
                sessionId: transaction.sessionId,
                itemProcessed: snapshotItems.length,
                cartCleared: clearedCartItems.count
            }
        })

        console.log(`Payment success processed successfully:`, result);
        return { success: true, ...result };
    } catch(error){
        console.error('Error handling payment success: ', error)
        throw error;
    }
}

async function handlePaymentFailed(sessionId: string){
    try{
        console.log(`Processing payment failde for this sessionId`);

        const result = await prisma.$transaction(async (tx) => {
            const snapshotItems = await tx.snapShotCart.findMany({
                where: { sessionId }
            })

            if(snapshotItems.length === 0){
                console.log(`No snapshot found`)
                return { alreadyProcessed: true }
            }

            const cartId = snapshotItems[0].cartId;
            console.log("Restoring cart")

            const existingCartItems = await tx.cartItem.findMany({
                where: { cartId }
            })

            let mergedItems = 0;
            let newItems = 0;

            for(const snapshotItem of snapshotItems){
                const existingItem = existingCartItems.find(
                    item => item.variantId === snapshotItem.variantId
                )

                if(existingItem){
                    await tx.cartItem.update({
                        where: { id: existingItem.id },
                        data: {
                            quantity: existingItem.quantity + snapshotItem.quantity
                        }
                    })
                    mergedItems++;
                } else {
                    await tx.cartItem.create({
                        data: {
                            cartId,
                            variantId: snapshotItem.variantId,
                            quantity: snapshotItem.quantity,
                            isSelected: true
                        }
                    })
                    newItems++;
                }
            }

            const deletedCount = await tx.snapShotCart.deleteMany({
                where: { sessionId }
            })

            return{
                mergedItems,
                newItems,
                deletedSnapshots: deletedCount.count
            }
        })

        return{ success: true, ...result }
    } catch (error){
        console.error("Error handling payment failed:", error)
        throw error
    }
}

export async function POST(req: NextRequest){
    console.log('=== MIDTRANS WEBHOOK RECEIVED ===');

    try{
        const body = await req.json();
        const payload = validateMidtransResponse(body);
        if(!validateSignature(payload)){
            console.error('❌ Invalid signature from Midtrans webhook');
            console.error('This could indicate:');
            console.error('1. Wrong server key configuration');
            console.error('2. Payload tampering');
            console.error('3. Request not from Midtrans');

            return NextResponse.json(
                { message: "Invalid signature" },
                { status: 401 }
            )
        }

        const { transaction_status, order_id } = payload

        console.log("Processing webhook")
        const statusGroup = getPaymentStatusGroup(transaction_status)
        console.log(`Status group: ${statusGroup}`)

        switch(statusGroup){
            case 'success':
                const successResult = await handlePaymentSuccess(order_id);
                console.log("Success handler completed:", successResult);
                break;
            case "failed":
                const failedResult = await handlePaymentFailed(order_id);
                console.log("Failed handler completed:", failedResult);
                break;
            case "pending":
                console.log("Payment Pending - no action taken")
                break;
            default:
                console.log(`Unhandled status group: ${statusGroup}`)
        }

        return NextResponse.json(
            { message: "Webhook processed" },
            { status: 200}
        )
    } catch (error){
        if(error instanceof MidtransError){
            console.error('Midtrans validation error:', error.message);
            console.error('Status code:', error.statusCode);
            console.error('Response:', error.response);
        } else {
            console.error('Webhook processing error:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        }

        return NextResponse.json(
            { message: "Webhook error logged"},
            { status: 200}
        )
    }
}

export async function GET() {
    return NextResponse.json(
        { message: 'Midtrans webhook endpoint - POST only' },
        { status: 405 }
    );
}

export async function PUT() {
    return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
    );
}