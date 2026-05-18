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
    <div className="p-4">
      <div className="flex justify-center">
        <div style={{ width: `${size.width}px`, height: `${size.height}px` }}>
          <h2
            className={cn(
              "text-xs mb-2",
              isCurrentSectionAction && "font-semibold",
            )}
          >
            Page {pageNumber}
          </h2>

          {/* This represents the inside of the flyer page. It will hold the sections, and products. */}
          <article
            className={cn(
              "border border-gray-200 bg-white overflow-hidden",
              isCurrentSectionAction && "border-gray-300 shadow-sm",
            )}
            style={{ width: `${size.width}px`, height: `${size.height}px` }}
          ></article>
        </div>
      </div>
    </div>
  );
}
