import {
  Branch,
  BranchesWithProductsDocument,
  BranchesWithProductsQueryVariables,
  BranchListWithPrices,
  FavoriteBranchesWithPricesDocument,
  GetProductNutritionDataDocument,
  GetProductStocksDocument,
  Product,
  ProductNutrition,
  Stock,
  UpdateProductNutritionDataDocument,
} from "graphql-utils";

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
import NutritionFacts from "@/components/nutrition-facts";
import { Button } from "@/components/ui/button";
import StockItemMini, {
  StockItemMiniLoading,
} from "@/components/stock-item-mini";
import LoginSignupButtons from "@/components/login-signup-buttons";
import ScrollContainer from "@/components/scroll-container";
import { FiEdit } from "react-icons/fi";
import { IoRefresh } from "react-icons/io5";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useAuth } from "@/context/user-context";
import { useEffect, useMemo } from "react";
import { LocationInputWithFullAddress } from "@/context/location-context";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { adify } from "@/lib/ads";
import { getRandomIntInclusive } from "@/lib/utils";
import HorizontalProductAd from "@/components/ads/horizontal-product-ad";

export type StockWithApproximatePrice = Stock & {
  approximatePrice?: number;
};

function stockToApproxMap(
  data: BranchListWithPrices,
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

export type ProductDetailsProps = {
  product: Product;
  stock?: Stock;
  locationInput: LocationInputWithFullAddress;
};

export default function ProductDetails({
  product,
  stock,
  locationInput,
}: ProductDetailsProps) {
  const { loggedIn, lists } = useAuth();

  const { data: stocksData } = useQuery(GetProductStocksDocument, {
    variables: {
      paginator: {
        page: 1,
        limit: 10,
      },
      productId: product.id,
      location: locationInput.locationInput,
    },
    fetchPolicy: "no-cache",
  });
  const { data: favBranchesPriceData } = useQuery(
    FavoriteBranchesWithPricesDocument,
    {
      variables: { productId: product.id },
      fetchPolicy: "no-cache",
    },
  );

  const [relatedProductsSectionRef, relatedProductsSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0,
    initialInView: false,
  });
  const [getRelatedBranchProducts, { data: branchesWithProducts }] =
    useLazyQuery(BranchesWithProductsDocument, { fetchPolicy: "no-cache" });

  const { data: productNutritionData } = useQuery(
    GetProductNutritionDataDocument,
    {
      variables: {
        productId: product.id,
      },
      fetchPolicy: "network-only",
    },
  );
  const [updateProductNutrition, { loading: updatingProductNutrition }] =
    useMutation(UpdateProductNutritionDataDocument, {
      refetchQueries: [GetProductNutritionDataDocument],
    });

  const mappedFavBranches = useMemo(
    () =>
      (
        (favBranchesPriceData?.getFavoriteBranchesWithPrices ??
          []) as BranchListWithPrices[]
      ).map(stockToApproxMap),
    [favBranchesPriceData],
  );

  const availableFavoriteBranches = useMemo(
    () =>
      favBranchesPriceData?.getFavoriteBranchesWithPrices?.filter(
        (d) => d.approximatePrice || d.stock?.latestPriceId,
      ) as BranchListWithPrices[] | undefined,
    [favBranchesPriceData],
  );

  useEffect(() => {
    if (!relatedProductsSectionInView) return;
    if (!product.category || !locationInput) return;

    const favoriteBranchIds = (lists?.favorites?.branchList ?? []).map(
      ({ branchId }) => branchId,
    );
    const variables = {
      paginator: {
        limit: favoriteBranchIds.length,
        page: 1,
      },
      productLimit: 10,
      filters: {
        location: locationInput.locationInput,
        category: product.category.name,
        sortByPrice: "asc",
        branchIds: favoriteBranchIds,
      },
    } as BranchesWithProductsQueryVariables;
    if (stock) {
      const branchIdsWithStockBranchId = favoriteBranchIds.filter(
        (id) => id !== stock?.branchId,
      );
      branchIdsWithStockBranchId.push(stock?.branchId);
      variables.paginator.limit = branchIdsWithStockBranchId.length;
      variables.filters = {
        ...variables.filters,
        branchIds: branchIdsWithStockBranchId,
      };
      getRelatedBranchProducts({ variables });
    }
    getRelatedBranchProducts({ variables });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    relatedProductsSectionInView,
    lists,
    locationInput,
    product.category,
    stock,
  ]);

  return (
    <div>
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
          <AccordionTrigger badge={availableFavoriteBranches?.length}>
            Favorite Stores
          </AccordionTrigger>
          <AccordionContent>
            {loggedIn ? (
              <>
                {favBranchesPriceData ? (
                  <section className="grid grid-cols-2 gap-5 mt-5">
                    {mappedFavBranches.map(({ approximatePrice, ...s }, i) => (
                      <div
                        className="mb-3 flex flex-row"
                        key={`${s.id}-${i}-fav-store-stock`}
                      >
                        <StockItemMini
                          productId={product.id}
                          stock={s as Stock}
                          approximatePrice={approximatePrice ?? undefined}
                          quantityValue={product.quantityValue}
                          quantityType={product.quantityType}
                          disabled={s.id === 0 && !approximatePrice}
                        />
                      </div>
                    ))}
                  </section>
                ) : (
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
          <AccordionTrigger
            badge={stocksData?.getProductStocks?.paginator?.total}
          >
            Available at
          </AccordionTrigger>
          <AccordionContent>
            {stocksData ? (
              <>
                {stocksData.getProductStocks.paginator.total > 0 ? (
                  <>
                    <section className="grid grid-cols-2 gap-5 mt-5">
                      {stocksData.getProductStocks.stocks.map((s, i) => (
                        <div
                          className="mb-3 flex flex-row"
                          key={`${s.id}-${i}-available-stock`}
                        >
                          <StockItemMini
                            productId={product.id}
                            stock={s as Stock}
                            quantityValue={product.quantityValue}
                            quantityType={product.quantityType}
                          />
                        </div>
                      ))}
                    </section>

                    {stocksData.getProductStocks.paginator.numPages > 1 && (
                      <div className="flex flex-row items-center justify-center mt-7 mb-10">
                        <Link
                          href={`/products/${product.id}/stocks`}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-black flex flex-row items-center justify-center gap-2 px-5 py-2 rounded-full font-bold"
                        >
                          Show All
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="py-10 px-5 text-center">
                    No available stocks for this product
                  </p>
                )}
              </>
            ) : (
              <section className="grid grid-cols-2 gap-5 mt-5">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div className="mb-3" key={`available-stock-loading-${i}`}>
                      <StockItemMiniLoading />
                    </div>
                  ))}
              </section>
            )}
          </AccordionContent>
        </AccordionItem>

        {productNutritionData && (
          <AccordionItem value="nutrition-facts">
            <AccordionTrigger>Nutrition Facts</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="mb-5 flex flex-row items-center justify-end gap-2">
                <a
                  className="inline-flex items-center justify-center gap-2 bg-gray-700 px-4 py-1.5 rounded-full text-white"
                  href={`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${product.code}`}
                  target="_blank"
                >
                  <FiEdit />
                  Edit
                </a>

                <Button
                  size="sm"
                  className="cursor-pointer rounded-full bg-pricetra-green-heavy-dark has-[>svg]:px-4 px-4"
                  onClick={() =>
                    updateProductNutrition({
                      variables: { productId: product.id },
                    })
                  }
                  disabled={updatingProductNutrition}
                >
                  <IoRefresh />
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

        {product.description.length > 0 && (
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{product.description}</p>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="specifications">
          <AccordionTrigger>Specifications</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ProductSpecs product={product} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <section ref={relatedProductsSectionRef} className="w-full mt-[60px]">
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

                  <ScrollContainer hideButtons>
                    {Array(10)
                      .fill(0)
                      .map((_, j) => (
                        <ProductLoadingItemHorizontal
                          key={`branch-product-${i}-${j}`}
                        />
                      ))}
                  </ScrollContainer>
                </article>
              ))
          : branchesWithProducts.branchesWithProducts.branches.map(
              (branch, i) => (
                <article
                  className="my-7"
                  key={`branch-with-product-${branch.id}`}
                >
                  <div className="mb-5 px-5">
                    <BranchItemWithLogo
                      branch={branch as Branch}
                      branchTagline="Similar products in"
                    />
                  </div>

                  <ScrollContainer>
                    {adify(
                      branch.products ?? [],
                      getRandomIntInclusive(3, 6),
                    ).map((product) =>
                      typeof product === "object" ? (
                        <ProductItemHorizontal
                          product={product as Product}
                          branchSlug={branch.slug}
                          key={`related-branch-product-${branch.id}-${product.id}-${i}`}
                        />
                      ) : (
                        <HorizontalProductAd
                          id={i}
                          key={`horizontal-product-ad-${branch.id}-${product}-${i}`}
                        />
                      ),
                    )}
                  </ScrollContainer>
                </article>
              ),
            )}
      </section>
    </div>
  );
}
