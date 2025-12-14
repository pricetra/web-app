import dayjs from "dayjs";

import { Stock } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { currencyFormat, getPriceUnitOrEach } from "@/lib/strings";
import { metersToMiles } from "@/lib/utils";
import Image from 'next/image'
import useIsSaleExpired from "@/hooks/useIsSaleExpired";
import useCalculatedPrice from "@/hooks/useCalculatedPrice";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

export type StockFullProps = {
  stock: Stock;
  approximatePrice?: number;
  quantityValue?: number;
  quantityType?: string;
};

export default function StockFull({
  stock,
  approximatePrice,
  quantityValue,
  quantityType,
}: StockFullProps) {
  if (!stock.store || !stock.branch)
    throw new Error("stock has no store or branch objects");

  const isExpired = useIsSaleExpired(stock.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: stock.latestPrice,
  });

  return (
    <div className="flex flex-row justify-between gap-5">
      <div className="flex flex-1 flex-row gap-4">
        <Link href={`/stores/${stock.store.slug}`}>
          <Image
            src={createCloudinaryUrl(stock.store.logo, 500, 500)}
            className="size-[50px] xl:size-[60px] rounded-xl"
            width={100}
            height={100}
            quality={100}
            alt={stock.store.name}
          />
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          {stock.latestPrice?.sale && !isExpired && (
            <div className="w-[35px]">
              <span className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold text-white">
                SALE
              </span>
            </div>
          )}

          <div className="flex w-full flex-row items-center gap-2.5">
            <Link href={`/stores/${stock.store.slug}/${stock.branch.slug}`}>
              <h3 className="flex-1 text-base xl:text-lg font-bold line-clamp-1">
                {stock.store.name}
              </h3>
            </Link>

            {stock.branch.address?.distance && (
              <div className="rounded-full bg-pricetraGreenDark/10 px-2 py-0.5">
                <span className="text-xs text-pricetraGreenHeavyDark">
                  {metersToMiles(stock.branch.address.distance)} mi
                </span>
              </div>
            )}
          </div>

          {stock.branch.address && (
            <div className="w-full">
              <h4 className="text-xs">
                <a href={stock.branch.address.mapsLink} target="_blank">
                  {stock.branch.address.street}, {stock.branch.address.city}
                </a>
              </h4>
            </div>
          )}

          <div className="mt-1 flex flex-col gap-1">
            {stock.latestPrice?.sale &&
              !isExpired &&
              stock.latestPrice?.expiresAt && (
                <p className="bg-yellow-200 text-xs italic">
                  Valid until{" "}
                  <b>{dayjs(stock.latestPrice.expiresAt).format("LL")}</b>
                </p>
              )}

            {!isExpired && stock.latestPrice?.condition && (
              <p className="bg-yellow-200 text-xs italic">
                *{stock.latestPrice.condition}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-fit flex-col items-end gap-0.5 py-3">
        {stock?.latestPrice?.sale &&
          !isExpired &&
          stock.latestPrice.originalPrice && (
            <h6 className="text text-right line-through text-red-700">
              {currencyFormat(stock.latestPrice.originalPrice)}
            </h6>
          )}

        {stock?.latestPrice?.amount && (
          <div className="flex flex-row items-center justify-start gap-1">
            <span className="text-base md:text-lg xl:text-xl font-black">
              {currencyFormat(calculatedAmount)}
            </span>
            <span className="text-xs text-gray-500">
              {getPriceUnitOrEach(stock.latestPrice)}
            </span>
          </div>
        )}

        {stock.latestPrice?.amount && quantityValue && quantityValue > 1 && (
          <span className="text-right text-[10px] text-gray-500">
            {`${currencyFormat(
              calculatedAmount / quantityValue
            )}/${quantityType}`}
          </span>
        )}

        {approximatePrice && (
          <span className="text-xl">
            <span className="text-base md:text-lg xl:text-xl font-black">
              {currencyFormat(approximatePrice)}
            </span>
            *
          </span>
        )}

        {!stock?.latestPrice?.amount && !approximatePrice && (
          <span className="text-xl font-black">--</span>
        )}
      </div>
    </div>
  );
}

export function StockFullLoading() {
  return (
    <div className="flex flex-row justify-between gap-5">
      <div className="flex flex-1 flex-row gap-4">
        <Skeleton style={{width: 60, height: 60, borderRadius: 10}} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          <div className="flex w-full flex-row items-center gap-2.5">
            <Skeleton className="h-[18px] w-[80%]" style={{width: 100, height: 18, borderRadius: 7}} />
          </div>

          <div className="w-full">
            <Skeleton className="h-[12px] w-[80%] rounded-lg" style={{width: '80%', height: 12, borderRadius: 5}} />
          </div>
        </div>
      </div>

      <div className="flex w-fit flex-col items-end gap-0.5 py-3">
        <div className="flex flex-row items-center justify-start gap-1">
          <Skeleton className="h-[20px] w-[40px] rounded-lg" style={{width: 40, height: 20, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}
