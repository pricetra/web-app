import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLazyQuery } from "@apollo/client/react";
import { Product, ProductSearchDocument } from "graphql-utils";
import { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const LIMIT = 10;

export default function ManualBarcodeForm() {
  const [text, setText] = useState("");
  const [productSearch, { data: searchResults, loading }] = useLazyQuery(
    ProductSearchDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  function fetchProducts(page = 1) {
    productSearch({
      variables: {
        paginator: { page, limit: LIMIT },
        search: text.trim(),
      },
    });
  }

  return (
    <div>
      <div className="p-5 pt-0">
        <Input
          type="text"
          value={text}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchProducts();
            }
          }}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Ex. Barcode, Product name, Category, etc."
          autoFocus
        />
      </div>

      {loading && (
        <ScrollContainer hideButtons>
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <ProductLoadingItemHorizontal key={`product-loading-${i}`} />
            ))}
        </ScrollContainer>
      )}

      {searchResults && (
        <>
          {searchResults.productSearch.products.length > 0 ? (
            <div>
              <div className="mb-5 flex flex-row items-center justify-between gap-4 px-5">
                <p className="text-sm color-gray-500">
                  {searchResults.productSearch.paginator.total} results
                </p>

                <div className="flex flex-row gap-2">
                  <Button
                    disabled={!searchResults.productSearch.paginator.prev}
                    onClick={() =>
                      fetchProducts(
                        searchResults.productSearch.paginator.prev ?? 1,
                      )
                    }
                    size="icon"
                    variant="secondary"
                  >
                    <MdNavigateBefore />
                  </Button>

                  <Button
                    disabled={!searchResults.productSearch.paginator.next}
                    onClick={() =>
                      fetchProducts(
                        searchResults.productSearch.paginator.next ?? 1,
                      )
                    }
                    size="icon"
                    variant="secondary"
                  >
                    <MdNavigateNext />
                  </Button>
                </div>
              </div>

              <ScrollContainer>
                {searchResults.productSearch.products.map((p, i) => (
                  <ProductItemHorizontal
                    product={p as Product}
                    key={`product-${p.id}-${i}`}
                  />
                ))}
              </ScrollContainer>
            </div>
          ) : (
            <p className="text-center">No results found</p>
          )}
        </>
      )}

      <div style={{ height: "5vh" }} />
    </div>
  );
}
