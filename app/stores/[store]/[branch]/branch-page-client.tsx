"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  AllProductsDocument,
  Branch,
  Store,
} from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";

export default function BranchPageClient({ store, branch }: { store: Store, branch: Branch }) {
  const { setPageIndicator, resetAll } = useNavbar();

  const {} = useQuery(
    AllProductsDocument,
    {
      fetchPolicy: "no-cache",
      variables: {
        paginator: {
          page: 1,
          limit: 10,
        },
        search: {
          storeId: store.id,
          branchId: branch.id,
        },
      },
    }
  );

  useLayoutEffect(() => {
    setPageIndicator(
      <>
        <Image
          alt={store.name}
          src={createCloudinaryUrl(store.logo, 100, 100)}
          width={100}
          height={100}
          quality={100}
          className="flex size-[30px] items-center justify-center rounded-sm bg-white"
        />

        <div className="flex flex-col gap-1">
          <h2 className="font-bold line-clamp-1 break-all flex-1 sm:text-sm text-xs leading-none">
            {store.name}
          </h2>

          <p className="break-all line-clamp-1 text-[10px] leading-none">
            {branch.address.fullAddress}
          </p>
        </div>
      </>
    );

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-0 sm:mt-10">
      
    </div>
  );
}
