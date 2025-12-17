import dayjs from "dayjs";
import { Stock } from "graphql-utils";
import useCalculatedPrice from "@/hooks/useCalculatedPrice";
import useIsSaleExpired from "@/hooks/useIsSaleExpired";
import { createCloudinaryUrl } from "@/lib/files";
import { currencyFormat, getPriceUnitOrEach } from "@/lib/strings";
import { metersToMiles } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";

export type StockItemMiniProps = {
  stock: Stock;
  approximatePrice?: number;
  quantityValue?: number;
  quantityType?: string;
};

export default function StockItemMini({
  stock,
  approximatePrice,
  quantityValue,
  quantityType,
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
        className="flex gap-2 flex-row"
      >
        <Image
          src={createCloudinaryUrl(stock.store.logo, 100, 100)}
          className="size-[30px] sm:size-[40px] rounded-lg border border-gray-100"
          width={100}
          height={100}
          alt={`${stock.store.name} store logo`}
        />

        <div className="flex flex-col gap-1 flex-1">
          {(stock.branch.address?.distance || sale) && (
            <div className="flex flex-row items-center gap-1 sm:gap-2">
              {sale && (
                <div className="mb-1 rounded-full bg-red-700 px-1.5 py-2 sm:px-2 sm:py-2.5">
                  <span className="text-[8px] sm:text-[10px] text-white leading-0 block font-bold">
                    SALE
                  </span>
                </div>
              )}

              {stock.branch.address?.distance && (
                <div className="mb-1 rounded-full bg-pricetraGreenDark/10 px-1.5 py-2 sm:px-2 sm:py-2.5">
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

          <p className="text-[9px] sm:text-[12px] line-clamp-2 break-all">
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

export function StockItemMiniLoading() {
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });
  const size = isMobile ? 30 : 40;

  return (
    <div className="flex flex-row gap-2">
      <Skeleton style={{ width: size, height: size }} borderRadius={10} />

      <div className="flex flex-col gap-1 flex-1">
        <div className="flex flex-col gap-1 sm:gap-2">
          <Skeleton width={90} height={15} borderRadius={8} />
        </div>

        <Skeleton width={60} height={18} borderRadius={8} />
      </div>
    </div>
  );
}
