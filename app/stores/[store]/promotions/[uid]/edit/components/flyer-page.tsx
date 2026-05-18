"use client";

import { StorefrontFlyerPageInput, StorefrontFlyer } from "graphql-utils";
import { useMemo, useEffect, useState } from "react";
import { flyerFormatToFlyerSpec } from "@/lib/constants/flyer-formats";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";

export type FlyerPageProps = {
  flyer: StorefrontFlyer;
  page: StorefrontFlyerPageInput;
  pageNumber: number;
};

export default function FlyerPage({ pageNumber }: FlyerPageProps) {
  const { flyerStyles, currentSelection } = useFlyerEditor();

  const isCurrentSectionAction = useMemo(() => {
    if (!currentSelection) return false;
    return currentSelection.pageIndex === pageNumber - 1;
  }, [currentSelection, pageNumber]);

  // Determine the spec for the requested format
  const spec = useMemo(() => {
    const format = flyerStyles.format as string;
    return flyerFormatToFlyerSpec[format] ?? flyerFormatToFlyerSpec["Letter"];
  }, [flyerStyles]);
  const [size, setSize] = useState<{ width: number; height: number }>(() => ({
    width: spec?.widthPx ?? 600,
    height: spec?.heightPx ?? 800,
  }));

  useEffect(() => {
    if (!spec) return;

    const compute = () => {
      const marginW = 48; // padding around the flyer container
      const marginH = 120; // account for headers/controls
      const maxW = Math.max(200, window.innerWidth - marginW);
      const maxH = Math.max(200, window.innerHeight - marginH);

      // use pixel dimensions from spec to preserve aspect ratio
      const specW = spec.widthPx;
      const specH = spec.heightPx;

      const widthIfFitHeight = Math.round(maxH * (specW / specH));
      if (widthIfFitHeight <= maxW) {
        setSize({ width: widthIfFitHeight, height: Math.round(maxH) });
      } else {
        const heightIfFitWidth = Math.round(maxW * (specH / specW));
        setSize({ width: Math.round(maxW), height: heightIfFitWidth });
      }
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [spec]);

  return (
    <div className="mb-5 p-4">
      <h2 className="text-xs mb-2">Page {pageNumber}</h2>

      <div className="flex justify-center">
        <article
          className={cn(
            "border border-gray-200 bg-white shadow-sm overflow-hidden",
            isCurrentSectionAction ? "border-gray-400 shadow-lg" : "opacity-80",
          )}
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
        >
          {/* This represents the inside of the flyer page. It will hold the sections, and products. */}
        </article>
      </div>
    </div>
  );
}
