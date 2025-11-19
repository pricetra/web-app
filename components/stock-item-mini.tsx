import dayjs from "dayjs";
import { Stock } from "@/graphql/types/graphql";
import useCalculatedPrice from "@/hooks/useCalculatedPrice";
import useIsSaleExpired from "@/hooks/useIsSaleExpired";
import { createCloudinaryUrl } from "@/lib/files";
import { currencyFormat, getPriceUnitOrEach } from "@/lib/strings";
import { cn, metersToMiles } from "@/lib/utils";
import Image from 'next/image'
import { useMemo } from "react";
import Link from "next/link";

export type StockItemMiniProps = {
  stock: Stock;
  approximatePrice?: number;
  quantityValue?: number;
  quantityType?: string;
  stackLogo?: boolean;
};

export default function StockItemMini({
  stock,
  approximatePrice,
  quantityValue,
  quantityType,
  stackLogo = false,
}: StockItemMiniProps) {
  if (!stock.store || !stock.branch)
    throw new Error("stock has no store or branch objects");

  const isExpired = useIsSaleExpired(stock.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: stock.latestPrice,
  });
  const sale = useMemo(
    () => stock.latestPrice?.sale && !isExpired,
    [isExpired, stock]
  );

  return (
    <div className="flex flex-col gap-2">
      <Link
        href={stock.id !== 0 ? `?stockId=${stock.id}` : "#"}
        className={cn("flex gap-2", stackLogo ? "flex-col" : "flex-row")}
      >
        <Image
          src={createCloudinaryUrl(stock.store.logo, 100, 100)}
          className="size-[30px] sm:size-[40px] rounded-lg border-[1px] border-gray-100"
          width={100}
          height={100}
          alt={`${stock.store.name} store logo`}
        />

        <div className={cn("flex flex-col gap-1", stackLogo ? "" : "flex-1")}>
          {(stock.branch.address?.distance || sale) && (
            <div className="flex flex-row items-center gap-1 sm:gap-2">
              {sale && (
                <div className="mb-1 rounded-full bg-red-700 p-2 sm:p-2.5">
                  <span className="text-[8px] sm:text-[10px] text-white leading-0 block font-bold">
                    SALE
                  </span>
                </div>
              )}

              {stock.branch.address?.distance && (
                <div className="mb-1 rounded-full bg-pricetraGreenDark/10 p-2 sm:p-2.5">
                  <span className="text-[8px] sm:text-[10px] text-pricetraGreenHeavyDark leading-0 block">
                    {metersToMiles(stock.branch.address.distance)} mi
                  </span>
                </div>
              )}
            </div>
          )}

          <h5 className="text-[13px] sm:text-sm line-clamp-2">
            {stock.store.name}
          </h5>

          <p className="text-[9px] sm:text-[12px] line-clamp-2">
            {stock.branch.address?.street}, {stock.branch.address?.city}
          </p>

          <div className="mt-1 flex flex-col gap-0.5">
            {stock?.latestPrice?.sale &&
              !isExpired &&
              stock.latestPrice.originalPrice && (
                <span className="text-xs line-through text-red-700">
                  {currencyFormat(stock.latestPrice.originalPrice)}
                </span>
              )}

            {stock?.latestPrice?.amount && (
              <div className="flex flex-row items-center justify-start gap-1">
                <span className="font-black">
                  {currencyFormat(calculatedAmount)}
                </span>
                <span className="text-xs text-gray-500">
                  {getPriceUnitOrEach(stock.latestPrice)}
                </span>
              </div>
            )}

            {stock.latestPrice?.amount &&
              quantityValue &&
              quantityValue > 1 && (
                <span className="text-[10px] text-gray-500">
                  {`${currencyFormat(
                    calculatedAmount / quantityValue
                  )}/${quantityType}`}
                </span>
              )}

            {approximatePrice && (
              <span className="">
                <span className=" font-black">
                  {currencyFormat(approximatePrice)}
                </span>
                *
              </span>
            )}

            {!stock?.latestPrice?.amount && !approximatePrice && (
              <span className="text-lg font-black">--</span>
            )}
          </div>
        </div>
      </Link>

      {stock.latestPrice?.sale && !isExpired && (
        <div className="flex flex-col gap-1">
          {stock.latestPrice?.expiresAt && (
            <span>
              <span className="bg-yellow-200 text-[9px] italic">
                Valid until{" "}
                <span className="font-bold">
                  {dayjs(stock.latestPrice.expiresAt).format("LL")}
                </span>
              </span>
            </span>
          )}

          {stock.latestPrice?.condition && (
            <span>
              <span className="bg-yellow-200 text-[9px] italic">
                *{stock.latestPrice.condition}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
