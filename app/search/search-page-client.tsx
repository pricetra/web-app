"use client";

import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { SmartPagination } from "@/components/ui/smart-pagination";
import WelcomeHeroBanner from "@/components/welcome-hero-banner";
import { useNavbar } from "@/context/navbar-context";
import { useAuth } from "@/context/user-context";
import useLocationInput from "@/hooks/useLocationInput";
import { getNextWeekDateRange } from "@/lib/utils";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  Branch,
  BranchesWithProductsDocument,
  PopularProductsDocument,
  PopularSearchKeywordsDocument,
  Product,
  ProductSearch,
} from "graphql-utils";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { IoIosSearch } from "react-icons/io";
import Skeleton from "react-loading-skeleton";

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
  const { setPageIndicator } = useNavbar();
  const locationInput = useLocationInput(ipAddress);
  const paramsBuilder = new URLSearchParams(params);
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

  const [getPopularSearchKeywords, { data: keywordsData }] = useLazyQuery(
    PopularSearchKeywordsDocument,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [getPopularProducts, { data: popularProductsData }] = useLazyQuery(
    PopularProductsDocument,
    {
      fetchPolicy: "no-cache",
    }
  );

  const nextWeekDateRange = getNextWeekDateRange();

  useLayoutEffect(() => {
    setPageIndicator(
      <NavPageIndicator icon={IoIosSearch} title="Search" href="/search" />
    );
    return () => {
      setPageIndicator(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paramsBuilder.size !== 0) return;

    getPopularSearchKeywords({
      variables: {
        paginator: {
          limit: 20,
          page: 1,
        },
        dateRange: nextWeekDateRange,
      },
    });

    getPopularProducts({
      variables: {
        paginator: {
          limit: 20,
          page: 1,
        },
        dateRange: nextWeekDateRange,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsBuilder.size]);

  return (
    <div className="w-full max-w-[1000px]">
      {!loggedIn && <WelcomeHeroBanner />}

      {paramsBuilder.size === 0 && (
        <div className="mb-10">
          <div className="flex flex-col gap-5 mb-10 px-5">
            <h3 className="font-bold text-xl md:text-2xl">Popular searches</h3>

            <div className="flex flex-row flex-wrap gap-2 items-center justify-start">
              {keywordsData ? (
                <>
                  {keywordsData.popularSearchKeywords.searches.map((k, i) => (
                    <Link
                      href={`?query=${encodeURIComponent(k)}`}
                      key={`search-keyword-${k}-${i}`}
                      className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full"
                    >
                      {k}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {Array(20)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton
                        style={{ borderRadius: 20, height: 34, width: 80 }}
                        key={`keyword-loading-${i}`}
                      />
                    ))}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-xl md:text-2xl px-5">
              Trending products
            </h3>

            <div>
              {popularProductsData ? (
                <>
                  {popularProductsData.popularProducts.paginator.total === 0 ? (
                    <div className="py-10">
                      <h3 className="text-center">No results</h3>
                    </div>
                  ) : (
                    <article>
                      <ScrollContainer>
                        {popularProductsData.popularProducts.products.map(
                          (product) => (
                            <ProductItemHorizontal
                              product={product as Product}
                              key={`branch-product-${product.id}-${product.id}`}
                              hideStoreInfo={false}
                            />
                          )
                        )}
                      </ScrollContainer>
                    </article>
                  )}
                </>
              ) : (
                <article>
                  <ScrollContainer hideButtons>
                    {Array(20)
                      .fill(0)
                      .map((_, j) => (
                        <div
                          className="first:pl-5 last:pr-5"
                          key={`popular-product-loading-${j}`}
                        >
                          <ProductLoadingItemHorizontal />
                        </div>
                      ))}
                  </ScrollContainer>
                </article>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {!branchesWithProducts ? (
          Array(3)
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
                      <div
                        className="first:pl-5 last:pr-5"
                        key={`branch-product-${i}-${j}`}
                      >
                        <ProductLoadingItemHorizontal />
                      </div>
                    ))}
                </ScrollContainer>
              </article>
            ))
        ) : (
          <>
            {branchesWithProducts.branchesWithProducts.paginator.total === 0 ? (
              <div className="py-10">
                <h3 className="text-center">No results</h3>
              </div>
            ) : (
              branchesWithProducts.branchesWithProducts.branches.map(
                (branch) => (
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
                )
              )
            )}
          </>
        )}
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
