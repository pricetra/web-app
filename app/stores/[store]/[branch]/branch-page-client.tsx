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
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useSearchParams } from "next/navigation";

export default function BranchPageClient({
  store,
  branch,
}: {
  store: Store;
  branch: Branch;
}) {
  const searchParams = useSearchParams();
  const pageString = searchParams.get("page");
  const { setPageIndicator, resetAll } = useNavbar();

  const { data: productsData } = useQuery(AllProductsDocument, {
    fetchPolicy: "no-cache",
    variables: {
      paginator: {
        page: +(pageString ?? 1),
        limit: 30,
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
        subTitleHrefTargetBlank
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

      {productsData?.allProducts?.paginator && (
        <div className="mt-20">
          <SmartPagination paginator={productsData?.allProducts?.paginator} />
        </div>
      )}
    </div>
  );
}
