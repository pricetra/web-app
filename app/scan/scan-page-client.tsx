"use client";

import LayoutProvider from "@/providers/layout-provider";
import "react-barcode-scanner/polyfill";
import { BrowserView, MobileView } from "react-device-detect";
import MobileScanner from "./mobile-scanner";
import VerticalSidebarAd from "@/components/ads/vertical-sidebar-ad";
import { useMemo } from "react";
import { useNavbar } from "@/context/navbar-context";
import { uniqueId } from "lodash";
import ManualBarcodeForm from "./components/manual-barcode-form";

export default function ScanPageClient() {
  const { navbarHeight } = useNavbar();
  const topHeight = useMemo(() => navbarHeight, [navbarHeight]);

  return (
    <>
      <MobileView>
        <section className="w-full h-screen">
          <MobileScanner />
        </section>
      </MobileView>

      <BrowserView>
        <LayoutProvider>
          <div className="w-full max-w-[1000px] flex-2">
            <ManualBarcodeForm />
          </div>
          <div className="w-full px-2 relative flex-1">
            <div
              className="w-full h-screen hidden lg:block lg:sticky top-0"
              style={{
                top: topHeight,
                maxHeight: `calc(100vh - ${topHeight}px)`,
              }}
            >
              <VerticalSidebarAd id={uniqueId()} />
            </div>
          </div>
        </LayoutProvider>
      </BrowserView>
    </>
  );
}
