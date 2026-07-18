"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  Branch,
  BranchesWithProductsDocument,
  ProductSimple,
  Store,
} from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import { ProductLoadingItemHorizontal } from "@/components/product-item-horizontal";
import useLocationInput from "@/hooks/useLocationInput";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import ScrollContainer from "@/components/scroll-container";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useSearchParams } from "next/navigation";
import VerticalSidebarAd from "@/components/ads/vertical-sidebar-ad";
import { uniqueId } from "lodash";
import { startOfNextSundayUTC } from "@/lib/utils";
import ProductsContainer from "@/components/ui/products-container";
import StorefrontBanner from "@/components/storefront-banner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/user-context";
import { MdModeEditOutline } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import LocationDialogButton from "@/components/location-dialog-button";
import { useProductSearchFilters } from "@/context/product-search-filters-context";
import {
  GridLayoutContainerMain,
  GridLayoutContainerSecondary,
} from "@/components/ui/grid-layout-container";

export type SelectedStorePageClientProps = {
  store: Store;
  ipAddress?: string;
};

export default function SelectedStorePageClient({
  store,
  ipAddress,
}: SelectedStorePageClientProps) {
  const { myStoreUsers } = useAuth();
  const { navbarHeight } = useNavbar();
  const searchParams = useSearchParams();
  const pageString = searchParams.get("page");
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
    setNavTools,
  } = useNavbar();
  const location = useLocationInput();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const { searchFilters } = useProductSearchFilters();

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
          ...searchFilters,
          storeId: store.id,
          location: location?.locationInput,
        },
        viewerTrail: {
          metadata: {
            device: "web",
            ipAddress,
          },
        },
      },
    },
  );

  const topHeight = useMemo(() => navbarHeight + 40, [navbarHeight]);

  useLayoutEffect(() => {
    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={store.name}
        imgSrc={createCloudinaryUrl(
          store.logo,
          100,
          100,
          startOfNextSundayUTC(),
        )}
        href={`/stores/${store.slug}`}
      />,
    );
    setSearchPlaceholder(`Search ${store.name}`);
    setSearchQueryPath(`/stores/${store.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!myStoreUsers) return;

    const isUserStoreManager = myStoreUsers.some(
      (su) => su.storeId === store.id && su.branchId === null,
    );
    if (!isUserStoreManager) return;

    setNavTools(
      <>
        <Button
          href={`/stores/${store.slug}/manage`}
          variant="pricetra"
          className="bg-transparent text-pricetra-green-heavy-dark hover:bg-green-50 font-bold border border-transparent hover:border-green-100 shadow-none"
          size={isSmallScreen ? "xs" : "default"}
        >
          <MdModeEditOutline className="mr-1" />
          {isSmallScreen ? "" : "Manage Store"}
        </Button>
      </>,
    );

    return () => {
      setNavTools(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myStoreUsers, store.id, store.slug, isSmallScreen]);

  return (
    <>
      <GridLayoutContainerMain>
        <section>
          {(!pageString || pageString === "1") && (
            <StorefrontBanner store={store} />
          )}

          <div className="px-5 mt-5 mb-16 flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
            <div className="flex-1">
              <h1 className="font-bold text-xl sm:text-2xl">
                Explore Location
              </h1>
              <span>
                at <u>{store.name}</u>
              </span>
            </div>

            <div className="flex-1 flex sm:justify-end">
              <LocationDialogButton size="sm" />
            </div>
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

                    {branch.products && (
                      <ProductsContainer
                        products={branch.products as ProductSimple[]}
                        branch={branch as Branch}
                        itemKeyPrefix={`store-branch-product-${branch.id}`}
                      />
                    )}
                  </article>
                ),
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
      </GridLayoutContainerMain>

      <GridLayoutContainerSecondary sticky stickyTopHeight={topHeight}>
        <VerticalSidebarAd id={uniqueId()} />
      </GridLayoutContainerSecondary>
    </>
  );
}
