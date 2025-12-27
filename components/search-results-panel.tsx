import { useLazyQuery } from "@apollo/client/react";
import {
  MyProductViewHistoryDocument,
  MySearchHistoryDocument,
  PopularProductsDocument,
  PopularSearchKeywordsDocument,
  Product,
  SearchKeywordsDocument,
} from "graphql-utils";
import ScrollContainer from "./scroll-container";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "./product-item-horizontal";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNextWeekDateRange } from "@/lib/utils";
import { useAuth } from "@/context/user-context";
import { useSearchContext } from "@/context/search-context";
import SearchResultItem from "./search-result-item";
import { MobileView } from "react-device-detect";

export type SearchResultsPanelProps = {
  onClickResult: () => void;
};

export default function SearchResultsPanel({
  onClickResult,
}: SearchResultsPanelProps) {
  const { loggedIn } = useAuth();

  const { searchText } = useSearchContext();
  const [searchKeywords] = useLazyQuery(SearchKeywordsDocument, {
    fetchPolicy: "no-cache",
  });
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  const [getProductViewHistory, { data: productViewHistory }] = useLazyQuery(
    MyProductViewHistoryDocument,
    { fetchPolicy: "no-cache" }
  );
  const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(
    MySearchHistoryDocument,
    { fetchPolicy: "cache-and-network" }
  );
  const [getPopularSearchKeywords, { data: keywordsData }] = useLazyQuery(
    PopularSearchKeywordsDocument,
    { fetchPolicy: "cache-and-network" }
  );
  const [getPopularProducts, { data: popularProductsData }] = useLazyQuery(
    PopularProductsDocument,
    { fetchPolicy: "no-cache" }
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

  useEffect(() => {
    if (!searchText || searchText.length === 0) return;

    searchKeywords({ variables: { search: searchText } }).then(({ data }) => {
      if (!data?.searchKeywords) return;
      setSuggestedKeywords([...data.searchKeywords]);
    });
  }, [searchKeywords, setSuggestedKeywords, searchText]);

  return (
    <div>
      {searchText && searchText.length > 0 ? (
        <div className="flex flex-col gap-2 px-0 xs:px-5">
          {suggestedKeywords.map((searchTerm, i) => (
            <SearchResultItem
              searchTerm={searchTerm}
              key={`search-suggestion-${i}-${searchTerm}`}
              handleOnClick={onClickResult}
            />
          ))}
          <SearchResultItem
            searchTerm={`search "${searchText}"`}
            customSearchQuery={searchText}
            handleOnClick={onClickResult}
          />
        </div>
      ) : (
        <>
          {loggedIn && (
            <div className="mb-10 border-b border-gray-200">
              {productViewHistory &&
                productViewHistory.myProductViewHistory.paginator.total > 0 && (
                  <div className="flex flex-col gap-5 mb-5">
                    <h3 className="font-bold text-lg md:text-xl px-5">
                      Recently viewed
                    </h3>

                    <ScrollContainer>
                      {productViewHistory.myProductViewHistory.products.map(
                        (product, i) => (
                          <ProductItemHorizontal
                            product={product as Product}
                            branchSlug={product.stock?.branch?.slug}
                            key={`recent-product-${product.id}-${i}`}
                            hideStoreInfo={false}
                            handleOnClick={onClickResult}
                          />
                        )
                      )}
                    </ScrollContainer>
                  </div>
                )}

              {searchHistoryData &&
                searchHistoryData.mySearchHistory.paginator.total > 0 && (
                  <div className="flex flex-col gap-5 mb-10">
                    <h3 className="font-bold text-lg md:text-xl px-5">
                      Recent searches
                    </h3>

                    <div className="flex flex-col gap-2 px-0 xs:px-5">
                      {searchHistoryData.mySearchHistory.searches.map(
                        ({ id, searchTerm }, i) => (
                          <SearchResultItem
                            searchTerm={searchTerm}
                            key={`search-keyword-${id}-${i}`}
                            handleOnClick={onClickResult}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
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
                      onClick={onClickResult}
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
                              branchSlug={product.stock?.branch?.slug}
                              key={`popular-product-${product.id}-${product.id}`}
                              hideStoreInfo={false}
                              handleOnClick={onClickResult}
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
        </>
      )}

      <MobileView>
        <div style={{ height: "20vh" }} />
      </MobileView>
    </div>
  );
}
