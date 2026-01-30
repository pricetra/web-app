import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { SuspenseFallback } from "@/components/suspense-fallback";
import "react-loading-skeleton/dist/skeleton.css";
import "aos/dist/aos.css";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "@/public/globals.css";
import AppProvider from "@/providers/app-provider";
import { GA_TRACKING_ID, GADS_PUB_ID } from "@/constants/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/192.png" />
        <meta name="apple-mobile-web-app-status-bar" content="#ffffff" />

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
            <Script
              id="amp-ad-script"
              async
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html:
                  '<script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>',
              }}
            />

            {/* AdSense code */}
            <meta
              name="google-adsense-account"
              content={`ca-${GADS_PUB_ID}`}
            />
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${GADS_PUB_ID}`}
              strategy="afterInteractive"
              crossOrigin="anonymous"
              data-ad-client={GADS_PUB_ID}
            />
          </>
        )}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<SuspenseFallback />}>
          <AppProvider>{children}</AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
