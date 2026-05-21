import { useMemo } from "react";
import {
  StorefrontFlyerItem,
  StorefrontFlyerSectionInput,
} from "graphql-utils";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";
import HeroUpload from "./hero-upload";
import useFlyerLayoutSize from "@/hooks/useFlyerLayoutSize";
import FlyerSectionItem from "./flyer-section-item";
import { IoMdRemove } from "react-icons/io";

export type FlyerSectionProps = {
  pageIndex: number;
  sectionIndex: number;
  sectionInput: StorefrontFlyerSectionInput;
};

export default function FlyerSection({
  pageIndex,
  sectionIndex,
  sectionInput,
}: FlyerSectionProps) {
  const {
    currentSelection,
    setCurrentSelection,
    setSectionInput,
    productsMap,
    flyerStyles,
    removeSection,
  } = useFlyerEditor();
  const { width: flyerWidth } = useFlyerLayoutSize(
    flyerStyles.format as string,
  );

  const isSelected = useMemo(() => {
    return (
      (currentSelection.type === "section" ||
        currentSelection.type === "item") &&
      currentSelection.pageIndex === pageIndex &&
      currentSelection.sectionIndex === sectionIndex
    );
  }, [currentSelection, pageIndex, sectionIndex]);
  const sectionLayout = useMemo(() => {
    try {
      return JSON.parse(sectionInput.layout || "{}");
    } catch (err) {
      console.error("Failed to parse section layout", err);
      return {};
    }
  }, [sectionInput.layout]);
  const sectionItemWidth = useMemo(() => {
    const { itemColumnsCount } = sectionLayout;
    const count = itemColumnsCount ?? 5;
    return flyerWidth / count;
  }, [flyerWidth, sectionLayout]);

  const updateSection = (changes: Partial<StorefrontFlyerSectionInput>) => {
    const updatedSection = { ...sectionInput, ...changes };
    setSectionInput(pageIndex, sectionIndex, updatedSection);
    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex,
      sectionInput: updatedSection,
    });
  };

  const selectSection = () => {
    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex,
      sectionInput,
    });
  };

  const hasTitle =
    typeof sectionInput.title === "string" && sectionInput.title.trim() !== "";
  const hasDescription =
    typeof sectionInput.description === "string" &&
    sectionInput.description.trim() !== "";
  const hasItems = sectionInput.items.length !== 0;
  const hasHeroBanner = sectionInput.heroImage;

  const isTitleInputVisible = isSelected || hasTitle;
  const isDescriptionInputVisible = isSelected || hasDescription;

  const hasAnyInput = hasTitle || hasDescription || hasItems || hasHeroBanner;

  const showEmptyPlaceHolder = useMemo(() => {
    if (hasAnyInput) return false;
    return !isSelected;
  }, [isSelected, hasAnyInput])

  return (
    <section
      className={cn(
        "bg-white transition duration-200 relative",
        isSelected
          ? "ring ring-gray-300 shadow-sm"
          : "hover:ring hover:ring-gray-200",
      )}
      onClick={selectSection}
      onMouseEnter={selectSection}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => {
              removeSection(pageIndex, sectionIndex);
            }}
            className="cursor-pointer border border-red-600 bg-white text-red-600 rounded-full p-1 text-sm"
          >
            <IoMdRemove />
          </button>
        </div>
      )}

      {showEmptyPlaceHolder ? (
        <p className="text-center text-gray-400 px-4 py-5">
          Click here to edit this section
        </p>
      ) : (
        <div>
          <div>
            <HeroUpload
              isSectionSelected={isSelected}
              heroImage={sectionInput.heroImage}
              onImageChange={(file) => updateSection({ heroImage: file })}
              onImageRemove={() => updateSection({ heroImage: undefined })}
            />
          </div>

          <div className="p-4">
            {isTitleInputVisible && (
              <input
                value={sectionInput.title ?? ""}
                onChange={(e) =>
                  updateSection({ title: e.target.value || undefined })
                }
                placeholder="Section title"
                className="w-full bg-transparent text-lg font-semibold text-gray-900 placeholder:text-gray-500 outline-none ring-0 focus:ring-0"
              />
            )}

            {isDescriptionInputVisible && (
              <textarea
                value={sectionInput.description ?? ""}
                onChange={(e) =>
                  updateSection({ description: e.target.value || undefined })
                }
                placeholder="Section description (optional)"
                rows={1}
                className="w-full resize-none bg-transparent text-sm leading-6 text-gray-700 placeholder:text-gray-500 outline-none ring-0 focus:ring-0"
              />
            )}
          </div>

          {sectionInput.items.length > 0 && (
            <div className="p-4 flex flex-row flex-wrap gap-x-3 gap-y-5">
              {sectionInput.items.map((item, i) => {
                const productWithStock = productsMap.get(
                  `${item.productId}-${item.stockId}`,
                )!;
                return (
                  <div
                    key={`page-${pageIndex}-section-${sectionIndex}-item-${i}`}
                    style={{ width: sectionItemWidth - 18 }}
                  >
                    <FlyerSectionItem
                      pageIndex={pageIndex}
                      sectionIndex={sectionIndex}
                      itemIndex={i}
                      item={
                        {
                          ...item,
                          product: productWithStock,
                          stock: productWithStock.stock,
                        } as StorefrontFlyerItem
                      }
                      type="horizontal"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
