"use client";

import { StorefrontFlyerPageInput, StorefrontFlyer } from "graphql-utils";
import { useMemo, useEffect, useState } from "react";
import { flyerFormatToFlyerSpec } from "@/lib/constants/flyer-formats";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";
import useFlyerLayoutSize from "@/hooks/useFlyerLayoutSize";

export type FlyerPageProps = {
  flyer: StorefrontFlyer;
  page: StorefrontFlyerPageInput;
  pageNumber: number;
};

export default function FlyerPage({ pageNumber }: FlyerPageProps) {
  const { flyerStyles, currentSelection } = useFlyerEditor();

  const isCurrentSectionAction = useMemo(() => {
    if (!currentSelection) return false;
  const size = useFlyerLayoutSize(flyerStyles.format as string);

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
