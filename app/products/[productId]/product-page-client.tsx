"use client";

import ProductFull, { ProductFullLoading } from "@/components/product-full";
import {
  Branch,
  BranchesWithProductsDocument,
  BranchesWithProductsQueryVariables,
  GetProductNutritionDataDocument,
  Product,
  ProductDocument,
  ProductNutrition,
  Stock,
  StockDocument,
  UpdateProductNutritionDataDocument,
} from "@/graphql/types/graphql";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import LandingHeader from "@/components/ui/landing-header";
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
    {
      fetchPolicy: "no-cache",
    }
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

  useEffect(() => {
    if (!stockId || !productData) return;
    getStock({
      variables: {
        stockId,
      },
    });
  }, [stockId, productData, getStock]);

  useEffect(() => {
    if (!productData) return;
    getProductNutritionData({
      variables: {
        productId: productData.product.id,
      },
    });
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
  }, [loggedIn, locationInput, favoriteBranchIds, productData, stockData]);

  return (
    <div>
      <LandingHeader />

      <div className="flex flex-col lg:flex-row gap-4 container mx-auto mb-10 mt-0 sm:mt-5 pb-7 pt-0 sm:pt-7 relative">
        <section className="px-5 w-full flex-1">
          <div className="lg:sticky top-0">
            <article className="bg-white">
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
              (stockData && !stockLoading && productData ? (
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
            defaultValue={["description"]}
          >
            {productData && productData.product.description.length > 0 && (
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{productData?.product?.description}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            {productData && productNutritionData && (
              <AccordionItem value="description">
                <AccordionTrigger>Nutrition Facts</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <div className="mb-10 flex flex-row items-center justify-end gap-2">
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
                    <div className="mt-5">
                      <NutritionFacts
                        {...(productNutritionData.getProductNutritionData as ProductNutrition)}
                      />
                    </div>
                  )}

                  {productNutritionData.getProductNutritionData
                    .ingredientList &&
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
                  (branch) => (
                    <article
                      className="my-7"
                      key={`branch-with-product-${branch.id}`}
                    >
                      <div className="mb-5 px-5">
                        <BranchItemWithLogo branch={branch as Branch} />
                      </div>

                      <div className="flex flex-row gap-5 overflow-x-auto py-2.5 lg:px-2.5 lg:[mask-image:_linear-gradient(to_right,transparent_0,_black_2em,_black_calc(100%-2em),transparent_100%)]">
                        {(branch.products ?? []).map((product) => (
                          <div
                            className="first:pl-5 last:pr-5"
                            key={`branch-product-${branch.id}-${product.id}`}
                          >
                            <ProductItemHorizontal
                              product={product as Product}
                            />
                          </div>
                        ))}
                      </div>
                    </article>
                  )
                )}
          </section>
        </section>
      </div>
    </div>
  );
}
