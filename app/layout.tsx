import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/public/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pricetra - Your Price Tracking Companion",
  description:
    "Monitor price changes across thousands of products and never overpay again. Get alerts when prices drop and make smarter purchasing decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NODE_ENV === "production" && (
        <GoogleTagManager gtmId="G-6HHHS9PFVQ" />
      )}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
