"use client";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import {
  ProductLoadingItemHorizontal,
} from "@/components/product-item-horizontal";
import ScrollContainer from "@/components/scroll-container";
import StoreMini, {
  StoreMiniLoading,
  StoreMiniShowMore,
} from "@/components/store-mini";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useAuth } from "@/context/user-context";
import {
  AllStoresDocument,
  Branch,
  BranchesWithProductsDocument,
  ProductSimple,
} from "graphql-utils";
import useLocationInput from "@/hooks/useLocationInput";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import WelcomeHeroBanner from "@/components/welcome-hero-banner";
import { useLayoutEffect, useMemo } from "react";
import { useNavbar } from "@/context/navbar-context";
import ProductFilterNavToolbar from "@/components/product-filters-nav-toolbar";
import MyBranchPanel from "@/components/my-branches-panel";
import VerticalSidebarAd from "@/components/ads/vertical-sidebar-ad";
import { uniqueId } from "lodash";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { FaRegCompass } from "react-icons/fa6";
import ProductsContainer from "@/components/ui/products-container";

export default function HomePageClient({ ipAddress }: { ipAddress?: string }) {
  const { setSubHeader, setPageIndicator, resetAll, navbarHeight } =
    useNavbar();
  const searchParams = useSearchParams();
  const pageString = searchParams.get("page");
  const { loggedIn, myStoreUsers } = useAuth();
  const location = useLocationInput(!loggedIn ? ipAddress : undefined);
  const { data: allStoresData } = useQuery(AllStoresDocument, {
    fetchPolicy: "cache-first",
    variables: { paginator: { page: 1, limit: 9 } },
  });
  const { data: branchesWithProducts } = useQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: "no-cache",
      variables: {
        paginator: { page: +(pageString ?? 1), limit: 10 },
        productLimit: 10,
        filters: {
          location: location
            ? { ...location.locationInput, radiusMeters: undefined }
            : undefined,
        },
      },
    },
  );
  const topHeight = useMemo(() => navbarHeight + 65, [navbarHeight]);

  useLayoutEffect(() => {
    resetAll();

    setSubHeader(<ProductFilterNavToolbar baseUrl="/search" />);
    setPageIndicator(<NavPageIndicator title="Browse" icon={FaRegCompass} />);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full max-w-[1000px] flex-1">
        {!loggedIn && <WelcomeHeroBanner />}

        {(!pageString || pageString === "1") && (
          <>
            <div className="grid grid-cols-5 lg:grid-cols-10 gap-x-2 gap-y-5 sm:gap-5 px-5 mt-5 mb-16 sm:my-10">
              {!allStoresData ? (
                Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <StoreMiniLoading key={`store-loading-${i}`} />
                  ))
              ) : (
                <>
                  {allStoresData.allStores.stores.map((store) => (
                    <StoreMini store={store} key={`store-${store.id}`} />
                  ))}
                  <StoreMiniShowMore />
                </>
              )}
            </div>

            {myStoreUsers && <MyBranchPanel />}
          </>
        )}

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
            : branchesWithProducts.branchesWithProducts.branches.map(
                (branch) => (
                  <article
                    className="my-7"
                    key={`branch-with-product-${branch.id}`}
                  >
                    <div className="mb-5 px-5">
                      <BranchItemWithLogo branch={branch as Branch} />
                    </div>

                    {branch.products && (
                      <ProductsContainer
                        products={branch.products as ProductSimple[]}
                        branch={branch as Branch}
                        itemKeyPrefix="branch-product-home"
                      />
                    )}
                  </article>
                ),
              )}
        </div>

        {branchesWithProducts?.branchesWithProducts?.paginator &&
          branchesWithProducts.branchesWithProducts.paginator.numPages && (
            <div className="mt-20">
              <SmartPagination
                paginator={branchesWithProducts.branchesWithProducts.paginator}
                urlBase="/search"
              />
            </div>
          )}
      </div>

      <div className="w-full px-2 relative">
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
