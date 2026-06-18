import StockItemMini, {
  StockItemMiniLoading,
} from "@/components/stock-item-mini";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@apollo/client/react";
import {
  BranchType,
  GetProductStocksDocument,
  Product,
  Stock,
} from "graphql-utils";
import Link from "next/link";
import { useEffect } from "react";

export type ProductDetailsOnlineStocksTabProps = {
  product: Product;
  productUrlPath: string;
  onDataLoaded: (tabName: string) => void;
};

const TAB_NAME = "available-online";

export default function ProductDetailsOnlineStocksTab({
  product,
  productUrlPath,
  onDataLoaded,
}: ProductDetailsOnlineStocksTabProps) {
  const { data: onlineStocksData } = useQuery(GetProductStocksDocument, {
    variables: {
      paginator: {
        page: 1,
        limit: 10,
      },
      productId: product.id,
      branchType: BranchType.Online,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!onlineStocksData) return;
    if (onlineStocksData.getProductStocks.paginator.total === 0) return;
    
    onDataLoaded(TAB_NAME);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineStocksData]);

  return (
    <AccordionItem value={TAB_NAME}>
      <AccordionTrigger
        badge={onlineStocksData?.getProductStocks?.paginator?.total ?? 0}
      >
        Available Online
      </AccordionTrigger>
      <AccordionContent>
        {onlineStocksData ? (
          <>
            {onlineStocksData.getProductStocks.paginator.total > 0 ? (
              <>
                <section className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
                  {onlineStocksData.getProductStocks.stocks.map((s, i) => (
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

                {onlineStocksData.getProductStocks.paginator.numPages > 1 && (
                  <div className="flex flex-row items-center justify-center mt-7 mb-10">
                    <Link
                      href={`${productUrlPath}/stocks?branchType=${BranchType.Online}`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-black flex flex-row items-center justify-center gap-2 px-5 py-2 rounded-full font-bold"
                    >
                      Show All
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="py-10 px-5 text-center">
                No online stocks available for this product
              </p>
            )}
          </>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div className="mb-3" key={`available-stock-loading-${i}`}>
                  <StockItemMiniLoading />
                </div>
              ))}
          </section>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
