import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { StorefrontFlyerSectionInput } from "graphql-utils";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { cn } from "@/lib/utils";

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
  const { currentSelection, setCurrentSelection, setSectionInput } =
    useFlyerEditor();
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  const isSelected = useMemo(() => {
    return (
      currentSelection.type === "section" &&
      currentSelection.pageIndex === pageIndex &&
      currentSelection.sectionIndex === sectionIndex
    );
  }, [currentSelection, pageIndex, sectionIndex]);

  useEffect(() => {
    if (!sectionInput.heroImage) {
      setHeroPreview(null);
      return;
    }

    if (typeof sectionInput.heroImage === "string") {
      setHeroPreview(sectionInput.heroImage);
      return;
    }

    const previewUrl = URL.createObjectURL(sectionInput.heroImage);
    setHeroPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [sectionInput.heroImage]);

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

  const handleHeroImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateSection({ heroImage: file });
  };

  const clearHeroImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    updateSection({ heroImage: undefined });
  };

  const selectSection = () => {
    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex,
      sectionInput,
    });
  };

  return (
    <section
      className={cn(
        "rounded-2xl bg-white p-4 transition duration-200",
        isSelected
          ? "border border-gray-300 shadow-sm"
          : "border border-transparent hover:border-gray-200",
      )}
      onClick={selectSection}
    >
      <div className="space-y-4">
        <div>
          <input
            value={sectionInput.title ?? ""}
            onChange={(event) =>
              updateSection({ title: event.target.value || undefined })
            }
            onFocus={selectSection}
            placeholder="Section title"
            className="w-full bg-transparent text-lg font-semibold text-gray-900 placeholder:text-gray-500 outline-none ring-0 focus:ring-0"
          />

          <textarea
            value={sectionInput.description ?? ""}
            onChange={(event) =>
              updateSection({ description: event.target.value || undefined })
            }
            onFocus={selectSection}
            placeholder="Section description"
            rows={1}
            className="w-full resize-none bg-transparent text-sm leading-6 text-gray-700 placeholder:text-gray-500 outline-none ring-0 focus:ring-0"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-600">Hero image</p>
            {heroPreview ? (
              <button
                type="button"
                onClick={clearHeroImage}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Remove
              </button>
            ) : null}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
            {heroPreview ? (
              <div className="relative h-40 w-full" onClick={selectSection}>
                <Image
                  src={heroPreview}
                  alt="Section hero preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 p-4 text-center text-sm text-gray-500">
                <p>Drag or upload a hero image to make this section pop.</p>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleHeroImageChange}
            className="sr-only"
          />
        </div>
      </div>
    </section>
  );
}
