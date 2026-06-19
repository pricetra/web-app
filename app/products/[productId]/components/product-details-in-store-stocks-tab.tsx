import LocationDialogButton from "@/components/location-dialog-button";
import StockItemMini, {
  StockItemMiniLoading,
} from "@/components/stock-item-mini";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LocationInputWithFullAddress } from "@/context/location-context";
import { useQuery } from "@apollo/client/react";
import {
  BranchType,
  GetProductStocksDocument,
  Product,
  Stock,
} from "graphql-utils";
import Link from "next/link";
import { useEffect } from "react";

export type ProductDetailsInStoreStocksTabProps = {
  product: Product;
  locationInput: LocationInputWithFullAddress;
  productUrlPath: string;
  onDataLoaded: (tabName: string) => void;
};

const TAB_NAME = "available-in-stores"

export default function ProductDetailsInStoreStocksTab({
  product,
  locationInput,
  productUrlPath,
  onDataLoaded,
}: ProductDetailsInStoreStocksTabProps) {
  const { data: inStoreStocksData } = useQuery(GetProductStocksDocument, {
    variables: {
      paginator: {
        page: 1,
        limit: 10,
      },
      productId: product.id,
      location: { ...locationInput.locationInput },
      branchType: BranchType.Physical,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!inStoreStocksData) return;
    if (inStoreStocksData.getProductStocks.paginator.total == 0) return;

    onDataLoaded(TAB_NAME)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inStoreStocksData]);

  return (
    <AccordionItem value={TAB_NAME}>
      <AccordionTrigger
        badge={inStoreStocksData?.getProductStocks?.paginator?.total ?? 0}
      >
        Available in Stores
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-row gap-5 items-center justify-end mb-10">
          <LocationDialogButton size="sm" />
        </div>

        {inStoreStocksData ? (
          <>
            {inStoreStocksData.getProductStocks.paginator.total > 0 ? (
              <>
                <section className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
                  {inStoreStocksData.getProductStocks.stocks.map((s, i) => (
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

                {inStoreStocksData.getProductStocks.paginator.numPages > 1 && (
                  <div className="flex flex-row items-center justify-center mt-7 mb-10">
                    <Link
                      href={`${productUrlPath}/stocks?branchType=${BranchType.Physical}`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-black flex flex-row items-center justify-center gap-2 px-5 py-2 rounded-full font-bold"
                    >
                      Show All
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="py-10 px-5 text-center">
                No in-store stocks available for this product
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
