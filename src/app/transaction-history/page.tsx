import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import TransactionCard from "@/components/Transaction";

export default async function Transaction(){
    const session = await getServerSession(authOptions)
    const transactions = await prisma.transaction.findMany({
            where: {
                userId: session!.user.id 
            },
            orderBy: {
                transactionDate: 'desc'
            }
        });
    return(
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {transactions.map((transaction) => (
                    <TransactionCard transaction={transaction} key={transaction.sessionId} />
                ))}
            </div>                
        </div>
    )
}