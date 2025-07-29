import axios, { AxiosResponse } from "axios";
import { MidtransStatusResponse } from "../../../../../@types/midtrans";
import { NextRequest, NextResponse } from "next/server";

interface ErrorResponse {
    message: string;
    error?: string | Record<string, unknown>
}

export async function GET(
    req: NextRequest,
    { params }: {params : Promise<{transactionId: string}>}
): Promise<NextResponse<MidtransStatusResponse | ErrorResponse>> {
    console.log('=== TRANSACTION STATUS API START ===');
    
    const { transactionId }  = await params;
    console.log('Transaction ID:', transactionId);

    if (!transactionId) {
        console.error('No transaction ID provided');
        return NextResponse.json(
            { message: 'Transaction ID is required' },
            { status: 400}
        );
    }

    try {
        const serverKey = process.env.SECRET as string;
        const isProduction = Boolean(process.env.MIDTRANS_IS_PRODUCTION);
        
        console.log('Server key exists:', !!serverKey);
        console.log('Is production:', isProduction);
        
        if (!serverKey) {
            console.error('MIDTRANS_SERVER_KEY is not configured');
            throw new Error('MIDTRANS_SERVER_KEY is not configured');
        }

        const authString = Buffer.from(serverKey + ':').toString('base64');
        const midtransUrl = isProduction
            ? `https://api.midtrans.com/v2/${transactionId}/status`
            : `https://api.sandbox.midtrans.com/v2/${transactionId}/status`;

        console.log('Midtrans URL:', midtransUrl);
        console.log('Making request to Midtrans...');

        const response: AxiosResponse<MidtransStatusResponse> = await axios.get(midtransUrl, {
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json",
                "Authorization": `Basic ${authString}`
            },
            timeout: 10000 // 10 second timeout
        });

        console.log("Midtrans status response:", response.data);
        console.log('=== TRANSACTION STATUS SUCCESS ===');

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('=== TRANSACTION STATUS ERROR ===');
        console.error("Error fetching transaction status:", error);

        if (axios.isAxiosError(error)) {
            console.error('Axios error details:');
            console.error('- Status:', error.response?.status);
            console.error('- Status text:', error.response?.statusText);
            console.error('- Data:', error.response?.data);
            console.error('- URL:', error.config?.url);
            
            if (error.response) {
                const errorData = error.response.data as Record<string, unknown>;
                return NextResponse.json({
                    message: "Failed to get transaction status",
                    error: errorData
                },
                {
                    status: error.response.status
                });
            } else if (error.code === 'ECONNABORTED') {
                return NextResponse.json({
                    message: 'Request timeout',
                    error: 'The request to Midtrans timed out'
                },
                {
                    status: 408
                });
            } else {
                return NextResponse.json({
                    message: 'Network error',
                    error: error.message
                },
                {
                    status: 500
                });
            }
        } else {
            console.error('Non-axios error:', error);
            return NextResponse.json({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : "Unknown error"
            },
            {
                status: 500
            });
        }
    }
}