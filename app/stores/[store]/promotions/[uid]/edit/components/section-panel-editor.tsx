import { debounce } from "lodash";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useLazyQuery } from "@apollo/client/react";
import {
  AllProductsDocument,
  Product,
  StorefrontFlyerSectionInput,
} from "graphql-utils";
import { IoSearch } from "react-icons/io5";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { CgSpinner } from "react-icons/cg";
import { NativeSelect } from "@/components/ui/native-select";
import { Field, FieldLabel } from "@/components/ui/field";
import HeroUpload from "./hero-upload";
import ItemProductHorizontal from "./item-product-horizontal";
import { convertFileToBase64 } from "@/lib/files";

export default function SectionPanelEditor() {
  const {
    flyer,
    currentSelection,
    submittedPages,
    addItemToPageSection,
    setSectionLayout,
    setSectionInput,
    setCurrentSelection,
  } = useFlyerEditor();
  const [search, setSearch] = useState("");
  const [numberOfColumns, setNumberOfColumns] = useState(5);
  const [searchProducts, { data, loading }] = useLazyQuery(AllProductsDocument);

  const pageEditingDisabled = useMemo(
    () => submittedPages.has(currentSelection.pageIndex + 1),
    [submittedPages, currentSelection],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      if (search.length < 2) return;

      searchProducts({
        variables: {
          search: {
            query: search.trim(),
            storeId: flyer.storeId,
            branchId: flyer.branchId,
          },
          paginator: {
            page: 1,
            limit: 20,
          },
        },
      });
    }, 500),
    [flyer.storeId, flyer.branchId, searchProducts],
  );

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const updateSection = (changes: Partial<StorefrontFlyerSectionInput>) => {
    if (currentSelection.type !== "section") return;

    const sectionInput = currentSelection.sectionInput;
    const pageIndex = currentSelection.pageIndex;
    const sectionIndex = currentSelection.sectionIndex;

    const updatedSection = { ...sectionInput, ...changes };
    setSectionInput(pageIndex, sectionIndex, updatedSection);
    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex,
      sectionInput: updatedSection,
    });
  };

  if (currentSelection.type !== "section") return <></>;

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Selected Section Details</h2>

        {submittedPages.has(currentSelection.pageIndex + 1) && (
          <p className="text-xs text-muted-foreground italic text-red-500">
            This page has been submitted and cannot be edited.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-5 mb-7 p-4 bg-white border border-gray-200 rounded-lg">
        <div style={{ opacity: pageEditingDisabled ? 0.7 : 1 }}>
          <HeroUpload
            isSectionSelected={true}
            heroImage={currentSelection.sectionInput.heroImage ?? undefined}
            onImageChange={async (file) => {
              const base64File = await convertFileToBase64(file);
              updateSection({ heroImage: base64File?.toString() ?? undefined });
            }}
            onImageRemove={() => updateSection({ heroImage: undefined })}
            hideRemoveButton={pageEditingDisabled}
            disabled={pageEditingDisabled}
          />
        </div>

        <Field className="max-w-sm">
          <FieldLabel htmlFor="inline-end-input">
            Section Title <small>(optional)</small>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              value={currentSelection.sectionInput.title ?? ""}
              onChange={(e) =>
                updateSection({ title: e.target.value || undefined })
              }
              placeholder="Section title"
              disabled={pageEditingDisabled}
            />
          </InputGroup>
        </Field>

        <Field className="max-w-sm">
          <FieldLabel htmlFor="inline-end-input">
            Section Description <small>(optional)</small>
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              value={currentSelection.sectionInput.description ?? ""}
              onChange={(e) =>
                updateSection({ description: e.target.value || undefined })
              }
              placeholder="Section description"
              disabled={pageEditingDisabled}
            />
          </InputGroup>
        </Field>
      </div>

      <div className="mb-10">
        <NativeSelect
          value={numberOfColumns}
          onChange={(e) => {
            const value = e.target.value;
            const parsedValue = parseInt(value);
            if (isNaN(parsedValue)) return;

            setNumberOfColumns(parsedValue);
            const layoutRaw = currentSelection.sectionInput.layout;
            const layout = JSON.parse(layoutRaw ?? "{}");
            layout.itemColumnsCount = parsedValue;
            setSectionLayout(
              currentSelection.pageIndex,
              currentSelection.sectionIndex,
              layout,
            );
          }}
          disabled={pageEditingDisabled}
          className="bg-white"
        >
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Columns
              </option>
            ))}
        </NativeSelect>
      </div>
      <div>
        {/* <h3 className="text-base font-semibold mb-1">Search products</h3> */}

        <InputGroup className="w-full bg-white">
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products to add to this section"
            disabled={pageEditingDisabled}
          />
          <InputGroupAddon>
            {loading ? <CgSpinner className="animate-spin" /> : <IoSearch />}
          </InputGroupAddon>
          {data?.allProducts && (
            <InputGroupAddon align="inline-end">
              {data.allProducts.paginator.total} results
            </InputGroupAddon>
          )}
        </InputGroup>

        {data && (
          <div>
            {data.allProducts.paginator.total > 0 ? (
              <div className="mt-5 grid grid-cols-3">
                {data.allProducts.products.map((p, i) => (
                  <div
                    className="cursor-pointer mb-5 hover:bg-white p-2"
                    key={`product-${p.id}-${i}-${p.stock?.id}`}
                    onClick={() => {
                      addItemToPageSection(
                        currentSelection.pageIndex,
                        currentSelection.sectionIndex,
                        p as Product,
                        {
                          productId: p.id,
                          stockId: p.stock!.id,
                          sortOrder: currentSelection.sectionInput.items.length,
                        },
                      );
                      setSearch("");
                    }}
                  >
                    <ItemProductHorizontal product={p as Product} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-5">No results</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
