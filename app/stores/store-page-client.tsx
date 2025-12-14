"use client";

import { useNavbar } from "@/context/navbar-context";
import { AllStoresDocument } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { useQuery } from "@apollo/client/react";
import { useLayoutEffect } from "react";
import { MdStorefront } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import Skeleton from "react-loading-skeleton";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useSearchParams } from "next/navigation";

export default function StorePageClient() {
  const searchParams = useSearchParams();
  const pageString = searchParams.get("page");
  const searchQuery = searchParams.get("query");
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
  } = useNavbar();
  const { data } = useQuery(AllStoresDocument, {
    variables: {
      paginator: {
        page: +(pageString ?? 1),
        limit: 30,
      },
      search: searchQuery ?? undefined,
    },
  });

  useLayoutEffect(() => {
    resetAll();
    setPageIndicator(
      <NavPageIndicator title="Stores" icon={MdStorefront} href="/stores" />
    );
    setSearchPlaceholder("Search stores");
    setSearchQueryPath("/stores");

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex-1">
        <section className="px-5 mt-0 sm:mt-10">
          {data?.allStores ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-7">
              {data.allStores.paginator.total !== 0 ? (
                data.allStores.stores.map((s, i) => (
                  <Link
                    href={`/stores/${s.slug}`}
                    className="flex flex-1 flex-row gap-4"
                    key={`store-${s.slug}-${i}`}
                  >
                    <Image
                      src={createCloudinaryUrl(s.logo, 500, 500)}
                      className="size-[40px] sm:size-[60px] rounded-lg sm:rounded-xl"
                      width={200}
                      height={200}
                      quality={100}
                      alt={s.name}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 4,
                        flexWrap: "wrap",
                        flex: 1,
                      }}
                    >
                      <div className="flex w-full flex-row items-center gap-2.5">
                        <h3 className="flex-1 text-base sm:text-lg font-normal md:font-semibold line-clamp-2">
                          {s.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-10 text-center">No stores found</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-7">
              {Array(20)
                .fill(0)
                .map((_, i) => (
                  <div
                    className="flex flex-1 flex-row gap-4"
                    key={`store-loading-${i}`}
                  >
                    <div className="size-[40px] sm:size-[60px]">
                      <Skeleton
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 15,
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Skeleton
                        style={{ borderRadius: 10, width: "60%", height: 23 }}
                      />
                      <Skeleton
                        style={{
                          borderRadius: 10,
                          width: "40%",
                          height: 17,
                          marginTop: 10,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {data?.allStores?.paginator && (
          <div className="mt-20">
            <SmartPagination paginator={data.allStores.paginator} />
          </div>
        )}
      </div>

      <div />
    </>
  );
}
