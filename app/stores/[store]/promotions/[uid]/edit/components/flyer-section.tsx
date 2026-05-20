import { useMemo } from "react";
import { StorefrontFlyerSectionInput } from "graphql-utils";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";
import HeroUpload from "./hero-upload";
import ProductItemHorizontal from "@/components/product-item-horizontal";

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
  } = useFlyerEditor();

  const isSelected = useMemo(() => {
    return (
      (currentSelection.type === "section" ||
        currentSelection.type === "item") &&
      currentSelection.pageIndex === pageIndex &&
      currentSelection.sectionIndex === sectionIndex
    );
  }, [currentSelection, pageIndex, sectionIndex]);

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

  const isTitleInputVisible = isSelected || hasTitle;
  const isDescriptionInputVisible = isSelected || hasDescription;

  return (
    <section
      className={cn(
        "bg-white transition duration-200",
        isSelected
          ? "ring ring-gray-300 shadow-sm"
          : "hover:ring hover:ring-gray-200",
      )}
      onClick={selectSection}
    >
      {!isSelected &&
      (!hasTitle || !hasDescription) &&
      sectionInput.items.length === 0 ? (
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

          <div></div>
          {sectionInput.items.length > 0 && (
            <div className="p-2 flex flex-row flex-wrap gap-2">
              {sectionInput.items.map((item, i) => (
                <div
                  key={`page-${pageIndex}-section-${sectionIndex}-item-${i}`}
                  className="max-w-[130px] max-h-[250px]"
                >
                  <div style={{ transform: "scale(0.7)", transformOrigin: "top left" }}>
                    <ProductItemHorizontal
                      product={
                        productsMap.get(`${item.productId}-${item.stockId}`)!
                      }
                      hideStoreInfo
                      preventHref
                      onClick={() => {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
