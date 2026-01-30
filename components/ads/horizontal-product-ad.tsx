"use client";
import { GADS_PUB_ID } from "@/constants/google";
import { useEffect, useRef } from "react";

export type HorizontalProductAdProps = {
  id?: string | number;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

export default function HorizontalProductAd({ id }: HorizontalProductAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense error", e);
    }
  }, []);

  return (
    <div
      ref={adRef}
      className="flex items-center justify-center relative h-full"
      style={{ width: 250, minHeight: 260 }}
      id={`horizontal-product-ad-${id}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client={GADS_PUB_ID}
        data-ad-slot="8982980246"
      />
    </div>
  );
}
