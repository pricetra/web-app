"use client";

import ProductFull, { ProductFullLoading } from "@/components/product-full";
import {
  Branch,
  Product,
  ProductDocument,
  ProductReferrer,
  ProductSummary,
  ProductViewerMetadata,
  Stock,
  StockDocument,
  Store,
} from "graphql-utils";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect, useLayoutEffect, useMemo } from "react";
import SelectedStock, {
  SelectedStockLoading,
} from "@/components/selected-stock";

import { useAuth } from "@/context/user-context";
import useLocationInput from "@/hooks/useLocationInput";
import { useNavbar } from "@/context/navbar-context";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { createCloudinaryUrl } from "@/lib/files";
import { useMediaQuery } from "react-responsive";
import ProductDetails from "./product-details";
import MoreFromBrand from "./more-from-brand-section";
import MoreFromCategory from "./more-from-category-section";
import ProductNavTools from "./product-nav-tools";
import { validBrand } from "@/lib/strings";
import Skeleton from "react-loading-skeleton";
import { StockItemMiniLoading } from "@/components/stock-item-mini";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";
import BranchPageClient from "@/app/stores/[store]/[branch]/branch-page-client";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";

export type ProductPageProps = {
  productId: number;
  stockId?: number;
  metadata?: ProductViewerMetadata;
  referrer?: ProductReferrer;
  ipAddress: string;
  productSummary: ProductSummary;
};

export default function ProductPage({
  productId,
  stockId,
  ipAddress,
  metadata,
  referrer,
  productSummary,
}: ProductPageProps) {
  const router = useRouter();
  const { navbarHeight } = useNavbar();
  const { loggedIn, lists } = useAuth();
  const { setPageIndicator, resetAll, setNavTools, setSubHeader } = useNavbar();
  const locationInput = useLocationInput(!loggedIn ? ipAddress : undefined);
  const { data: productData, loading: productLoading } = useQuery(
    ProductDocument,
    {
      fetchPolicy: "network-only",
      variables: { productId, viewerTrail: { stockId, referrer, metadata } },
    },
  );
  const [getStock, { data: stockData, error: stockError }] = useLazyQuery(
    StockDocument,
    { fetchPolicy: "no-cache" },
  );
  const isMediumScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const productPanelTopHeight = useMemo(
    () => navbarHeight + 20,
    [navbarHeight],
  );
  const [extraFromStoreRef, extraFromStoreInView] = useInView({
    triggerOnce: true,
    threshold: 0,
    initialInView: false,
  });

  // Get stock from stockId
  useEffect(() => {
    if (!stockId || !productData) return;
    getStock({
      variables: {
        stockId,
      },
    });
  }, [stockId, productData, getStock]);

  useLayoutEffect(() => {
    if (!stockId) return;
    if (
      !productSummary.store ||
      !productSummary.storeLogo ||
      !productSummary.storeSlug
    )
      return;

    setPageIndicator(
      <NavPageIndicator
        title={productSummary.store}
        imgSrc={createCloudinaryUrl(productSummary.storeLogo, 100, 100)}
        href={`/stores/${productSummary.storeSlug}`}
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockId, productSummary]);

  useLayoutEffect(() => {
    if (!stockError) return;

    setPageIndicator(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockError]);

  useLayoutEffect(() => {
    if (!productData) return;

    const NavTools = (
      <ProductNavTools
        product={productData.product}
        stockId={stockId}
        stock={stockData?.stock as Stock}
      />
    );
    if (isMediumScreen) {
      if (loggedIn) {
        setSubHeader(
          <div className="flex-1 flex flex-row items-center justify-between gap-2 px-5">
            <Button variant="link" size="icon" onClick={() => router.back()}>
              <IoArrowBackOutline className="size-[18px]" />
            </Button>

            <div className="flex flex-row gap-2 items-center justify-end">
              {NavTools}
            </div>
          </div>,
        );
      }
      setNavTools(undefined);
      return;
    }

    setSubHeader(undefined);
    setNavTools(NavTools);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, stockId, stockData, isMediumScreen, loggedIn]);

  useLayoutEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(extraFromStoreInView);
  }, [extraFromStoreInView]);

  return (
    <div className="w-full flex-1">
      <div className="w-full flex flex-col lg:flex-row gap-4 min-h-screen">
        <section className="w-full flex-1 relative">
          <div
            className="lg:sticky flex flex-col gap-5 left-0 p-5 bg-white lg:overflow-y-auto top-0"
            style={{
              top: productPanelTopHeight,
              maxHeight: !isMediumScreen
                ? `calc(100vh - ${productPanelTopHeight}px)`
                : undefined,
            }}
          >
            <article>
              {productData && !productLoading ? (
                <ProductFull
                  product={productData.product as Product}
                  hideDescription
                />
              ) : (
                <ProductFullLoading />
              )}
            </article>

            {stockId &&
              (stockData &&
              productData &&
              stockData.stock.productId === productData.product.id ? (
                <div className="my-5">
                  <div className="rounded-xl bg-gray-50 p-5">
                    <SelectedStock
                      stock={stockData.stock as Stock}
                      quantityType={productData.product.quantityType}
                      quantityValue={productData.product.quantityValue}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {!stockError && (
                    <div className="my-5">
                      <div className="rounded-xl bg-gray-50 p-5">
                        <SelectedStockLoading />
                      </div>
                    </div>
                  )}
                </>
              ))}
          </div>
        </section>

        <section className="w-full flex-2 max-w-full lg:max-w-xl xl:max-w-3xl 2xl:max-w-4xl">
          {productData && locationInput ? (
            <ProductDetails
              product={productData.product}
              locationInput={locationInput}
              stock={stockData?.stock as Stock | undefined}
            />
          ) : (
            <div className="flex flex-col gap-10 px-5">
              <div>
                <div className="py-4">
                  <Skeleton width={130} height={21} borderRadius={10} />
                </div>
                <section className="grid grid-cols-2 gap-5 mt-5">
                  {Array(lists?.favorites.branchList?.length ?? 5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        className="mb-3"
                        key={`favorite-branch-stock-loading-${i}`}
                      >
                        <StockItemMiniLoading />
                      </div>
                    ))}
                </section>
              </div>

              <div>
                <div className="py-4">
                  <Skeleton width={98} height={21} borderRadius={10} />
                </div>
                <section className="grid grid-cols-2 gap-5 mt-5">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        className="mb-3"
                        key={`favorite-branch-stock-loading-${i}`}
                      >
                        <StockItemMiniLoading />
                      </div>
                    ))}
                </section>
              </div>

              <div>
                <Skeleton
                  style={{
                    width: 100,
                    minWidth: "100%",
                    maxHeight: "100%",
                    height: "30vh",
                  }}
                  borderRadius={10}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="h-[10vh]" />

      <div>
        <div>
          {productData && validBrand(productData.product.brand) && (
            <MoreFromBrand brand={productData.product.brand} />
          )}
        </div>

        <div className="mt-16">
          {productData?.product?.category && (
            <MoreFromCategory category={productData.product.category} />
          )}
        </div>
      </div>

      <div className="h-[10vh]" />

      {productData &&
        stockData &&
        stockData.stock.store &&
        stockData.stock.branch && (
          <div ref={extraFromStoreRef}>
            {extraFromStoreInView && (
              <>
                <div className="px-5 max-w-full w-lg">
                  <h3 className="text-base sm:text-lg mb-2">Browse more from</h3>
                  <Link href={`/stores/${stockData.stock.store.slug}/${stockData.stock.branch.slug}`} className="flex flex-row items-center gap-3">
                    <Image
                      src={createCloudinaryUrl(
                        stockData.stock.store.logo,
                        300,
                        300,
                      )}
                      alt={stockData.stock.store.name}
                      width={100}
                      height={100}
                      className="size-12 sm:size-14 rounded-lg border"
                    />
                    <h2 className="font-bold text-lg sm:text-xl">{stockData.stock.branch.name}</h2>
                  </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-5">
                  <BranchPageClient
                    store={stockData.stock.store as Store}
                    branch={stockData.stock.branch as Branch}
                    searchParams={{
                      category: productData.product.category?.name,
                      limit: String(20),
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
    </div>
  );
}
