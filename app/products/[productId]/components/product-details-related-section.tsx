import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import { ProductLoadingItemHorizontal } from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import ProductsContainer from "@/components/ui/products-container";
import { LocationInputWithFullAddress } from "@/context/location-context";
import { useAuth, UserListsType } from "@/context/user-context";
import { useLazyQuery } from "@apollo/client/react";
import convert from "convert-units";
import {
  Branch,
  BranchesWithProductsDocument,
  BranchesWithProductsQueryVariables,
  FindBranchesByDistanceDocument,
  LocationInput,
  Product,
  ProductSimple,
  Stock,
} from "graphql-utils";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export type ProductDetailsRelatedSectionProps = {
  product: Product;
  locationInput: LocationInputWithFullAddress;
  stock?: Stock;
};

export default function ProductDetailsRelatedSection({
  product,
  locationInput,
  stock,
}: ProductDetailsRelatedSectionProps) {
  const { lists } = useAuth();
  const [getRelatedBranchProducts, { data: branchesWithProducts }] =
    useLazyQuery(BranchesWithProductsDocument, { fetchPolicy: "no-cache" });
  const [getBranchesByDistance] = useLazyQuery(FindBranchesByDistanceDocument);
  const [relatedProductsSectionRef, relatedProductsSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0,
    initialInView: false,
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

  useEffect(() => {
    if (!relatedProductsSectionInView) return;
    if (!product.category) return;
    if (!locationInput) return;

    setTimeout(() => {
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
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    relatedProductsSectionInView,
    lists,
    locationInput,
    product.category,
    stock,
  ]);

  return (
    <section ref={relatedProductsSectionRef} className="w-full mt-[60px]">
      {!branchesWithProducts ||
      !branchesWithProducts.branchesWithProducts?.branches
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
            <article className="my-7" key={`branch-with-product-${branch.id}`}>
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
  );
}
