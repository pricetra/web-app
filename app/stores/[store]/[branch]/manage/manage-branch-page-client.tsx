"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  AllProductsDocument,
  Branch,
  Product,
  Store,
} from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { debounce } from "lodash";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { Button } from "@/components/ui/button";
import StorefrontBanner from "@/components/storefront-banner";
import ManageBranchInfo from "@/components/manage/manage-branch-info";
import ProductItem, { ProductItemLoading } from "@/components/product-item";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { startOfNextSundayUTC } from "@/lib/utils";
import { cleanUrl } from "@/lib/strings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BranchPriceForm from "@/components/product-form/branch-price-form";
import ManualBarcodeForm from "@/app/scan/components/manual-barcode-form";
import { toast } from "sonner";
import { MdAdd } from "react-icons/md";

const PRODUCTS_PER_PAGE = 30;

export default function ManageBranchPageClient({
  store,
  branch,
}: {
  store: Store;
  branch: Branch;
}) {
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
  } = useNavbar();
  const [showBranchDetails, setShowBranchDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [saleOnly, setSaleOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
        setPage(1);
      }, 400),
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      debouncedSetQuery(e.target.value);
    },
    [debouncedSetQuery],
  );

  const { data: productsData, loading: productsLoading } = useQuery(
    AllProductsDocument,
    {
      variables: {
        paginator: { page, limit: PRODUCTS_PER_PAGE },
        search: {
          storeId: store.id,
          branchId: branch.id,
          query: debouncedQuery || undefined,
          sale: saleOnly || undefined,
        },
      },
      fetchPolicy: "no-cache",
    },
  );

  useLayoutEffect(() => {
    resetAll();

    setPageIndicator(
      <NavPageIndicator
        title={branch.name}
        subTitle="Branch Management"
        imgSrc={createCloudinaryUrl(
          store.logo,
          100,
          100,
          startOfNextSundayUTC(),
        )}
        href={`/stores/${store.slug}`}
        titleHref={`/stores/${store.slug}/${branch.slug}`}
        subTitleHref={`/stores/${store.slug}/${branch.slug}/manage`}
      />,
    );
    setSearchPlaceholder(`Search ${branch.name}`);
    setSearchQueryPath(`/stores/${store.slug}/${branch.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      >
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Add Price" : "Search Product"}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct ? (
            <BranchPriceForm
              product={selectedProduct}
              branch={branch}
              onSuccess={() => {
                toast.success(
                  `Price added for ${selectedProduct.name}`,
                );
                setDialogOpen(false);
                setSelectedProduct(null);
              }}
              onCancel={() => {
                setDialogOpen(false);
                setSelectedProduct(null);
              }}
            />
          ) : (
            <ManualBarcodeForm
              onSelectProduct={(product) => setSelectedProduct(product)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-[1000px] flex-1 px-5">
        {/* Branch Header */}
        <div className="flex flex-row items-center gap-10 mb-8">
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <h1 className="text-lg font-bold">{branch.name}</h1>
              {branch.address && (
                <p className="text-xs text-gray-500">
                  {branch.address.fullAddress}
                </p>
              )}
              {branch.onlineAddress && (
                <div>
                  <a
                    href={branch.onlineAddress.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                  {cleanUrl(branch.onlineAddress.url)}
                </a>
              </div>
              )}
              <Button
                variant="outline"
                size="xs"
                className="mt-2"
                onClick={() => setShowBranchDetails(!showBranchDetails)}
              >
                {showBranchDetails ? "Cancel Editing" : "Edit Branch"}
              </Button>
            </div>
          </div>
        </div>

        {showBranchDetails && (
          <section className="mb-10 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Branch Details</h2>
            <ManageBranchInfo
              branch={branch}
              storeId={store.id}
            />
          </section>
        )}

        {/* Banner */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4">Storefront Banner</h2>
          <div className="-mx-5">
            <StorefrontBanner store={store} branch={branch} />
          </div>
        </section>

        {/* Products */}
        <section className="mb-10">
          <div className="flex flex-row items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Products</h2>
            <Button
              variant="pricetra"
              size="xs"
              onClick={() => {
                setSelectedProduct(null);
                setDialogOpen(true);
              }}
            >
              <MdAdd /> Add Price
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-row gap-2 mb-6">
            <InputGroup className="flex-1">
              <InputGroupInput
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>
            <Button
              variant={saleOnly ? "pricetra" : "outline"}
              size="sm"
              onClick={() => {
                setSaleOnly(!saleOnly);
                setPage(1);
              }}
            >
              Sale
            </Button>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedQuery("");
                  setPage(1);
                  debouncedSetQuery.cancel();
                }}
              >
                Clear
              </Button>
            )}
          </div>

          {debouncedQuery && (
            <p className="text-sm text-gray-500 mb-4">
              Results for &ldquo;{debouncedQuery}&rdquo;
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-3">
            {productsLoading || !productsData ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <ProductItemLoading
                    key={`product-loading-${i}`}
                    imgWidth={130}
                  />
                ))
            ) : productsData.allProducts.paginator.total === 0 ? (
              <p className="py-10 text-center col-span-2 text-gray-500">
                No products found
              </p>
            ) : (
              productsData.allProducts.products.map((p, i) => (
                <ProductItem
                  product={p as Product}
                  branchSlug={branch.slug}
                  imgWidth={130}
                  key={`product-${p.id}-${i}`}
                  hideStoreInfo
                  preventHref
                  onClick={() => {
                    setSelectedProduct(p as Product);
                    setDialogOpen(true);
                  }}
                />
              ))
            )}
          </div>

          {productsData?.allProducts?.paginator &&
            productsData.allProducts.paginator.numPages > 1 && (
              <div className="mt-10">
                <SmartPagination
                  paginator={productsData.allProducts.paginator}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
        </section>
      </div>
    </>
  );
}
