import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useAddProductPrompt from "@/hooks/useAddProductPrompt";
import { useLazyQuery } from "@apollo/client/react";
import { Product, ProductSearchDocument } from "graphql-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import ExtractImageDialog from "./extract-image-dialog";
import { handleInputFile } from "@/lib/files";
import { toast } from "sonner";
import { CgSpinner } from "react-icons/cg";
import { slugifyProductName } from "@/lib/strings";

const LIMIT = 10;

export default function ManualBarcodeForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [productSearch, { data: searchResults, loading }] = useLazyQuery(
    ProductSearchDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  const {
    handleBarcodeScan,
    handleExtractionImage,
    processingBarcode,
    extractingProduct,
  } = useAddProductPrompt();
  const [openAddUpcModal, setOpenAddUpcModal] = useState(false);

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
      <Dialog
        modal
        open={openAddUpcModal}
        defaultOpen={openAddUpcModal}
        onOpenChange={(o) => setOpenAddUpcModal(o)}
      >
        <ExtractImageDialog
          scannedCode={text}
          extractingProduct={extractingProduct}
          onFileChange={(e) => {
            const file = handleInputFile(e);
            if (!file) return;

            handleExtractionImage(file, text, {
              onSuccess: (data) => {
                router.push(
                  `/products/${data.extractAndCreateProduct.code}-${slugifyProductName(data.extractAndCreateProduct.name)}`,
                );
              },
              onError: (err) => {
                toast.error(`Error extracting data from image: ${err.message}`);
              },
              onFinally: () => {
                setText("");
                setOpenAddUpcModal(false);
              },
            });
          }}
          onCancel={() => {
            setOpenAddUpcModal(false);
          }}
        />
      </Dialog>

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
            <div>
              <p className="text-center">
                No results found.{" "}
                <span
                  onClick={() => {
                    if (extractingProduct || processingBarcode) return;
                    if (text.length < 4) return;

                    handleBarcodeScan(text, {
                      onSuccess: (data) => {
                        const params = new URLSearchParams();
                        if (data.barcodeScan.stock) {
                          params.set(
                            "stockId",
                            String(data.barcodeScan.stock.id),
                          );
                        }
                        router.push(
                          `/products/${data.barcodeScan.code}-${slugifyProductName(data.barcodeScan.name)}${params.size > 0 ? `?${params.toString()}` : ""}`,
                        );
                      },
                      onError: () => setOpenAddUpcModal(true),
                    });
                  }}
                  className="text-blue-500 hover:underline hover:text-blue-600 cursor-pointer font-bold inline-block ml-1"
                >
                  {processingBarcode ? (
                    <span className="flex flex-row gap-1 items-center">
                      <CgSpinner className="animate-spin" />
                      Adding product
                    </span>
                  ) : (
                    <>Add product</>
                  )}
                </span>
              </p>
            </div>
          )}
        </>
      )}

      <div style={{ height: "5vh" }} />
    </div>
  );
}
