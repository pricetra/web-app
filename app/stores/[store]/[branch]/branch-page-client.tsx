"use client";

import { useNavbar } from "@/context/navbar-context";
import {
  AllProductsDocument,
  Branch,
  Product,
  Store,
} from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import ProductItem from "@/components/product-item";
import Link from "next/link";

export default function BranchPageClient({
  store,
  branch,
}: {
  store: Store;
  branch: Branch;
}) {
  const { setPageIndicator, resetAll } = useNavbar();

  const { data: productsData } = useQuery(AllProductsDocument, {
    fetchPolicy: "no-cache",
    variables: {
      paginator: {
        page: 1,
        limit: 50,
      },
      search: {
        storeId: store.id,
        branchId: branch.id,
      },
    },
  });

  useLayoutEffect(() => {
    setPageIndicator(
      <>
        <Link href={`/stores/${store.slug}`} className="block">
          <Image
            alt={store.name}
            src={createCloudinaryUrl(store.logo, 100, 100)}
            width={100}
            height={100}
            quality={100}
            className="flex size-[30px] items-center justify-center rounded-sm bg-white"
          />
        </Link>

        <div className="flex flex-col gap-1">
          <Link href={`/stores/${store.slug}`}>
            <h2 className="font-bold line-clamp-1 break-all flex-1 sm:text-sm text-xs leading-none">
              {store.name}
            </h2>
          </Link>

          <a href={branch.address.mapsLink} className="block">
            <span className="break-all line-clamp-1 text-[10px] leading-none block hover:underline">
              {branch.address.fullAddress}
            </span>
          </a>
        </div>
      </>
    );

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-[1000px] mt-0 sm:mt-10 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-3">
        {productsData?.allProducts?.products?.map((p, i) => (
          <ProductItem product={p as Product} key={`product-${p.id}-${i}`} />
        ))}
      </div>
    </div>
  );
}
