'use client'

import LayoutProvider from "@/providers/layout-provider";
import "react-barcode-scanner/polyfill";
import { BrowserView, MobileView } from "react-device-detect";
import MobileScanner from "./mobile-scanner";

export default function ScanPageClient() {
  return (
    <>
      <MobileView>
        <section className="w-full h-screen">
          <MobileScanner />
        </section>
      </MobileView>

      <BrowserView>
        <LayoutProvider>
          <h1 className="text-2xl">Scanner page</h1>
        </LayoutProvider>
      </BrowserView>
    </>
  );
}
