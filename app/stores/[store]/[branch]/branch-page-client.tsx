"use client";

import { useNavbar } from "@/context/navbar-context";
import { AllProductsDocument, Branch, Product, Store } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import ProductItem, { ProductItemLoading } from "@/components/product-item";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useMediaQuery } from "react-responsive";
import { SearchRouteParams } from "@/app/search/search-page-client";
import { getRandomIntInclusive, toBoolean } from "@/lib/utils";
import SearchFilters from "@/components/search-filters";
import { adify } from "@/lib/ads";
import VerticalProductAd from "@/components/ads/vertical-product-ad";

export default function BranchPageClient({
  store,
  branch,
  searchParams,
}: {
  store: Store;
  branch: Branch;
  searchParams: SearchRouteParams;
}) {
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
  } = useNavbar();
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  const paramsBuilder = useMemo(() => {
    const sp = { ...searchParams };
    delete sp.page;
    return new URLSearchParams(sp);
  }, [searchParams]);

  const { data: productsData } = useQuery(AllProductsDocument, {
    fetchPolicy: "no-cache",
    variables: {
      paginator: {
        page: +(searchParams.page ?? 1),
        limit: 30,
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

  useLayoutEffect(() => {
    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={store.name}
        href={`/stores/${store.slug}`}
        imgSrc={createCloudinaryUrl(store.logo, 100, 100)}
        subTitle={branch.address.fullAddress}
        subTitleHref={branch.address.mapsLink}
        subTitleHrefTargetBlank
      />,
    );
    setSearchPlaceholder(`Search ${branch.name}`);
    setSearchQueryPath(`/stores/${store.slug}/${branch.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full max-w-[1000px] mt-5 px-5 flex-1">
        {paramsBuilder.size > 0 && (
          <div className="mb-10">
            <SearchFilters params={searchParams} />
          </div>
        )}

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
              <SmartPagination paginator={productsData.allProducts.paginator} />
            </div>
          )}
      </div>

      <div />
    </>
  );
}
