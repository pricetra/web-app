"use client";
import { GADS_PUB_ID } from "@/constants/google";
import { useEffect, useRef } from "react";

export type VerticalProductAdProps = {
  id?: string | number;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

export default function VerticalProductAd({ id }: VerticalProductAdProps) {
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
      className="bg-gray-50 relative w-full"
      style={{ maxWidth: 474, minHeight: 100 }}
      id={`horizontal-product-ad-${id}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-h4-g+2e-7p+al"
        data-ad-client={GADS_PUB_ID}
        data-ad-slot="2926382943"
      />
    </div>
  );
}
