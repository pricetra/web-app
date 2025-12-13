"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  Branch,
  BranchesWithProductsDocument,
  Product,
  Store,
} from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect } from "react";
import { useQuery } from "@apollo/client/react";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import useLocationInput from "@/hooks/useLocationInput";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import ScrollContainer from "@/components/scroll-container";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useSearchParams } from "next/navigation";

export default function SelectedStorePageClient({ store }: { store: Store }) {
  const searchParams = useSearchParams();
  const pageString = searchParams.get("page");
  const { setPageIndicator, resetAll } = useNavbar();
  const location = useLocationInput();

  const { data: branchesWithProducts } = useQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: "no-cache",
      variables: {
        paginator: {
          page: +(pageString ?? 1),
          limit: 10,
        },
        productLimit: 20,
        filters: {
          storeId: store.id,
          location: location
            ? { ...location.locationInput, radiusMeters: undefined }
            : undefined,
        },
      },
    }
  );

  useLayoutEffect(() => {
    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={store.name}
        imgSrc={createCloudinaryUrl(store.logo, 100, 100)}
      />
    );

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full max-w-[1000px] mt-0 flex-1">
        <section>
          <div className="px-5 mt-5 mb-16">
            <h1 className="font-bold text-xl sm:text-2xl">
              Locations for {store.name}
            </h1>
          </div>

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

                    <ScrollContainer>
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
                (branch) => (
                  <article
                    className="my-7"
                    key={`branch-with-product-${branch.id}`}
                  >
                    <div className="mb-5 px-5">
                      <BranchItemWithLogo branch={branch as Branch} cityName />
                    </div>

                    <ScrollContainer>
                      {(branch.products ?? []).map((product) => (
                        <ProductItemHorizontal
                          product={product as Product}
                          key={`branch-product-${branch.id}-${product.id}`}
                        />
                      ))}
                    </ScrollContainer>
                  </article>
                )
              )}
        </section>

        {branchesWithProducts?.branchesWithProducts?.paginator &&
          branchesWithProducts?.branchesWithProducts?.paginator?.numPages >
            1 && (
            <div className="mt-20">
              <SmartPagination
                paginator={branchesWithProducts.branchesWithProducts.paginator}
              />
            </div>
          )}
      </div>

      <div></div>
    </>
  );
}
