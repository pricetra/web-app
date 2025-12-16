import { useLazyQuery } from "@apollo/client/react";
import {
  MyProductViewHistoryDocument,
  MySearchHistoryDocument,
  PopularProductsDocument,
  PopularSearchKeywordsDocument,
  Product,
} from "graphql-utils";
import ScrollContainer from "./scroll-container";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "./product-item-horizontal";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useEffect } from "react";
import { getNextWeekDateRange } from "@/lib/utils";
import { useAuth } from "@/context/user-context";
import { IoIosSearch } from "react-icons/io";

export default function SearchResultsPanel() {
  const { loggedIn } = useAuth();

  const [getProductViewHistory, { data: productViewHistory }] = useLazyQuery(
    MyProductViewHistoryDocument,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(
    MySearchHistoryDocument,
    {
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

  useEffect(() => {
    const nextWeekDateRange = getNextWeekDateRange();
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

  useEffect(() => {
    if (!loggedIn) return;

    getProductViewHistory({
      variables: { paginator: { page: 1, limit: 10 } },
    });
    getSearchHistory({
      variables: { paginator: { page: 1, limit: 10 } },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <div>
      {loggedIn && (
        <div className="mb-10 border-b border-gray-200">
          <div className="flex flex-col gap-5 mb-5">
            <h3 className="font-bold text-lg md:text-xl px-5">
              Recently viewed
            </h3>

            <div>
              {productViewHistory && (
                <>
                  {productViewHistory.myProductViewHistory.paginator.total ===
                  0 ? (
                    <div className="py-10">
                      <h3 className="text-center">No results</h3>
                    </div>
                  ) : (
                    <article>
                      <ScrollContainer>
                        {productViewHistory.myProductViewHistory.products.map(
                          (product, i) => (
                            <ProductItemHorizontal
                              product={product as Product}
                              key={`recent-product-${product.id}-${i}`}
                              hideStoreInfo={false}
                            />
                          )
                        )}
                      </ScrollContainer>
                    </article>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 mb-10 px-5">
            <h3 className="font-bold text-lg md:text-xl">Recent searches</h3>

            <div className="flex flex-col gap-2">
              {searchHistoryData && (
                <>
                  {searchHistoryData.mySearchHistory.searches.map(
                    ({ id, searchTerm }, i) => (
                      <Link
                        href={`/search?query=${encodeURIComponent(searchTerm)}`}
                        key={`search-keyword-${id}-${i}`}
                        className="py-1.5"
                      >
                        <div className="flex flex-row items-center gap-5">
                          <IoIosSearch className="size-4" />
                          <span>{searchTerm}</span>
                        </div>
                      </Link>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-5" />

      <div className="flex flex-col gap-5 mb-10 px-5">
        <h3 className="font-bold text-lg md:text-xl">Popular searches</h3>

        <div className="flex flex-row flex-wrap gap-2 items-center justify-start">
          {keywordsData ? (
            <>
              {keywordsData.popularSearchKeywords.searches.map((k, i) => (
                <Link
                  href={`/search?query=${encodeURIComponent(k)}`}
                  key={`search-keyword-${k}-${i}`}
                  className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-sm"
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
        <h3 className="font-bold text-lg md:text-xl px-5">Trending products</h3>

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
                          key={`popular-product-${product.id}-${product.id}`}
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
                    <ProductLoadingItemHorizontal
                      key={`popular-product-loading-${j}`}
                    />
                  ))}
              </ScrollContainer>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
