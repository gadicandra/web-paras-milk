export type TransactionStatus = 
    | 'capture'     // Credit card transaction is captured successfully
    | 'settlement'  // Transaction is settled successfully
    | 'pending'     // Transaction is created and waiting for payment
    | 'deny'        // Transaction is denied by bank or FDS
    | 'cancel'      // Transaction is cancelled by merchant or customer
    | 'expire'      // Transaction is expired (not paid within time limit)
    | 'failure'     // Transaction failed to process
    | 'authorize'   // Credit card transaction is authorized but not captured
    | 'partial_capture'  // Credit card transaction is partially captured
    | 'partial_refund'   // Transaction is partially refunded
    | 'refund';     // Transaction is refunded

export type PaymentStatusGroup = 
    | 'success'   // Pembayaran berhasil dan selesai
    | 'pending'   // Pembayaran sedang diproses
    | 'failed'    // Pembayaran gagal
    | 'cancelled' // Pembayaran dibatalkan
    | 'refunded'  // Pembayaran dikembalikan
    | 'unknown';  // Status tidak dikenal

export type FraudStatus = 
    | 'accept'     // Transaction is safe
    | 'challenge'  // Transaction is flagged as suspicious
    | 'deny';      // Transaction is denied due to fraud

export type PaymentType = 
    // Credit Card
    | 'credit_card'
    
    // Bank Transfer
    | 'bank_transfer'
    | 'permata_va'
    | 'bca_va'
    | 'bni_va'
    | 'bri_va'
    | 'other_va'
    
    // E-Wallet
    | 'gopay'
    | 'shopeepay'
    | 'dana'
    | 'ovo'
    | 'linkaja'
    
    // Convenience Store
    | 'cstore'
    | 'indomaret'
    | 'alfamart'
    
    // Online Banking
    | 'bca_klikbca'
    | 'bca_klikpay'
    | 'bri_epay'
    | 'cimb_clicks'
    | 'danamon_online'
    
    // Others
    | 'echannel'
    | 'qris'
    | 'akulaku'
    | 'kredivo'
    | string; // Allow custom payment types

export interface VANumber {
    bank: string;
    va_number: string;
}

export interface SnapTransactionResult {
    order_id?: string;
    transaction_id?: string;
    transaction_status?: TransactionStatus;
    payment_type?: PaymentType;
    gross_amount?: string;
    transaction_time?: string;
    va_numbers?: VANumber[];
    fraud_status?: FraudStatus;
    pdf_url?: string;
    finish_redirect_url?: string;
    status_code?: string;
    status_message?: string;
}

export interface MidtransStatusResponse {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    merchant_id: string;
    gross_amount: string;
    currency: string;
    payment_type: PaymentType;
    transaction_time: string;
    transaction_status: TransactionStatus
    settlement_time?: string;
    fraud_status: FraudStatus
    bank?: string;
    va_numbers?: VANumber[];
    pdf_url?: string;
    finish_redirect_url?: string;
    signature_key? : string;
}

export interface SnapOptions {
    onSuccess?: (result: SnapTransactionResult) => void;
    onPending?: (result: SnapTransactionResult) => void;
    onError?: (result: SnapTransactionResult) => void;
    onClose?: () => void;
}

declare global {
    interface Window {
        snap: {
            pay: (token: string, options?: SnapOptions) => void;
            embed: (token: string, options: SnapEmbedOptions) => void;
            hide: () => void;
            show: () => void;
        }
    }
}

export {}




