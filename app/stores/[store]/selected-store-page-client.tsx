"use client";

import { useNavbar } from "@/context/navbar-context";
import { Store } from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect } from "react";
import Image from "next/image";

export default function SelectedStorePageClient({ store }: { store: Store }) {
  const { setPageIndicator, resetAll } = useNavbar();

  useLayoutEffect(() => {
    setPageIndicator(
      <>
        <Image
          alt={store.name}
          src={createCloudinaryUrl(store.logo, 100, 100)}
          width={100}
          height={100}
          quality={100}
          className="flex size-[35px] items-center justify-center rounded-md bg-white"
        />

        <h2 className="font-bold line-clamp-1 break-all flex-1 sm:text-base text-sm">
          {store.name}
        </h2>
      </>
    );

    return () => {
      resetAll();
    };
  }, []);

  return <div className="px-5 mt-0 sm:mt-10"></div>;
}
