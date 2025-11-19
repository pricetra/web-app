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
import { useQuery } from "@apollo/client/react";
import ProductItem from "@/components/product-item";
import NavPageIndicator from "@/components/ui/nav-page-indicator";

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
      <NavPageIndicator
        title={store.name}
        href={`/stores/${store.slug}`}
        imgSrc={createCloudinaryUrl(store.logo, 100, 100)}
        subTitle={branch.address.fullAddress}
        subTitleHref={branch.address.mapsLink}
      />
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
