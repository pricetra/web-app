import { Branch } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { metersToMiles } from '@/lib/utils';
import Image from "next/image"
import Skeleton from "react-loading-skeleton";

export type BranchItemWithLogoProps = {
  branch: Branch;
};

export default function BranchItemWithLogo({
  branch,
}: BranchItemWithLogoProps) {
  return (
    <div className="flex flex-row justify-between gap-5">
      <div className="flex flex-1 flex-row gap-4">
        <Image
          src={createCloudinaryUrl(branch.store?.logo ?? "", 500, 500)}
          className="size-[40px] sm:size-[50px] rounded-lg border-[1px] border-gray-200"
          width={500}
          height={500}
          alt={branch.name}
        />
        <div className="flex flex-col pr-[60px]">
          <div className="flex w-full flex-row flex-nowrap items-center gap-x-3">
            <h5 className="sm:text-lg font-bold line-clamp-1 break-all">
              {branch.store?.name}
            </h5>

            {branch.address?.distance && (
              <div className="rounded-full bg-pricetraGreenDark/10 px-2 py-0.5">
                <div className="text-[10px] color-pricetraGreenHeavyDark text-nowrap">
                  {metersToMiles(branch.address.distance)} mi
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] sm:text-xs w-full line-clamp-1 break-all">
            <span>{branch.address?.fullAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BranchItemWithLogoLoading() {
  return (
    <div className="flex flex-row justify-between gap-5">
      <div className="flex flex-1 flex-row gap-4">
        <Skeleton
          className="size-[40px] rounded-xl"
          style={{ width: 40, borderRadius: 7 }}
        />
        <div className="flex flex-row pr-[60px] flex-wrap">
          <div className="flex w-full flex-row flex-wrap items-center gap-3">
            <Skeleton
              className="h-4 w-24 rounded-md"
              style={{ width: 96, borderRadius: 5 }}
            />
          </div>

          <div className="w-full">
            <Skeleton
              className="h-3 w-40 rounded-md"
              style={{ width: 160, borderRadius: 5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
