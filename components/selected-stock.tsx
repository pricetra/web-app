import StockFull, { StockFullLoading, StockFullProps } from "./stock-full";
import Skeleton from "react-loading-skeleton";
import PriceUserAndTimestamp from "./price-user-and-timestamp";
import { Button } from "./ui/button";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

export type SelectedStockProps = StockFullProps;

export default function SelectedStock(props: SelectedStockProps) {
  const { stock } = props;
  if (!stock.store || !stock.branch)
    throw new Error("stock has no store or branch objects");

  return (
    <div className="flex flex-col gap-2">
      <StockFull {...props} />

      <div className="flex flex-row flex-wrap gap-3 mt-4">
        {stock.updatedBy && (
          <div className="flex-2">
            <PriceUserAndTimestamp
              user={stock.updatedBy}
              verified={stock.latestPrice?.verified}
              timestamp={stock.latestPrice?.createdAt ?? stock.updatedAt}
            />
          </div>
        )}

        {stock.onlineItem && (
          <div className="flex-1 flex flex-row justify-end">
            <Button href={stock.onlineItem.url} target="_blank" variant="pricetra" size="xs">View Online <FaArrowUpRightFromSquare className="size-2.5" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SelectedStockLoading() {
  return (
    <div className="flex flex-col gap-2">
      <StockFullLoading />

      <div className="mt-4">
        <Skeleton
          className="h-[30px] w-[30%] rounded-full"
          style={{ width: "30%", height: 30, borderRadius: 30 }}
        />
      </div>
    </div>
  );
}
