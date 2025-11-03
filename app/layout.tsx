import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./providers/SessionProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evalufy",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
  <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}>
      <NextAuthProvider>{children}</NextAuthProvider>
    </body>
  </html>
);
}
