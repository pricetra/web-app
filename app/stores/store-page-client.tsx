"use client";

import { useNavbar } from "@/context/navbar-context";
import { AllStoresDocument } from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import { useQuery } from "@apollo/client/react";
import { useLayoutEffect } from "react";
import { MdStorefront } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

export default function StorePageClient() {
  const { setPageIndicator, resetAll } = useNavbar();
  const { data } = useQuery(AllStoresDocument, {
    variables: {
      paginator: {
        page: 1,
        limit: 100,
      },
    },
  });

  useLayoutEffect(() => {
    setPageIndicator(
      <>
        <div className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
          <MdStorefront size={20} name="storefront" color="#396a12" />
        </div>

        <h2 className="font-bold line-clamp-1 break-all flex-1 sm:text-base text-sm">
          Stores
        </h2>
      </>
    );

    return () => {
      resetAll();
    };
  }, [setPageIndicator]);

  return (
    <div className="px-5 mt-10">
      {data?.allStores ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-7">
          {data.allStores.stores.map((s, i) => (
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
          ))}
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
}
