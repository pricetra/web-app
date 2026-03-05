"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  AllProductsDocument,
  Branch,
  CategoriesWithProductsDocument,
  Category,
  Product,
  ProductSearch,
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
  categoriesFromChild,
  getRandomIntInclusive,
  startOfNextSundayUTC,
  toBoolean,
} from "@/lib/utils";
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
import Link from "@/components/ui/link";
import { FiChevronRight } from "react-icons/fi";
import { cleanUrl } from "@/lib/strings";

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
    if (sp.query?.length === 0) delete sp.query;
    delete sp.page;
    delete sp.sale;
    delete sp.sortByPrice;
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

    let subTitle = '';
    let subTitleHref = ''
    if (branch.address) {
      subTitle = `${branch.address.street}, ${branch.address.city}`;
      subTitleHref = branch.address.mapsLink
    }
    if (branch.onlineAddress) {
      subTitle = cleanUrl(branch.onlineAddress.url);
      subTitleHref = branch.onlineAddress.url;
    }
    // TODO: branch online address
    setPageIndicator(
      <NavPageIndicator
        href={`/stores/${store.slug}`}
        title={store.name}
        titleHref={`/stores/${store.slug}/${branch.slug}`}
        imgSrc={createCloudinaryUrl(
          store.logo,
          100,
          100,
          startOfNextSundayUTC(),
        )}
        subTitle={subTitle}
        subTitleHref={subTitleHref}
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
    const search = {
      sortByPrice: searchParams.sortByPrice,
      sale: searchParams.sale ? toBoolean(searchParams.sale) : undefined,
    } as ProductSearch;

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
            ...search,
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
            ...search,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsBuilder]);

  return (
    <>
      <div className="w-full max-w-[1000px] flex-2">
        {paramsBuilder.size === 0 ? (
          <div>
            <div className="flex flex-col">
              {!categorizedProductsData
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <article
                        className="my-5"
                        key={`branch-with-product-loading-${i}`}
                      >
                        <div className="mb-3 px-5">
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
                    (category, i) => {
                      const categories = categoriesFromChild(
                        category as Category,
                      );
                      const linkBase = `/stores/${store.slug}/${branch.slug}`;
                      const link = `${linkBase}?categoryId=${category.id}&category=${category.name}`;
                      const prevCategory =
                        categories.at(categories.length - 2) ?? category;
                      return (
                        <article
                          className="my-5"
                          key={`categorized-products-${category.id}-${i}`}
                        >
                          <div className="flex flex-row items-center mb-3 px-5 w-full py-1">
                            <div className="flex flex-col gap-2 flex-2">
                              <h2 className="text-base xs:text-lg font-bold sm:text-xl leading-none">
                                <Link href={link} className="hover:underline">
                                  {category.name}
                                </Link>
                              </h2>
                              <p className="text-xs leading-none">
                                in{" "}
                                <Link
                                  href={`${linkBase}?categoryId=${prevCategory.id}&category=${prevCategory.name}`}
                                  className="hover:underline"
                                >
                                  {prevCategory.name}
                                </Link>
                              </p>
                            </div>

                            <Link href={link} className="p-2">
                              <FiChevronRight className="size-5" />
                            </Link>
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
                      );
                    },
                  )}
            </div>

            {categorizedProductsData?.categoriesWithProducts?.paginator &&
              categorizedProductsData.categoriesWithProducts.paginator.numPages > 1 && (
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
          <div className="px-5 mt-5">
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
