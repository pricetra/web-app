import {
  Branch,
  BranchesWithProductsDocument,
  BranchesWithProductsQueryVariables,
  FindBranchesByDistanceDocument,
  GetProductNutritionDataDocument,
  LocationInput,
  Product,
  ProductNutrition,
  ProductSimple,
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
import { ProductLoadingItemHorizontal } from "@/components/product-item-horizontal";
import NutritionFacts from "@/components/nutrition-facts";
import { Button } from "@/components/ui/button";
import ScrollContainer from "@/components/scroll-container";
import { FiEdit } from "react-icons/fi";
import { IoRefresh } from "react-icons/io5";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useAuth, UserListsType } from "@/context/user-context";
import { useEffect, useMemo, useState } from "react";
import { LocationInputWithFullAddress } from "@/context/location-context";
import { useInView } from "react-intersection-observer";
import convert from "convert-units";
import MultiplexAds from "@/components/ads/multiplex-ads";
import { slugifyProductName } from "@/lib/strings";
import ProductsContainer from "@/components/ui/products-container";
import ProductDetailsFavoriteStoresTab from "./product-details-favorite-stores-tab";
import ProductDetailsInStoreStocksTab from "./product-details-in-store-stocks-tab";
import ProductDetailsOnlineStocksTab from "./product-details-online-stocks-tab";

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
  const { lists } = useAuth();
  const [relatedProductsSectionRef, relatedProductsSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0,
    initialInView: false,
  });
  const [getRelatedBranchProducts, { data: branchesWithProducts }] =
    useLazyQuery(BranchesWithProductsDocument, { fetchPolicy: "no-cache" });
  const [getBranchesByDistance] = useLazyQuery(FindBranchesByDistanceDocument);

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

  async function getBranchIds(
    lists: UserListsType | undefined,
    locationInput: LocationInput,
  ): Promise<number[]> {
    if (lists && lists.favorites.branchList) {
      return Promise.resolve(
        lists.favorites.branchList.map(({ branchId }) => branchId),
      );
    }

    const DEFAULT_RADIUS = Math.round(convert(20).from("mi").to("m"));
    const { data } = await getBranchesByDistance({
      variables: {
        lat: locationInput.latitude,
        lon: locationInput.longitude,
        radiusMeters: locationInput.radiusMeters ?? DEFAULT_RADIUS,
      },
    });
    if (!data) return Promise.resolve([]);
    const BRANCH_LIMIT = 5;
    const branchIds = data.findBranchesByDistance.map(({ id }) => id);
    if (branchIds.length <= BRANCH_LIMIT) return branchIds;
    return branchIds.slice(0, BRANCH_LIMIT);
  }

  const productUrlPath = useMemo(
    () => `/products/${product.id}-${slugifyProductName(product.name)}`,
    [product.id, product.name],
  );

  useEffect(() => {
    if (!relatedProductsSectionInView) return;
    if (!product.category) return;
    if (!locationInput) return;

    getBranchIds(lists, locationInput.locationInput).then(
      (favoriteBranchIds) => {
        const variables = {
          paginator: {
            limit: favoriteBranchIds.length,
            page: 1,
          },
          productLimit: 10,
          filters: {
            category: product.category!.name,
            sortByPrice: "asc",
            branchIds: favoriteBranchIds,
          },
        } as BranchesWithProductsQueryVariables;
        if (stock) {
          let branchIdsWithStockBranchId = favoriteBranchIds.filter(
            (id) => id !== stock?.branchId,
          );
          if (stock) {
            branchIdsWithStockBranchId = [
              stock.branchId,
              ...branchIdsWithStockBranchId,
            ];
          }
          variables.paginator.limit = branchIdsWithStockBranchId.length;
          variables.filters = {
            ...variables.filters,
            branchIds: branchIdsWithStockBranchId,
          };
          getRelatedBranchProducts({ variables });
        }
        getRelatedBranchProducts({ variables });
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    relatedProductsSectionInView,
    lists,
    locationInput,
    product.category,
    stock,
  ]);

  const [accordionValues, setAccordionValues] = useState<string[]>([
    "favorite-stores",
    "description",
  ]);
  useEffect(() => {
    const defaults: string[] = [];
    if (productNutritionData) {
      defaults.push("nutrition-facts");
    }
  }, [productNutritionData]);

  return (
    <div>
      <Accordion
        type="multiple"
        defaultChecked
        className="w-full px-5"
        value={accordionValues}
        onValueChange={setAccordionValues}
      >
        <ProductDetailsFavoriteStoresTab product={product} />

        <ProductDetailsInStoreStocksTab
          product={product}
          locationInput={locationInput}
          productUrlPath={productUrlPath}
          onDataLoaded={(tabName) => {
            setAccordionValues((v) => [...v, tabName]);
          }}
        />

        <ProductDetailsOnlineStocksTab
          product={product}
          productUrlPath={productUrlPath}
          onDataLoaded={(tabName) => {
            setAccordionValues((v) => [...v, tabName]);
          }}
        />

        <div className="my-5 flex flex-row items-center justify-center bg-gray-50">
          <MultiplexAds id="product-details-multiplex-1" />
        </div>

        {productNutritionData && (
          <AccordionItem value="nutrition-facts">
            <AccordionTrigger>Nutrition Facts</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="flex flex-row items-center justify-end gap-2">
                <Button
                  size="xs"
                  variant="default"
                  rounded
                  href={`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${product.code}`}
                  target="_blank"
                >
                  <FiEdit className="size-3.5" />
                  Edit
                </Button>

                <Button
                  size="xs"
                  variant="pricetra"
                  rounded
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

              <div className="flex flex-col md:flex-row gap-3 lg:gap-7 mb-7">
                {productNutritionData.getProductNutritionData.nutriments && (
                  <div className="flex-2 xl:flex-1">
                    <NutritionFacts
                      {...(productNutritionData.getProductNutritionData as ProductNutrition)}
                    />
                  </div>
                )}

                {productNutritionData.getProductNutritionData.ingredientList &&
                  productNutritionData.getProductNutritionData.ingredientList
                    .length > 0 && (
                    <div className="flex-2">
                      <h5 className="mb-1.5 text-base font-semibold">
                        Ingredients
                      </h5>
                      <p className="text-xs">
                        {productNutritionData.getProductNutritionData.ingredientList
                          .map((i) => i.toUpperCase())
                          .join(", ")}
                      </p>
                    </div>
                  )}
              </div>
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
          : branchesWithProducts.branchesWithProducts.branches.map((branch) => (
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

                <ProductsContainer
                  products={branch.products as ProductSimple[]}
                  branch={branch as Branch}
                  itemKeyPrefix={`related-branch-product-${branch.id}`}
                />
              </article>
            ))}
      </section>
    </div>
  );
}
