export interface SnapTransactionResult {
    order_id: string;
    status_code: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status?: string;
    status_message?: string;
}

export interface SnapOptions {
    onSuccess?: (result: SnapTransactionResult) => void;
    onPending?: (result: SnapTransactionResult) => void;
    onError?: (result: SnapTransactionResult) => void;
    onClose?: () => void;
}

export interface SnapEmbedOptions extends SnapOptions {
    embedId: string;
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




