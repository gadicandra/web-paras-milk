import { MidtransStatusResponse, PaymentStatusGroup, TransactionStatus } from "../@types/midtrans";

export class MidtransError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public response?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'MidtransError';
    }
}

// Type guard to check if value is a record (object with string keys)
export const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

// Safe property access helpers
export const getStringProperty = (obj: Record<string, unknown>, key: string): string | undefined => {
    const value = obj[key];
    return typeof value === 'string' ? value : undefined;
};

export const getNumberProperty = (obj: Record<string, unknown>, key: string): number | undefined => {
    const value = obj[key];
    return typeof value === 'number' ? value : undefined;
};

export const validateMidtransResponse = (obj: unknown): MidtransStatusResponse => {
    if (!isRecord(obj)) {
        throw new MidtransError('Invalid response format: not an object');
    }

    // Extract required fields
    const statusCode = getStringProperty(obj, 'status_code');
    const statusMessage = getStringProperty(obj, 'status_message');
    const transactionId = getStringProperty(obj, 'transaction_id');
    const orderId = getStringProperty(obj, 'order_id');
    const merchantId = getStringProperty(obj, 'merchant_id');
    const grossAmount = getStringProperty(obj, 'gross_amount');
    const currency = getStringProperty(obj, 'currency');
    const paymentType = getStringProperty(obj, 'payment_type');
    const transactionTime = getStringProperty(obj, 'transaction_time');
    const transactionStatus = getStringProperty(obj, 'transaction_status');
    const fraudStatus = getStringProperty(obj, 'fraud_status');

    // Validate required fields
    if (!statusCode) {
        throw new MidtransError('Missing required field: status_code');
    }
    if (!statusMessage) {
        throw new MidtransError('Missing required field: status_message');
    }
    if (!transactionId) {
        throw new MidtransError('Missing required field: transaction_id');
    }
    if (!orderId) {
        throw new MidtransError('Missing required field: order_id');
    }
    if (!merchantId) {
        throw new MidtransError('Missing required field: merchant_id');
    }
    if (!grossAmount) {
        throw new MidtransError('Missing required field: gross_amount');
    }
    if (!currency) {
        throw new MidtransError('Missing required field: currency');
    }
    if (!paymentType) {
        throw new MidtransError('Missing required field: payment_type');
    }
    if (!transactionTime) {
        throw new MidtransError('Missing required field: transaction_time');
    }
    if (!transactionStatus) {
        throw new MidtransError('Missing required field: transaction_status');
    }
    if (!fraudStatus) {
        throw new MidtransError('Missing required field: fraud_status');
    }

    // Validate transaction status
    const validStatuses: TransactionStatus[] = [
        'capture', 'settlement', 'pending', 'deny', 'cancel', 'expire', 'failure'
    ];
    
    if (!validStatuses.includes(transactionStatus as TransactionStatus)) {
        throw new MidtransError(`Invalid transaction status: ${transactionStatus}`);
    }

    // Validate fraud status
    const validFraudStatuses = ['accept', 'challenge', 'deny'];
    if (!validFraudStatuses.includes(fraudStatus)) {
        throw new MidtransError(`Invalid fraud status: ${fraudStatus}`);
    }

    // Extract optional fields
    const settlementTime = getStringProperty(obj, 'settlement_time');
    const bank = getStringProperty(obj, 'bank');
    const pdfUrl = getStringProperty(obj, 'pdf_url');
    const finishRedirectUrl = getStringProperty(obj, 'finish_redirect_url');
    const signatureKey = getStringProperty(obj, 'signature_key');

    // Handle VA numbers if present
    let vaNumbers;
    if (obj.va_numbers && Array.isArray(obj.va_numbers)) {
        vaNumbers = obj.va_numbers.map((va: unknown) => {
            if (!isRecord(va)) {
                throw new MidtransError('Invalid VA number format');
            }
            const vaBank = getStringProperty(va, 'bank');
            const vaNumber = getStringProperty(va, 'va_number');
            
            if (!vaBank || !vaNumber) {
                throw new MidtransError('Invalid VA number: missing bank or va_number');
            }
            
            return { bank: vaBank, va_number: vaNumber };
        });
    }

    // Return validated response
    const validatedResponse: MidtransStatusResponse = {
        status_code: statusCode,
        status_message: statusMessage,
        transaction_id: transactionId,
        order_id: orderId,
        merchant_id: merchantId,
        gross_amount: grossAmount,
        currency: currency,
        payment_type: paymentType,
        transaction_time: transactionTime,
        transaction_status: transactionStatus as TransactionStatus,
        fraud_status: fraudStatus as 'accept' | 'challenge' | 'deny',
        ...(settlementTime && { settlement_time: settlementTime }),
        ...(bank && { bank: bank }),
        ...(vaNumbers && { va_numbers: vaNumbers }),
        ...(pdfUrl && { pdf_url: pdfUrl }),
        ...(finishRedirectUrl && { finish_redirect_url: finishRedirectUrl }),
        ...(signatureKey && { signature_key: signatureKey})
    };

    return validatedResponse;
};

export const getPaymentStatusGroup = (status: TransactionStatus): PaymentStatusGroup => {
    switch (status) {
        case 'capture':
        case 'settlement':
            return 'success';
        case 'pending':
            return 'pending';
        case 'deny':
        case 'cancel':
        case 'expire':
        case 'failure':
            return 'failed';
        default:
            // This should never happen with proper typing, but just in case
            console.warn(`Unknown transaction status: ${status}`);
            return 'unknown';
    }
};

export const executeCallback = <T extends unknown[]>(
    callback: ((...args: T) => void) | undefined,
    ...args: T
): void => {
    if (typeof callback === 'function') {
        try {
            callback(...args);
        } catch (error) {
            console.error('Error executing callback:', error);
            // Don't throw here to prevent breaking the main flow
        }
    }
};