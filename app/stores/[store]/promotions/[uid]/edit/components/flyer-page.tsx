"use client";

import { StorefrontFlyerPageInput, StorefrontFlyer } from "graphql-utils";
import { useMemo, useState } from "react";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";
import { IoMdAddCircleOutline } from "react-icons/io";
import useFlyerLayoutSize from "@/hooks/useFlyerLayoutSize";
import FlyerSection from "./flyer-section";
import { useToPng } from "@hugocxl/react-to-image";
import { Button } from "@/components/ui/button";
import { IoCheckmark } from "react-icons/io5";
import { toast } from "sonner";

export type FlyerPageProps = {
  flyer: StorefrontFlyer;
  page: StorefrontFlyerPageInput;
  pageIndex: number;
};

export default function FlyerPage({ flyer, pageIndex }: FlyerPageProps) {
  const {
    flyerStyles,
    currentSelection,
    pagesInput,
    appendSectionToPage,
    setCurrentSelection,
  } = useFlyerEditor();
  const [hidePlaceholder, setHidePlaceholder] = useState(false)
  const isCurrentSectionAction = useMemo(() => {
    if (!currentSelection) return false;
    return currentSelection.pageIndex === pageIndex;
  }, [currentSelection, pageIndex]);

  const size = useFlyerLayoutSize(flyerStyles.format as string);

  const [, pageToImage, pageRef] = useToPng<HTMLElement>({
    skipFonts: true,
    quality: 1,
    skipAutoScale: true,
    pixelRatio: 2,
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = `pricetra-flyer-${flyer.store!.slug}-${flyer.uid}-page-${pageIndex + 1}.png`;
      link.href = data;
      link.click();
    },
    onError: (err) => {
      toast.error(`Failed to generate image. ${err}`);
    },
  });

  function handlePageImageGeneration() {
    setCurrentSelection({
      type: "page",
      pageIndex,
      pageInput: pagesInput[pageIndex],
    });
    setHidePlaceholder(true);
    pageToImage();

    setTimeout(() => {
      setHidePlaceholder(false);
    }, 1000);
  }

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <div className="relative" style={{ ...size }}>
          <Button
            onClick={handlePageImageGeneration}
            className="absolute top-0 -right-2 z-20"
            variant="secondary"
            size="icon"
          >
            <IoCheckmark />
          </Button>

          <h2
            className={cn(
              "text-xs mb-2",
              isCurrentSectionAction && "font-semibold",
            )}
          >
            Page {pageIndex + 1}
          </h2>

          <article
            ref={pageRef}
            className={cn(
              "border border-gray-200 bg-white overflow-hidden",
              isCurrentSectionAction && "border-gray-300 shadow-sm",
            )}
            style={{ ...size }}
          >
            {pagesInput[pageIndex].sections.map((section, i) => (
              <div
                onClick={() => {
                  setCurrentSelection({
                    type: "section",
                    pageIndex,
                    sectionIndex: i,
                    sectionInput: section,
                  });
                }}
                className="mb-5"
                key={`page-${pageIndex}-section-${i}`}
              >
                <FlyerSection
                  pageIndex={pageIndex}
                  sectionIndex={i}
                  sectionInput={section}
                />
              </div>
            ))}

            {!hidePlaceholder && <div className="p-4">
              <button
                onClick={() => appendSectionToPage(pageIndex)}
                className="flex flex-col gap-2 items-center py-5 px-10 border-[3px] border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 cursor-pointer w-full"
              >
                <IoMdAddCircleOutline className="text-4xl" />
                <span className="text-base font-bold">Add section</span>
              </button>
            </div>}
          </article>
        </div>
      </div>
    </div>
  );
}
