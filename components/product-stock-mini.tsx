import { Stock } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { metersToMiles, startOfNextSundayUTC } from "@/lib/utils";
import Image from "next/image";

export type ProductStockMiniProps = {
  stock: Stock;
};

export default function ProductStockMini({ stock }: ProductStockMiniProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image
        src={createCloudinaryUrl(
          stock.store?.logo ?? "",
          100,
          100,
          startOfNextSundayUTC(),
        )}
        className="size-[25px] rounded-md"
        width={100}
        height={100}
        alt={stock.store?.name ?? ""}
      />
      <div className="flex w-full flex-col pr-5">
        <h6 className="text-xs font-semibold line-clamp-1 break-all">
          {stock.store?.name}
        </h6>
        {stock.branch?.address && (
          <div className="flex flex-row flex-wrap items-center gap-1">
            <p className="max-w-[70%] text-[9px] line-clamp-1 break-all">
              {stock.branch.address?.city}
            </p>
            {stock.branch.address.distance && (
              <>
                <span>●</span>

                <span className="text-[9px]">
                  {metersToMiles(stock.branch.address.distance)} mi
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
