"use client"
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import StoreMini, {
  StoreMiniLoading,
  StoreMiniShowMore,
} from "@/components/store-mini";
import {
  AllStoresDocument,
  Branch,
  BranchesWithProductsDocument,
  Product,
} from "@/graphql/types/graphql";
import useLocationInput from "@/hooks/useLocationInput";
import { useQuery } from "@apollo/client/react";

export default function HomePageClient() {
  const location = useLocationInput();
  const { data: allStoresData } = useQuery(AllStoresDocument, {
    fetchPolicy: "cache-first",
    variables: { paginator: { page: 1, limit: 9 } },
  });
  const { data: branchesWithProducts } = useQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: "no-cache",
      variables: {
        paginator: { page: 1, limit: 9 },
        productLimit: 10,
        filters: {
          location: location
            ? { ...location.locationInput, radiusMeters: undefined }
            : undefined,
        },
      },
    }
  );

  return (
    <div className="w-full max-w-[1000px] mt-8">
      <div className="grid grid-cols-5 lg:grid-cols-10 gap-x-2 gap-y-5 sm:gap-5 px-5 mb-10">
        {!allStoresData ? (
          Array(10)
            .fill(0)
            .map((_, i) => <StoreMiniLoading key={`store-loading-${i}`} />)
        ) : (
          <>
            {allStoresData.allStores.stores.map((store) => (
              <StoreMini store={store} key={`store-${store.id}`} />
            ))}
            <StoreMiniShowMore />
          </>
        )}
      </div>

      <div className="flex flex-col my-10">
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
          : branchesWithProducts.branchesWithProducts.branches.map((branch) => (
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
                      <ProductItemHorizontal product={product as Product} />
                    </div>
                  ))}
                </div>
              </article>
            ))}
      </div>
    </div>
  );
}
