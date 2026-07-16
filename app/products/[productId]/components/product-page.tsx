"use client";

import ProductFull from "@/components/product-full";
import {
  Branch,
  Price,
  Product,
  ProductDocument,
  ProductSummary,
  Referrer,
  Stock,
  StockDocument,
  Store,
  ViewerMetadata,
} from "graphql-utils";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect, useLayoutEffect, useMemo } from "react";
import SelectedStock from "@/components/selected-stock";

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
import Link from "@/components/ui/link";
import { startOfNextSundayUTC } from "@/lib/utils";
import { useRouteHistory } from "@/context/route-history";
import HorizontalBannerAd from "@/components/ads/horizontal-banner-ad";
import { AiOutlineProduct } from "react-icons/ai";

export type ProductPageProps = {
  productId: number;
  stockId?: number;
  metadata?: ViewerMetadata;
  referrer?: Referrer;
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
  const { prevRoute } = useRouteHistory();
  const {
    navbarHeight,
    setSearchBadge,
    setSearchPlaceholder,
    setSearchQueryPath,
  } = useNavbar();
  const { loggedIn, lists } = useAuth();
  const { setPageIndicator, resetAll, setNavTools, setSubHeader } = useNavbar();
  const locationInput = useLocationInput(!loggedIn ? ipAddress : undefined);
  const { data: productData } = useQuery(ProductDocument, {
    fetchPolicy: "network-only",
    variables: {
      productId,
      viewerTrail: { stockId, referrer, metadata, origin: prevRoute },
    },
  });
  const productFromSummary = useMemo(() => {
    if (productData) return productData.product as Product;
    return {
      id: productSummary.id,
      code: productSummary.code,
      name: productSummary.name,
      image: productSummary.image,
      brand: productSummary.brand,
    } as Product;
  }, [productSummary, productData]);
  const [getStock, { data: stockData, error: stockError }] = useLazyQuery(
    StockDocument,
    { fetchPolicy: "no-cache" },
  );
  const stockFromSummary = useMemo(() => {
    if (stockData) return stockData.stock as Stock;
    if (productSummary.stockId) {
      const store = {
        id: productSummary.storeId!,
        slug: productSummary.storeSlug!,
        name: productSummary.store!,
        logo: productSummary.storeLogo!,
      } as Store;
      const branch = {
        id: productSummary.branchId!,
        slug: productSummary.branchSlug!,
        name: productSummary.branch!,
      } as Branch;
      return {
        id: productSummary.stockId,
        productId: productSummary.id,
        storeId: store.id,
        store,
        branchId: branch.id,
        branch,
        latestPrice: productSummary.price
          ? ({
              // id: productSummary.priceId!,
              id: 0,
              amount: productSummary.price,
              sale: productSummary.sale ?? false,
              expiresAt: productSummary.saleExpiresAt,
              originalPrice: productSummary.originalPrice,
              currencyCode: productSummary.priceCurrencyCode,
              unitType: "item",
              storeId: store.id,
              branchId: branch.id,
              createdAt: productSummary.priceCreatedAt,
            } as Price)
          : undefined,
      } as Stock;
    }
    return undefined;
  }, [productSummary, stockData]);
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
    if (!stockId) return;
    getStock({
      variables: {
        stockId,
        viewerTrail: {
          path: window.location.href,
          origin: window.origin,
          metadata: {
            device: "web",
            ipAddress,
          },
          referrer,
        },
      },
    });
  }, [stockId, getStock, ipAddress, referrer]);

  useLayoutEffect(() => {
    if (!stockId) {
      setPageIndicator(
        <NavPageIndicator title="Product" icon={AiOutlineProduct} />,
      );
      return;
    }
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
        href={`/stores/${productSummary.storeSlug}/${productSummary.branchSlug}`}
      />,
    );

    setSearchBadge(productSummary.branch ?? undefined);
    setSearchPlaceholder(`Search ${productSummary.branch}`);
    setSearchQueryPath(
      `/stores/${productSummary.storeSlug}/${productSummary.branchSlug}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockId, productSummary]);

  useLayoutEffect(() => {
    if (!stockError) return;

    setPageIndicator(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockError]);

  useLayoutEffect(() => {
    const NavTools = (
      <ProductNavTools
        product={productFromSummary}
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
  }, [productFromSummary, stockId, stockData, isMediumScreen, loggedIn]);

  useLayoutEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <ProductFull
                product={productFromSummary as Product}
                hideDescription
                stock={stockData?.stock as Stock | undefined}
              />
            </article>

            {stockId && stockFromSummary && (
              <div className="my-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStock
                    stock={stockFromSummary}
                    product={productFromSummary}
                  />
                </div>
              </div>
            )}

            {/* {stockId &&
              (stockData &&
              productData &&
              stockData.stock.productId === productData.product.id ? (
                <div className="my-5">
                  <div className="rounded-xl bg-gray-50 p-5">
                    <SelectedStock
                      stock={stockData.stock as Stock}
                      product={productData.product}
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
              ))} */}
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

      <div className="bg-gray-50 w-full my-10">
        <HorizontalBannerAd id={productId} />
      </div>

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
                <div className="px-5 max-w-full w-lg mb-5">
                  <h3 className="text-base sm:text-lg mb-2">
                    Browse more from
                  </h3>
                  <Link
                    href={`/stores/${stockData.stock.store.slug}/${stockData.stock.branch.slug}`}
                    className="flex flex-row items-center gap-3"
                  >
                    <Image
                      src={createCloudinaryUrl(
                        stockData.stock.store.logo,
                        300,
                        300,
                        startOfNextSundayUTC(),
                      )}
                      alt={stockData.stock.store.name}
                      width={100}
                      height={100}
                      className="size-12 sm:size-14 rounded-lg border"
                    />
                    <h2 className="font-bold text-lg sm:text-xl">
                      {stockData.stock.branch.name}
                    </h2>
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
                    disableNavSettings
                  />
                </div>
              </>
            )}
          </div>
        )}
    </div>
  );
}
