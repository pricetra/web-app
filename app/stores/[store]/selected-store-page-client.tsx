"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  Branch,
  BranchesWithProductsDocument,
  Product,
  Store,
} from "graphql-utils/types/graphql";
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
        productLimit: 10,
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
    <div className="mt-0 sm:mt-10">
      <section>
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
            ))}
      </section>

      {branchesWithProducts?.branchesWithProducts?.paginator && (
        <div className="mt-20">
          <SmartPagination
            paginator={branchesWithProducts.branchesWithProducts.paginator}
          />
        </div>
      )}
    </div>
  );
}
