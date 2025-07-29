import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: NextRequest){
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }
    try{
        const expiredSnapshots = await prisma.snapShotCart.findMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        })

        const count = expiredSnapshots.length

        await prisma.snapShotCart.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        })

        return NextResponse.json({
            message: `Cleaned up ${count} expired snapshots`,
            deletedCount: count
        })
    } catch (error){
        console.error("Cleanup error:", error)
        return NextResponse.json({
            error: "Cleanup failed"
        },
        {
            status: 500
        })
    }
}