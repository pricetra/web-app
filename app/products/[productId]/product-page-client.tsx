"use client";

import ProductFull, { ProductFullLoading } from "@/components/product-full";
import {
  Product,
  ProductDocument,
  ProductSummary,
  Stock,
  StockDocument,
} from "graphql-utils";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect, useLayoutEffect } from "react";
import SelectedStock, {
  SelectedStockLoading,
} from "@/components/selected-stock";

import { useAuth } from "@/context/user-context";
import useLocationInput from "@/hooks/useLocationInput";
import { NAVBAR_HEIGHT } from "@/components/ui/navbar-main";
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

export type ProductPageClientProps = {
  productId: number;
  stockId?: number;
  sharedBy?: number;
  sharedFrom?: string;
  ipAddress: string;
  productSummary: ProductSummary;
};

export default function ProductPageClient({
  productId,
  stockId,
  ipAddress,
  productSummary,
}: ProductPageClientProps) {
  const { loggedIn, user, lists } = useAuth();
  const { setPageIndicator, resetAll, setNavTools, setSubHeader } = useNavbar();
  const locationInput = useLocationInput(!loggedIn ? ipAddress : undefined);
  const { data: productData, loading: productLoading } = useQuery(
    ProductDocument,
    {
      fetchPolicy: "network-only",
      variables: { productId, viewerTrail: { stockId } },
    }
  );
  const [getStock, { data: stockData, error: stockError }] = useLazyQuery(
    StockDocument,
    { fetchPolicy: "no-cache" }
  );
  const isMediumScreen = useMediaQuery({ query: "(max-width: 640px)" });

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
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockId, productSummary]);

  useLayoutEffect(() => {
    if (!stockError) return;

    setPageIndicator(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockError]);

  useLayoutEffect(() => {
    if (!user || !productData) return;

    const NavTools = (
      <ProductNavTools
        product={productData.product}
        stockId={stockId}
        stock={stockData?.stock as Stock}
      />
    );
    if (isMediumScreen) {
      setSubHeader(NavTools);
      setNavTools(undefined);
      return;
    }

    setSubHeader(undefined);
    setNavTools(NavTools);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, productId, productData, stockId, stockData, isMediumScreen]);

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
            className="lg:sticky flex flex-col gap-5 left-0 p-5 bg-white"
            style={{ top: NAVBAR_HEIGHT + 20 }}
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

        <section className="w-full flex-2 max-w-full lg:max-w-xl xl:max-w-3xl">
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
    </div>
  );
}
