import { Open_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/navbar/Navbar";
import SessionProvider from "./SessionProvider";

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400'], 
  variable: '--font-open-sans',
});

export const metadata = {
    title: "Paras Milk Website"
}

export default function RootLayout({
    children,
} : {
    children:React.ReactNode;
}) {
    return (
        <html lang="en">

            <body className={`${openSans.variable} font-sans`}>
                <SessionProvider>
                    <NavBar/>
                    <main className="p-0 max-w-7xl m-auto">{children}</main>
                </SessionProvider>
            </body>
        </html>
    )
}