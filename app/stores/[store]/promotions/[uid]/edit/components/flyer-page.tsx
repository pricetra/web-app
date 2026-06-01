"use client";

import {
  StorefrontFlyerPageInput,
  StorefrontFlyer,
  CreateStorefrontFlyerPageDocument,
  StorefrontFlyerFormat,
} from "graphql-utils";
import { useEffect, useMemo, useState } from "react";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";
import { IoMdAddCircleOutline } from "react-icons/io";
import useFlyerLayoutSize from "@/hooks/useFlyerLayoutSize";
import FlyerSection from "./flyer-section";
import { useToPng } from "@hugocxl/react-to-image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useMutation } from "@apollo/client/react";

export type FlyerPageProps = {
  flyer: StorefrontFlyer;
  page: StorefrontFlyerPageInput;
  pageIndex: number;
  disableEditing?: boolean;
};

export default function FlyerPage({ flyer, pageIndex, disableEditing }: FlyerPageProps) {
  const {
    flyerStyles,
    currentSelection,
    pagesInput,
    appendPageInput,
    appendSectionToPage,
    setCurrentSelection,
    removePageInput,
    submittedPages,
    addToSubmittedPages,
  } = useFlyerEditor();
  const [submitPage, { error }] = useMutation(
    CreateStorefrontFlyerPageDocument,
  );
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const isCurrentSectionAction = useMemo(() => {
    if (!currentSelection) return false;
    return currentSelection.pageIndex === pageIndex;
  }, [currentSelection, pageIndex]);

  const size = useFlyerLayoutSize(flyerStyles.format as StorefrontFlyerFormat);

  function handlePageInputSubmit(pageImageData: string) {
    const currentPage = { ...pagesInput[pageIndex] };
    return submitPage({
      variables: {
        input: {
          ...currentPage,
          pageImage: pageImageData,
        },
      },
    });
  }

  const [, pageToImage, pageRef] = useToPng<HTMLElement>({
    skipFonts: true,
    quality: 1,
    skipAutoScale: true,
    pixelRatio: 2,
    onSuccess: (imageData) => {
      handlePageInputSubmit(imageData).then(({ data }) => {
        if (!data) return;

        addToSubmittedPages(data.createStorefrontFlyerPage.pageNumber);
        const link = document.createElement("a");
        link.download = `pricetra-flyer-${flyer.store!.slug}-${flyer.uid}-page-${pageIndex + 1}.png`;
        link.href = imageData;
        link.click();
      });
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

  useEffect(() => {
    if (!error) return;

    toast.error(`Could not submit flyer page: ${error.message}`);
  }, [error]);

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <div className="relative" style={{ width: size.width }}>
          <div className="flex flex-row flex-wrap gap-5 items-center py-2">
            <div className="flex-1">
              <h2
                className={cn(
                  "text-xs",
                  isCurrentSectionAction && "font-semibold",
                )}
              >
                Page {pageIndex + 1}
              </h2>
            </div>

            <div className="flex-2 flex flex-row gap-3 items-center justify-end">
              <Button
                onClick={() => removePageInput(pageIndex)}
                variant="destructive"
                size="xs"
              >
                <RiDeleteBin2Line />
                Delete
              </Button>
            </div>
          </div>

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
                className="mb-4"
                key={`page-${pageIndex}-section-${i}`}
              >
                <FlyerSection
                  pageIndex={pageIndex}
                  sectionIndex={i}
                  sectionInput={section}
                  disableEditing={disableEditing}
                />
              </div>
            ))}

            {!hidePlaceholder && !disableEditing && (
              <div className="p-4">
                <button
                  onClick={() => appendSectionToPage(pageIndex)}
                  className="flex flex-col gap-2 items-center py-5 px-10 border-[3px] border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 cursor-pointer w-full"
                >
                  <IoMdAddCircleOutline className="text-4xl" />
                  <span className="text-base font-bold">Add section</span>
                </button>
              </div>
            )}
          </article>

          {pageIndex === pagesInput.length - 1 && (
            <div
              className="flex flex-col items-center justify-center mt-10 mb-16"
              style={{ width: size.width }}
            >
              <button
                onClick={() => {
                  if (!submittedPages.has(pageIndex + 1)) handlePageImageGeneration();
                  // TODO: Submit current page (pagesInput[pageIndex]) to API
                  appendPageInput();
                }}
                className="flex flex-col gap-3 items-center py-5 px-10 border-[3px] border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 rounded-md cursor-pointer w-full"
              >
                <IoMdAddCircleOutline className="text-4xl" />
                <span className="text-sm font-bold">Add page</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
