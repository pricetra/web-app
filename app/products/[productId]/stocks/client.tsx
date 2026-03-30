"use client";

import ProductItem from "@/components/product-item";
import StockItemMini, { StockItemMiniLoading } from "@/components/stock-item-mini";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useNavbar } from "@/context/navbar-context";
import useLocationInput from "@/hooks/useLocationInput";
import { useQuery } from "@apollo/client/react";
import { BranchType, GetProductStocksDocument, Product, Stock } from "graphql-utils";
import { useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { MdOutlineListAlt } from "react-icons/md";

export type ProductSocksPageClientProps = {
  ipAddress: string;
  product: Product;
  page: number;
};

export default function ProductSocksPageClient({
  product,
  ipAddress,
  page,
}: ProductSocksPageClientProps) {
  const { setPageIndicator, resetAll } = useNavbar();
  const locationInput = useLocationInput(ipAddress);
  const searchParams = useSearchParams();
  const physicalBranchType = BranchType.Physical.toString();
  const branchType = searchParams.get("branchType") ?? physicalBranchType;
  const { data: stocksData } = useQuery(GetProductStocksDocument, {
    variables: {
      paginator: {
        page,
        limit: 50,
      },
      productId: product.id,
      location: branchType === physicalBranchType ? locationInput?.locationInput : undefined,
      branchType: branchType.toUpperCase() as BranchType,
    },
    fetchPolicy: "no-cache",
  });

  useLayoutEffect(() => {
    setPageIndicator(<NavPageIndicator title="Stocks" icon={MdOutlineListAlt} />)

    return () => {
      resetAll();
    }
  }, []);

  return (
    <>
      <div className="w-full max-w-[1000px] mt-5 px-5 flex-1">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-10">
          <ProductItem product={product} />
        </div>

        <div>
          {stocksData ? (
            <>
              {stocksData.getProductStocks.paginator.total !== 0 ? (
                <section className="grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
                  {stocksData.getProductStocks.stocks.map((s, i) => (
                    <div
                      className="mb-3 flex flex-row"
                      key={`${s.id}-${i}-available-stock`}
                    >
                      <StockItemMini
                        productId={product.id}
                        product={product}
                        stock={s as Stock}
                      />
                    </div>
                  ))}
                </section>
              ) : (
                <p className="py-10 px-5 text-center">
                  No available stocks for this product
                </p>
              )}
            </>
          ) : (
            <section className="grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div className="mb-3" key={`available-stock-loading-${i}`}>
                    <StockItemMiniLoading />
                  </div>
                ))}
            </section>
          )}

          {stocksData?.getProductStocks?.paginator && stocksData.getProductStocks.paginator.numPages > 1 && (
            <SmartPagination paginator={stocksData.getProductStocks.paginator} />
          )}
        </div>
      </div>

      <div />
    </>
  );
}
