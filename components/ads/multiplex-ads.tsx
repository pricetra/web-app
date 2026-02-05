"use client";
import { GADS_PUB_ID } from "@/constants/google";
import useAdSense from "@/hooks/useAdSense";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export type MultiplexAdsProps = {
  id?: string | number;
};

export default function MultiplexAds({ id }: MultiplexAdsProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const visible = useAdSense(adRef);

  return (
    <div
      className={cn(
        "flex items-center justify-center h-full",
        visible ? "block" : "hidden",
      )}
    >
      <div
        ref={adRef}
        className="relative"
        style={{ width: 250 }}
        id={`horizontal-product-ad-${id}`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client={GADS_PUB_ID}
          data-ad-slot="2475046405"
        />
      </div>
    </div>
  );
}
