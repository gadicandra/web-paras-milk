import { Transaction } from "@prisma/client";
import Link from "next/link";

interface TransactionProps{
    transaction: Transaction
}

export default function TransactionCard({transaction}: TransactionProps){
    const options = {
        weekday: 'long',    // e.g., "Selasa"
        year: 'numeric',    // e.g., "2025"
        month: 'long',      // e.g., "Juli"
        day: 'numeric',     // e.g., "29"
        hour: '2-digit',    // e.g., "21" (format 24 jam)
        minute: '2-digit',  // e.g., "45"
        timeZoneName: 'short' // e.g., "WIB"
    } as const;
    const formattedString = transaction.transactionDate.toLocaleString('id-ID', options)
    return(
        <Link
        href={"/transaction-history/" + transaction.sessionId}
        className="card w-full bg-base-100 hover:shadow-xl transition-shadow"
        >
            <div className="flex flex-col card-body">
                <div className="flex flex-row space-between sm:flex-col">
                    <h2 className="card-title">
                        #{transaction.sessionId}
                    </h2>
                    <h3 className="card-sm">
                        Status: {transaction.status}
                    </h3>
                </div>
                <h4>{formattedString}</h4>
                <h4>Total: {transaction.totalAmount}</h4>
            </div>
        </Link>
    )
}