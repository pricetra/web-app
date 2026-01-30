"use client";
import { GADS_PUB_ID } from "@/constants/google";
import useAdSense from "@/hooks/useAdSense";
import { useRef } from "react";

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
  const visible = useAdSense(adRef);

  if (!visible) return <></>;

  return (
    <div className="flex items-center justify-center h-full">
      <div
        ref={adRef}
        className="relative"
        style={{ width: 250 }}
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
    </div>
  );
}
