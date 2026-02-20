"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  AllProductsDocument,
  Branch,
  CategoriesWithProductsDocument,
  Product,
  Store,
} from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client/react";
import ProductItem, { ProductItemLoading } from "@/components/product-item";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useMediaQuery } from "react-responsive";
import { SearchRouteParams } from "@/app/search/search-page-client";
import {
  getRandomIntInclusive,
  startOfNextSundayUTC,
  toBoolean,
} from "@/lib/utils";
import SearchFilters from "@/components/search-filters";
import { adify } from "@/lib/ads";
import VerticalProductAd from "@/components/ads/vertical-product-ad";
import VerticalSidebarAd from "@/components/ads/vertical-sidebar-ad";
import { uniqueId } from "lodash";
import BranchPageNavTools from "./components/branch-page-nav-tools";
import ProductFilterNavToolbar from "@/components/product-filters-nav-toolbar";
import ScrollContainer from "@/components/scroll-container";
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import HorizontalProductAd from "@/components/ads/horizontal-product-ad";
import Skeleton from "react-loading-skeleton";

export default function BranchPageClient({
  store,
  branch,
  searchParams,
  disableNavSettings = false,
}: {
  store: Store;
  branch: Branch;
  searchParams: SearchRouteParams;
  disableNavSettings?: boolean;
}) {
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
    navbarHeight,
    setNavTools,
    setSubHeader,
  } = useNavbar();
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  const paramsBuilder = useMemo(() => {
    const sp = { ...searchParams };
    delete sp.page;
    return new URLSearchParams(sp);
  }, [searchParams]);

  const [getCategorizedProducts, { data: categorizedProductsData }] =
    useLazyQuery(CategoriesWithProductsDocument, {
      fetchPolicy: "no-cache",
    });
  const [getProducts, { data: productsData }] = useLazyQuery(
    AllProductsDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  const topHeight = useMemo(() => navbarHeight + 65, [navbarHeight]);

  const paginatorUrlBase = useMemo(
    () => `/stores/${store.slug}/${branch.slug}`,
    [store.slug, branch.slug],
  );

  useLayoutEffect(() => {
    if (disableNavSettings) return;

    resetAll();

    setPageIndicator(
      <NavPageIndicator
        title={store.name}
        href={`/stores/${store.slug}`}
        imgSrc={createCloudinaryUrl(
          store.logo,
          100,
          100,
          startOfNextSundayUTC(),
        )}
        subTitle={`${branch.address.street}, ${branch.address.city}`}
        subTitleHref={branch.address.mapsLink}
        subTitleHrefTargetBlank
      />,
    );
    setSearchPlaceholder(`Search ${branch.name}`);
    setSearchQueryPath(`/stores/${store.slug}/${branch.slug}`);

    setSubHeader(<ProductFilterNavToolbar baseUrl="" />);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableNavSettings]);

  useLayoutEffect(() => {
    if (disableNavSettings) return;

    setNavTools(<BranchPageNavTools branch={branch} />);
    return () => {
      setNavTools(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, disableNavSettings]);

  useEffect(() => {
    if (paramsBuilder.size > 0) {
      // Load all products
      getProducts({
        variables: {
          paginator: {
            page: +(searchParams.page ?? 1),
            limit: +(searchParams.limit ?? 30),
          },
          search: {
            storeId: store.id,
            branchId: branch.id,
            query: searchParams.query,
            brand: searchParams.brand,
            category: searchParams.category,
            categoryId: searchParams.categoryId
              ? +searchParams.categoryId
              : undefined,
            sortByPrice: searchParams.sortByPrice,
            sale: searchParams.sale ? toBoolean(searchParams.sale) : undefined,
          },
        },
      });
    } else {
      getCategorizedProducts({
        variables: {
          paginator: {
            page: +(searchParams.page ?? 1),
            limit: 10,
          },
          productLimit: 20,
          filters: {
            branchId: branch.id,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsBuilder]);

  return (
    <>
      <div className="w-full max-w-[1000px] mt-5 px-5 flex-2">
        {paramsBuilder.size > 0 && (
          <div className="flex flex-row items-center gap-2 mb-10 flex-wrap">
            <SearchFilters params={searchParams} />
          </div>
        )}

        {paramsBuilder.size === 0 ? (
          <div>
            <div className="flex flex-col">
              {!categorizedProductsData
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <article
                        className="my-7"
                        key={`branch-with-product-loading-${i}`}
                      >
                        <div className="mb-5 px-5">
                          <Skeleton width="20%" height={28} borderRadius={10} />
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
                : categorizedProductsData.categoriesWithProducts.categories.map(
                    (category, i) => (
                      <article
                        className="my-7"
                        key={`categorized-products-${category.id}-${i}`}
                      >
                        <div className="mb-5 px-5">
                          <h2 className="text-base xs:text-lg sm:text-xl">
                            {category.name}
                          </h2>
                        </div>

                        <ScrollContainer>
                          {adify(
                            category.products ?? [],
                            getRandomIntInclusive(3, 6),
                          ).map((product, i) =>
                            typeof product === "object" ? (
                              <ProductItemHorizontal
                                product={product as Product}
                                branchSlug={branch.slug}
                                key={`branch-product-${category.id}-${product.id}`}
                              />
                            ) : (
                              <HorizontalProductAd
                                id={i}
                                key={`horizontal-product-ad-${category.id}-${product}-${i}`}
                              />
                            ),
                          )}
                        </ScrollContainer>
                      </article>
                    ),
                  )}
            </div>

            {categorizedProductsData?.categoriesWithProducts?.paginator &&
              categorizedProductsData.categoriesWithProducts.paginator && (
                <div className="mt-20">
                  <SmartPagination
                    paginator={
                      categorizedProductsData.categoriesWithProducts.paginator
                    }
                    urlBase={paginatorUrlBase}
                  />
                </div>
              )}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-3">
              {!productsData ? (
                Array(10)
                  .fill(0)
                  .map((_, j) => (
                    <ProductItemLoading
                      key={`product-loading-${j}`}
                      imgWidth={isMobile ? 110 : 130}
                    />
                  ))
              ) : (
                <>
                  {productsData.allProducts.paginator.total !== 0 ? (
                    adify(
                      productsData.allProducts.products,
                      getRandomIntInclusive(5, 10),
                    ).map((p, i) =>
                      typeof p === "object" ? (
                        <ProductItem
                          product={p as Product}
                          branchSlug={branch.slug}
                          imgWidth={isMobile ? 110 : 130}
                          key={`product-${p.id}-${i}`}
                          hideStoreInfo
                        />
                      ) : (
                        <VerticalProductAd
                          id={i}
                          key={`vertical-product-ad-${p}-${i}`}
                        />
                      ),
                    )
                  ) : (
                    <p className="py-10 px-5 text-center">No results</p>
                  )}
                </>
              )}
            </div>

            {productsData?.allProducts?.paginator &&
              productsData.allProducts.paginator.numPages > 1 && (
                <div className="mt-20">
                  <SmartPagination
                    paginator={productsData.allProducts.paginator}
                    urlBase={paginatorUrlBase}
                  />
                </div>
              )}
          </div>
        )}
      </div>

      <div className="w-full px-2 relative flex-1">
        <div
          className="w-full h-screen hidden lg:block lg:sticky top-0"
          style={{
            top: topHeight,
            maxHeight: `calc(100vh - ${topHeight}px)`,
          }}
        >
          <VerticalSidebarAd id={uniqueId()} />
        </div>
      </div>
    </>
  );
}
