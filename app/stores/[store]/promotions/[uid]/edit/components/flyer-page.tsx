"use client";

import { StorefrontFlyerPageInput, StorefrontFlyer } from "graphql-utils";
import { useMemo } from "react";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";
import { IoMdAddCircleOutline } from "react-icons/io";
import useFlyerLayoutSize from "@/hooks/useFlyerLayoutSize";

export type FlyerPageProps = {
  flyer: StorefrontFlyer;
  page: StorefrontFlyerPageInput;
  pageIndex: number;
};

export default function FlyerPage({ pageIndex }: FlyerPageProps) {
  const { flyerStyles, currentSelection, pagesInput } = useFlyerEditor();

  const isCurrentSectionAction = useMemo(() => {
    if (!currentSelection) return false;
    return currentSelection.pageIndex === pageIndex;
  }, [currentSelection, pageIndex]);

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
            Page {pageIndex + 1}
          </h2>

          {/* This represents the inside of the flyer page. It will hold the sections, and products. */}
          <article
            className={cn(
              "border border-gray-200 bg-white overflow-hidden p-4",
              isCurrentSectionAction && "border-gray-300 shadow-sm",
            )}
            style={{ width: `${size.width}px`, height: `${size.height}px` }}
          >
            {pagesInput[pageIndex].sections.map((section, i) => (
              <div className="mb-5" key={`page-${pageIndex}-section-${i}`}>
                <h3>Section {section.sortOrder}</h3>
              </div>
            ))}

            <button
              onClick={() => {
                pagesInput[pageIndex].sections.push({
                  items: [],
                  sortOrder: pagesInput[pageIndex].sections.length,
                });
              }}
              className="flex flex-col gap-2 items-center py-5 px-10 border-[3px] border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 cursor-pointer w-full"
            >
              <IoMdAddCircleOutline className="text-4xl" />
              <span className="text-base font-bold">Add section</span>
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}
