"use client";
import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import ProductItemHorizontal, {
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
  Product,
} from "graphql-utils";
import useLocationInput from "@/hooks/useLocationInput";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import WelcomeHeroBanner from "@/components/welcome-hero-banner";
import { useLayoutEffect } from "react";
import { useNavbar } from "@/context/navbar-context";
import ProductFilterNavToolbar from "@/components/product-filters-nav-toolbar";
import MyBranchPanel from "@/components/my-branches-panel";
import HorizontalProductAd from "@/components/ads/horizontal-product-ad";
import { adify } from "@/lib/ads";
import { getRandomIntInclusive } from "@/lib/utils";

export default function HomePageClient({ ipAddress }: { ipAddress?: string }) {
  const { setSubHeader, resetAll } = useNavbar();
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

  useLayoutEffect(() => {
    resetAll();

    setSubHeader(<ProductFilterNavToolbar baseUrl="/search" />);

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

                    <ScrollContainer>
                      {adify(branch.products ?? [], getRandomIntInclusive(3, 6)).map((product, i) =>
                        typeof product === "object" ? (
                          <ProductItemHorizontal
                            product={product as Product}
                            branchSlug={branch.slug}
                            key={`branch-product-${branch.id}-${product.id}`}
                          />
                        ) : (
                          <HorizontalProductAd
                            id={i}
                            key={`horizontal-product-ad-${branch.id}-${product}-${i}`}
                          />
                        ),
                      )}
                    </ScrollContainer>
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

      <div className="w-full p-2 relative">
        <div className="w-full h-screen hidden lg:block">
          <div
            dangerouslySetInnerHTML={{
              __html: `<amp-ad
            width="100vw"
            height="320"
            type="adsense"
            data-ad-client="ca-pub-9688831646501290"
            data-ad-slot="4034724130"
            data-auto-format="rspv"
            data-full-width=""
          >
            <div overflow=""></div>
          </amp-ad>`,
            }}
          />
        </div>
      </div>
    </>
  );
}
