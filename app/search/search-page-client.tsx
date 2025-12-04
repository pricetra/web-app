"use client";

import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import { SmartPagination } from "@/components/ui/smart-pagination";
import WelcomeHeroBanner from "@/components/welcome-hero-banner";
import { useAuth } from "@/context/user-context";
import useLocationInput from "@/hooks/useLocationInput";
import { useQuery } from "@apollo/client/react";
import {
  Branch,
  BranchesWithProductsDocument,
  Product,
  ProductSearch,
} from "graphql-utils";
import { useMemo } from "react";

export type SearchRouteParams = {
  query?: string;
  categoryId?: string;
  category?: string;
  brand?: string;
  sale?: string;
  sortByPrice?: string;
  page?: string;
};

export type SearchPageClientProps = {
  searchParams: SearchRouteParams;
  ipAddress: string;
};

export default function SearchPageClient({
  searchParams: params,
  ipAddress,
}: SearchPageClientProps) {
  const { loggedIn } = useAuth();
  const locationInput = useLocationInput(ipAddress);
  const searchVariables = useMemo(
    () =>
      ({
        query: params.query,
        location: locationInput?.locationInput,
        categoryId: params?.categoryId ? +params.categoryId : undefined,
        brand: params.brand,
        sortByPrice: params.sortByPrice,
        sale: params.sale === "true" ? true : undefined,
      } as ProductSearch),
    [
      params.query,
      params.categoryId,
      params.brand,
      params.sortByPrice,
      params.sale,
      locationInput?.locationInput,
    ]
  );
  const { data: branchesWithProducts } = useQuery(
    BranchesWithProductsDocument,
    {
      variables: {
        paginator: { page: +(params.page ?? 1), limit: 10 },
        productLimit: 10,
        filters: { ...searchVariables },
      },
      fetchPolicy: "no-cache",
    }
  );
  return (
    <div className="w-full max-w-[1000px]">
      {!loggedIn && <WelcomeHeroBanner />}

      <div className="flex flex-col">
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

                  <div className="flex flex-row gap-5 overflow-x-auto py-2.5 lg:px-2.5 lg:mask-[linear-gradient(to_right,transparent_0,black_2em,black_calc(100%-2em),transparent_100%)]">
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
      </div>

      {branchesWithProducts?.branchesWithProducts?.paginator &&
        branchesWithProducts.branchesWithProducts.paginator.numPages > 1 && (
          <div className="mt-20">
            <SmartPagination
              paginator={branchesWithProducts.branchesWithProducts.paginator}
            />
          </div>
        )}
    </div>
  );
}
