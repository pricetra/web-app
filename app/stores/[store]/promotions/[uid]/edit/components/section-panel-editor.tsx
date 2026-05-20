import { debounce } from "lodash";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useLazyQuery } from "@apollo/client/react";
import { AllProductsDocument, Product } from "graphql-utils";
import { IoSearch } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { CgSpinner } from "react-icons/cg";
import ProductItem from "@/components/product-item";

export default function SectionPanelEditor() {
  const { flyer, currentSelection, addItemToPageSection, setSectionLayout } =
    useFlyerEditor();
  const [search, setSearch] = useState("");
  const [numberOfColumns, setNumberOfColumns] = useState(5);
  const [searchProducts, { data, loading }] = useLazyQuery(AllProductsDocument);

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

  useEffect(() => {
    if (!currentSelection || currentSelection.type !== "section") return;
    if (numberOfColumns < 1) setNumberOfColumns(1);
    if (numberOfColumns > 10) setNumberOfColumns(10);

    const layoutRaw = currentSelection.sectionInput.layout;
    const layout = JSON.parse(layoutRaw ?? "{}");
    layout.itemColumnsCount = numberOfColumns;
    setSectionLayout(
      currentSelection.pageIndex,
      currentSelection.sectionIndex,
      layout,
    );
  }, [numberOfColumns, currentSelection, setSectionLayout]);

  return (
    <>
      <h2 className="text-lg font-bold mb-4">Selected Section Details</h2>
      <div className="mb-10">
        <InputGroup className="h-auto bg-white">
          <InputGroupInput
            placeholder="Enter number of columns"
            value={numberOfColumns.toString()}
            onChange={(e) => setNumberOfColumns(parseInt(e.target.value) || 5)}
            type="number"
          />
          <InputGroupAddon align="block-start">
            <InputGroupText>Number of columns</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div>
        {/* <h3 className="text-base font-semibold mb-1">Search products</h3> */}

        <InputGroup className="w-full bg-white">
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products to add to this section"
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
              <div className="mt-5 grid grid-cols-1">
                {data.allProducts.products.map((p, i) => (
                  <div
                    className="mb-5"
                    key={`product-${p.id}-${i}-${p.stock?.id}`}
                  >
                    <ProductItem
                      product={p as Product}
                      hideStoreInfo
                      preventHref
                      onClick={() => {
                        if (
                          !currentSelection ||
                          currentSelection.type !== "section"
                        )
                          return;

                        addItemToPageSection(
                          currentSelection.pageIndex,
                          currentSelection.sectionIndex,
                          p as Product,
                          {
                            productId: p.id,
                            stockId: p.stock!.id,
                            sortOrder:
                              currentSelection.sectionInput.items.length,
                          },
                        );
                        setSearch("");
                      }}
                    />
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
