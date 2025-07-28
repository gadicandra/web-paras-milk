import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface MidtransStatusResponse {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    merchant_id: string;
    gross_amount: string;
    currency: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire' | 'failure';
    settlement_time?: string;
    fraud_status: 'accept' | 'challenge' | 'deny';
    bank?: string;
    va_numbers?: Array<{
        bank: string;
        va_number: string;
    }>;
    pdf_url?: string;
    finish_redirect_url?: string;
}

interface ErrorResponse {
    message: string;
    error?: string | Record<string, unknown>
}

interface TransactionStatusRequest extends NextApiRequest{
    query: {
        transactionId: string;
    }
}

export default async function handler(
    req: TransactionStatusRequest,
    res: NextApiResponse<MidtransStatusResponse | ErrorResponse>
) : Promise<void>{
    if(req.method !== 'GET'){
        return res.status(405).json({ message: 'Method not allowed '});
    }

    const { transactionId } = req.query;

    if(!transactionId || typeof transactionId !== 'string'){
        return res.status(400).json({ message: 'Transaction ID is required' });
    }

    try{
        const serverKey = process.env.SECRET as string;
        const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true"
        
        if(!serverKey){
            throw new Error('MIDTRANS_SERVER_KEY is not configured');
        }

        const authString = Buffer.from(serverKey + ':').toString('base64');
        const midtransUrl = isProduction
            ? `https://api.midtrans.com/v2/${transactionId}/status`
            : `https://api.sandbox.midtrans.com/v2/${transactionId}/status`;

        const response: AxiosResponse<MidtransStatusResponse> = await axios.get(midtransUrl, {
            headers:{
                'Accept': "application/json",
                "Content-Type": "application/json",
                "Authorization": `Basic ${authString}`
            }
        })

        console.log("Midtrans status response:", response.data);

        const transactionData: MidtransStatusResponse = response.data;

        res.status(200).json(transactionData)
    } catch(error){
        console.error("Error fetching transaction status:", error);

        if(axios.isAxiosError(error) && error.response){
            const errorData = error.response.data as Record<string, unknown>;
            res.status(error.response.status).json({
                message: "Failed to get transaction status",
                error: errorData
            })
        } else {
            res.status(500).json({
                message: 'Internal server error',
                error: error instanceof Error ? error.message: "Unknown error"
            })
        }
    }
}

// Utility function untuk type-safe status checking
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