import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import ApolloWrapper from "@/graphql/ApolloWrapper";
import { Suspense } from "react";
import { SuspenseFallback } from "@/components/suspence-fallback";
import "@/public/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "aos/dist/aos.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pricetra",
  description:
    "Monitor price changes across thousands of products and never overpay again. Get alerts when prices drop and make smarter purchasing decisions.",
};

const GA_TRACKING_ID = "G-6HHHS9PFVQ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Tag Manager */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            {/* Google Analytics */}
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />

            {/* AdSense code */}
            <meta
              name="google-adsense-account"
              content="ca-pub-9688831646501290"
            />
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9688831646501290"
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<SuspenseFallback />}>
          <ApolloWrapper>{children}</ApolloWrapper>
        </Suspense>
      </body>
    </html>
  );
}
