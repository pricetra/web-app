"use client";
import { GADS_PUB_ID } from "@/constants/google";
import useAdSense from "@/hooks/useAdSense";
import { cn } from "@/lib/utils";
import { useRef } from "react";

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
  const visible = useAdSense(adRef);

  return (
    <div className={cn(visible ? 'hidden' : 'block')}>
      <div
        ref={adRef}
        className="relative w-full"
        style={{ maxWidth: 474 }}
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
    </div>
  );
}
