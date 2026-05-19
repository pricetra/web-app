import { debounce } from "lodash";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useLazyQuery } from "@apollo/client/react";
import { AllProductsDocument, Product } from "graphql-utils";
import { IoSearch } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { CgSpinner } from "react-icons/cg";
import ProductItem from "@/components/product-item";

export default function SectionPanelEditor() {
  const { flyer } = useFlyerEditor();
  const [search, setSearch] = useState("");
  const [searchProducts, { data, loading }] = useLazyQuery(AllProductsDocument);

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

  return (
    <>
      <h2 className="text-lg font-bold mb-4">Selected Section Details</h2>
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
              <div className="grid grid-cols-1">
                {data.allProducts.products.map((p, i) => (
                  <div style={{transform: "scale(0.9)", position: "relative"}} key={`product-${p.id}-${i}-${p.stock?.id}`}>
                    <ProductItem
                      product={p as Product}
                      hideStoreInfo
                      preventHref
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
