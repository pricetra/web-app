import { useLazyQuery } from "@apollo/client/react";
import { PopularProductsDocument, PopularSearchKeywordsDocument, Product } from "graphql-utils";
import ScrollContainer from "./scroll-container";
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from "./product-item-horizontal";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useEffect } from "react";
import { getNextWeekDateRange } from "@/lib/utils";

export default function SearchResultsPanel() {
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

  useEffect(() => {
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
          limit: 10,
          page: 1,
        },
        dateRange: nextWeekDateRange,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div>
      <div className="flex flex-col gap-5 mb-10 px-5">
        <h3 className="font-bold text-lg md:text-xl">Popular searches</h3>

        <div className="flex flex-row flex-wrap gap-2 items-center justify-start">
          {keywordsData ? (
            <>
              {keywordsData.popularSearchKeywords.searches.map((k, i) => (
                <Link
                  href={`/search?query=${encodeURIComponent(k)}`}
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
        <h3 className="font-bold text-lg md:text-xl px-5">
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
  );
}
