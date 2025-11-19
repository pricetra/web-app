"use client"
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import LoginSignupButtons from "@/components/login-signup-buttons";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import StoreMini, {
  StoreMiniLoading,
  StoreMiniShowMore,
} from "@/components/store-mini";
import { useAuth } from "@/context/user-context";
import {
  AllStoresDocument,
  Branch,
  BranchesWithProductsDocument,
  Product,
} from "@/graphql/types/graphql";
import useLocationInput from "@/hooks/useLocationInput";
import { useQuery } from "@apollo/client/react";

export default function HomePageClient() {
  const { loggedIn } = useAuth();
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
    <div className="w-full max-w-[1000px] mt-5">
      {!loggedIn && (
        <div className="px-5 sm:px-0 mb-10">
          <div className="text-center bg-gray-50 border-1 border-gray-200 px-7 py-8 sm:py-10 rounded-xl">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Beat Inflation. <span>Track Prices.</span>{" "}
                <span className="text-pricetra-green-dark">Save Money.</span>
              </h1>
            </div>
            <p className="mt-5 text-sm md:text-base text-slate-800 max-w-3xl mx-auto">
              Pricetra is a community-powered price tracking app that helps
              shoppers discover the best deals nearby. Compare prices, and get
              notified when prices change.
            </p>

            <div className="mt-10">
              <LoginSignupButtons />
            </div>
          </div>
        </div>
      )}

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
