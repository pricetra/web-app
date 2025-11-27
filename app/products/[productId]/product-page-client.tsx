"use client";

import ProductFull, { ProductFullLoading } from "@/components/product-full";
import {
  Branch,
  BranchesWithProductsDocument,
  BranchesWithProductsQueryVariables,
  BranchListWithPrices,
  FavoriteBranchesWithPricesDocument,
  GetProductNutritionDataDocument,
  GetProductStocksDocument,
  Product,
  ProductDocument,
  ProductNutrition,
  Stock,
  StockDocument,
  UpdateProductNutritionDataDocument,
} from "@/graphql/types/graphql";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useLayoutEffect, useMemo } from "react";
import SelectedStock, {
  SelectedStockLoading,
} from "@/components/selected-stock";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductSpecs from "@/components/product-specs";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import { useAuth } from "@/context/user-context";
import useLocationInput from "@/hooks/useLocationInput";
import NutritionFacts from "@/components/nutrition-facts";
import { Button } from "@/components/ui/button";
import StockItemMini from "@/components/stock-item-mini";
import { cn } from "@/lib/utils";
import { NAVBAR_HEIGHT } from "@/components/ui/navbar-main";
import LoginSignupButtons from "@/components/login-signup-buttons";
import ScrollContainer from "@/components/scroll-container";
import { useNavbar } from "@/context/navbar-context";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { createCloudinaryUrl } from "@/lib/files";

export type StockWithApproximatePrice = Stock & {
  approximatePrice?: number;
};

function stockToApproxMap(
  data: BranchListWithPrices
): StockWithApproximatePrice {
  return {
    id: data.stock?.id ?? 0,
    productId: data.stock?.productId,
    latestPriceId: data.stock?.latestPrice?.id ?? 0,
    latestPrice: { ...data.stock?.latestPrice },
    branchId: data.branchId,
    branch: data.branch,
    store: data.branch?.store,
    storeId: data.branch?.storeId,
    approximatePrice: data.approximatePrice,
  } as StockWithApproximatePrice;
}

export type ProductPageClientProps = {
  productId: number;
  stockId?: number;
  sharedBy?: number;
  sharedFrom?: string;
};

export default function ProductPageClient({
  productId,
  stockId,
}: ProductPageClientProps) {
  const { loggedIn, lists } = useAuth();
  const { setPageIndicator, resetAll } = useNavbar();
  const locationInput = useLocationInput();
  const { data: productData, loading: productLoading } = useQuery(
    ProductDocument,
    {
      fetchPolicy: "network-only",
      variables: { productId, viewerTrail: { stockId } },
    }
  );
  const [getStock, { data: stockData, loading: stockLoading }] = useLazyQuery(
    StockDocument,
    { fetchPolicy: "no-cache" }
  );
  const [getProductStocks, { data: stocksData }] = useLazyQuery(
    GetProductStocksDocument,
    { fetchPolicy: "no-cache" }
  );
  const [getFavBranchesPrices, { data: favBranchesPriceData }] = useLazyQuery(
    FavoriteBranchesWithPricesDocument,
    { fetchPolicy: "no-cache" }
  );
  const [getBranchProducts, { data: branchesWithProducts }] = useLazyQuery(
    BranchesWithProductsDocument,
    { fetchPolicy: "no-cache" }
  );
  const [getProductNutritionData, { data: productNutritionData }] =
    useLazyQuery(GetProductNutritionDataDocument, {
      fetchPolicy: "network-only",
    });
  const [updateProductNutrition, { loading: updatingProductNutrition }] =
    useMutation(UpdateProductNutritionDataDocument, {
      refetchQueries: [GetProductNutritionDataDocument],
    });

  const favoriteBranchIds = useMemo(
    () =>
      (lists?.favorites?.branchList ?? [])
        .map(({ branchId }) => branchId)
        .filter((id) => id !== stockData?.stock?.branchId),
    [lists?.favorites.branchList, stockData?.stock]
  );

  const mappedFavBranches = useMemo(
    () =>
      (
        (favBranchesPriceData?.getFavoriteBranchesWithPrices ??
          []) as BranchListWithPrices[]
      ).map(stockToApproxMap),
    [favBranchesPriceData]
  );

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
    if (!stockData || !stockData?.stock.store) return;

    setPageIndicator(
      <NavPageIndicator
        title={stockData.stock.store.name}
        imgSrc={createCloudinaryUrl(stockData.stock.store.logo, 100, 100)}
        href={`/stores/${stockData.stock.store.slug}`}
      />
    );

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockData]);

  // All available stocks for product
  useEffect(() => {
    if (!loggedIn || !productData) return;
    getFavBranchesPrices({
      variables: {
        productId: productData.product.id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, productData, locationInput]);

  // All available stocks for product
  useEffect(() => {
    if (!productData) return;
    getProductStocks({
      variables: {
        paginator: {
          page: 1,
          limit: 10,
        },
        productId: productData.product.id,
        location: locationInput?.locationInput,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, locationInput]);

  // Get nutrition info
  useEffect(() => {
    if (!productData) return;
    getProductNutritionData({
      variables: {
        productId: productData.product.id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]);

  useEffect(() => {
    if (!productData || !productData.product.category) return;
    if (!locationInput) return;

    const variables = {
      paginator: {
        limit: favoriteBranchIds.length + (stockData ? 1 : 0),
        page: 1,
      },
      productLimit: 10,
      filters: {
        location: locationInput.locationInput,
        category: productData.product.category.name,
        sortByPrice: "asc",
      },
    } as BranchesWithProductsQueryVariables;
    if (loggedIn) {
      variables.filters = {
        ...variables.filters,
        branchIds: stockData
          ? [stockData.stock.branchId, ...favoriteBranchIds]
          : favoriteBranchIds,
      };
    }
    getBranchProducts({ variables });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, locationInput, favoriteBranchIds, productData, stockData]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
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
            !stockLoading &&
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
              <div className="my-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStockLoading />
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="w-full flex-2 max-w-full lg:max-w-xl xl:max-w-3xl">
        <Accordion
          type="multiple"
          defaultChecked
          className="w-full px-5"
          defaultValue={[
            "favorite-stores",
            "available-stocks",
            "nutrition-facts",
            "description",
          ]}
        >
          <AccordionItem value="favorite-stores">
            <AccordionTrigger>Favorite Stores</AccordionTrigger>
            <AccordionContent>
              {loggedIn ? (
                <>
                  {productData && favBranchesPriceData && (
                    <section className="grid grid-cols-2 gap-5 mt-5">
                      {mappedFavBranches.map(
                        ({ approximatePrice, ...s }, i) => (
                          <div
                            className={cn(
                              "mb-3",
                              s.id === 0 && !approximatePrice
                                ? "opacity-30"
                                : "opacity-100"
                            )}
                            key={`${s.id}-${i}-fav-store-stock`}
                          >
                            <StockItemMini
                              stock={s as Stock}
                              approximatePrice={approximatePrice ?? undefined}
                              quantityValue={productData.product.quantityValue}
                              quantityType={productData.product.quantityType}
                            />
                          </div>
                        )
                      )}
                    </section>
                  )}
                </>
              ) : (
                <div className="my-10">
                  <h3 className="text-center text-lg font-bold mb-5">
                    View prices from your Favorite Stores
                  </h3>

                  <LoginSignupButtons />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="available-stocks">
            <AccordionTrigger>Available at</AccordionTrigger>
            <AccordionContent>
              {productData && stocksData && (
                <section className="grid grid-cols-2 gap-5 mt-5">
                  {stocksData.getProductStocks.stocks.map((s, i) => (
                    <div className="mb-3" key={`${s.id}-${i}-available-stock`}>
                      <StockItemMini
                        stock={s as Stock}
                        quantityValue={productData.product.quantityValue}
                        quantityType={productData.product.quantityType}
                      />
                    </div>
                  ))}
                </section>
              )}
            </AccordionContent>
          </AccordionItem>

          {productData && productNutritionData && (
            <AccordionItem value="nutrition-facts">
              <AccordionTrigger>Nutrition Facts</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="mb-5 flex flex-row items-center justify-end gap-2">
                  <a
                    className="bg-gray-700 px-3 py-1.5 rounded-md text-white"
                    href={`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${productData.product.code}`}
                    target="_blank"
                  >
                    Edit
                  </a>

                  <Button
                    size="sm"
                    className="cursor-pointer"
                    onClick={() =>
                      updateProductNutrition({
                        variables: { productId: productId },
                      })
                    }
                    disabled={updatingProductNutrition}
                  >
                    Refetch
                  </Button>
                </div>

                {productNutritionData.getProductNutritionData.nutriments && (
                  <NutritionFacts
                    {...(productNutritionData.getProductNutritionData as ProductNutrition)}
                  />
                )}

                {productNutritionData.getProductNutritionData.ingredientList &&
                  productNutritionData.getProductNutritionData.ingredientList
                    .length > 0 && (
                    <div className="mt-7">
                      <h5 className="mb-1.5 text-base font-semibold">
                        Ingredients
                      </h5>
                      <p className="text-sm">
                        {productNutritionData.getProductNutritionData.ingredientList
                          .map((i) => i.toUpperCase())
                          .join(", ")}
                      </p>
                    </div>
                  )}
              </AccordionContent>
            </AccordionItem>
          )}

          {productData && productData.product.description.length > 0 && (
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>{productData?.product?.description}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="specifications">
            <AccordionTrigger>Specifications</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {productData && (
                <ProductSpecs product={productData.product as Product} />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="w-full mt-[60px]">
          {!branchesWithProducts
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <article
                    className="my-7"
                    key={`branch-with-product-loading-${i}`}
                  >
                    <div className="mb-5 px-5">
                      <BranchItemWithLogoLoading />
                    </div>

                    <div className="flex flex-row gap-5 overflow-x-auto py-2.5 lg:px-2.5 lg:[mask-image:_linear-gradient(to_right,transparent_0,_black_2em,_black_calc(100%-2em),transparent_100%)]">
                      {Array(10)
                        .fill(0)
                        .map((_, j) => (
                          <div
                            className="first:pl-5 last:pr-5"
                            key={`branch-product-${i}-${j}`}
                          >
                            <ProductLoadingItemHorizontal />
                          </div>
                        ))}
                    </div>
                  </article>
                ))
            : branchesWithProducts.branchesWithProducts.branches.map(
                (branch, i) => (
                  <article
                    className="my-7"
                    key={`branch-with-product-${branch.id}`}
                  >
                    <div className="mb-5 px-5">
                      <BranchItemWithLogo branch={branch as Branch} />
                    </div>

                    <ScrollContainer>
                      {(branch.products ?? []).map((product) => (
                        <ProductItemHorizontal
                          product={product as Product}
                          key={`related-branch-product-${branch.id}-${product.id}-${i}`}
                        />
                      ))}
                    </ScrollContainer>
                  </article>
                )
              )}
        </section>
      </section>
    </div>
  );
}
