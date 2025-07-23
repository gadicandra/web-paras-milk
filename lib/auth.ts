import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";
import { env } from "./env";
import { mergeAnonymousCartIntoUserCart } from "./cart";

export const authOptions: NextAuthOptions ={
    adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        session({session, user}) {
            session.user.id = user.id
            return session
        },
    },
    events: {
        async signIn({user}){
            await mergeAnonymousCartIntoUserCart(user.id);
        }
    }
}