import StockFull, { StockFullLoading, StockFullProps } from "./stock-full";
import Skeleton from "react-loading-skeleton";
import PriceUserAndTimestamp from "./price-user-and-timestamp";

export type SelectedStockProps = StockFullProps;

export default function SelectedStock(props: SelectedStockProps) {
  const { stock } = props;
  if (!stock.store || !stock.branch)
    throw new Error("stock has no store or branch objects");

  return (
    <div className="flex flex-col gap-2">
      <StockFull {...props} />

      {stock.updatedBy && (
        <div className="mt-4">
          <PriceUserAndTimestamp
            user={stock.updatedBy}
            verified={stock.latestPrice?.verified}
            timestamp={stock.latestPrice?.createdAt ?? stock.updatedAt}
          />
        </div>
      )}
    </div>
  );
}

export function SelectedStockLoading() {
  return (
    <div className="flex flex-col gap-2">
      <StockFullLoading />

      <div className="mt-4">
        <Skeleton className="h-[30px] w-[30%] rounded-full" style={{width: '30%', height: 30, borderRadius: 30}}  />
      </div>
    </div>
  );
}
