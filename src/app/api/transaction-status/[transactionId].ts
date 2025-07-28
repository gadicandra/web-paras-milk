import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { MidtransStatusResponse } from "../../../../@types/midtrans";


interface ErrorResponse {
    message: string;
    error?: string | Record<string, unknown>
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MidtransStatusResponse | ErrorResponse>
): Promise<void> {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    console.log('=== TRANSACTION STATUS API START ===');
    
    const { transactionId } = req.query;
    console.log('Transaction ID:', transactionId);

    if (!transactionId || typeof transactionId !== 'string') {
        console.error('No transaction ID provided');
        return res.status(400).json({ message: 'Transaction ID is required' });
    }

    try {
        const serverKey = process.env.SECRET as string;
        const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
        
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

        const transactionData: MidtransStatusResponse = response.data;
        res.status(200).json(transactionData);

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
                res.status(error.response.status).json({
                    message: "Failed to get transaction status",
                    error: errorData
                });
            } else if (error.code === 'ECONNABORTED') {
                res.status(408).json({
                    message: 'Request timeout',
                    error: 'The request to Midtrans timed out'
                });
            } else {
                res.status(500).json({
                    message: 'Network error',
                    error: error.message
                });
            }
        } else {
            console.error('Non-axios error:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}

// Utility functions for type-safe status checking
export const isSuccessfulTransaction = (status: string): boolean => {
    return status === 'capture' || status === 'settlement';
};

export const isPendingTransaction = (status: string): boolean => {
    return status === 'pending';
};

export const isFailedTransaction = (status: string): boolean => {
    return ['deny', 'cancel', 'expire', 'failure'].includes(status);
};

// Type guard function
export const isMidtransStatusResponse = (obj: unknown): obj is MidtransStatusResponse => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof (obj as Record<string, unknown>).status_code === 'string' &&
        typeof (obj as Record<string, unknown>).transaction_id === 'string' &&
        typeof (obj as Record<string, unknown>).order_id === 'string' &&
        typeof (obj as Record<string, unknown>).transaction_status === 'string'
    );
};