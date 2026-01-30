"use client";
import { GADS_PUB_ID } from "@/constants/google";
import useAdSense from "@/hooks/useAdSense";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export type VerticalSidebarAdProps = {
  id?: string | number;
};

export default function VerticalSidebarAd({ id }: VerticalSidebarAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const visible = useAdSense(adRef);

  return (
    <div
      className={cn(
        "flex items-center justify-center h-full",
        visible ? "block" : "hidden",
      )}
    >
      <div ref={adRef} className="relative" id={`horizontal-product-ad-${id}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={GADS_PUB_ID}
          data-ad-slot="5515267001"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
