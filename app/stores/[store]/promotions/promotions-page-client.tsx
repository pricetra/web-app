"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { Store, StorefrontFlyer, StorefrontFlyersDocument } from "graphql-utils";
import { Button } from "@/components/ui/button";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuth } from "@/context/user-context";
import { useNavbar } from "@/context/navbar-context";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { createCloudinaryUrl } from "@/lib/files";
import { MdModeEditOutline } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { SmartPagination } from "@/components/ui/smart-pagination";
import FlyerCard from "@/components/flyer-card";

type PromotionsPageClientProps = {
  storeSlug: string;
  store: Store;
};

export default function PromotionsPageClient({
  store,
}: PromotionsPageClientProps) {
  const { myStoreUsers } = useAuth();
  const {
    setPageIndicator,
    setNavTools,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
  } = useNavbar();
  const [page, setPage] = useState(1);
  const { data: flyersData, loading: flyersLoading } = useQuery(
    StorefrontFlyersDocument,
    {
      variables: {
        storeId: store.id,
        paginator: { limit: 20, page },
      },
    },
  );
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const flyers = flyersData?.storefrontFlyers?.flyers || [];

  useLayoutEffect(() => {
    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={store.name}
        imgSrc={createCloudinaryUrl(store.logo, 100, 100)}
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
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          Promotions and Flyers
        </h1>
      </div>

      {flyersLoading ? (
        <div className="text-center py-12">Loading flyers...</div>
      ) : flyers.length === 0 ? (
        <div className="flex flex-row items-center justify-center p-8 text-center">
          <p className="text-gray-600 mb-4">No flyers available</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flyers.map((flyer) => (
              <Link
                href={`/stores/${store.slug}/promotions/${flyer.uid}`}
                key={flyer.uid}
              >
                <FlyerCard flyer={flyer as StorefrontFlyer} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {flyersData?.storefrontFlyers?.paginator &&
            flyersData.storefrontFlyers.paginator.numPages > 1 && (
              <div className="mt-6">
                <SmartPagination
                  paginator={flyersData.storefrontFlyers.paginator}
                  disableHref
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}
