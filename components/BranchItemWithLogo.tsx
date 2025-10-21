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
          className="size-[50px] rounded-xl border-[1px] border-gray-200"
          width={500}
          height={500}
          alt={branch.name}
        />
        <div className="flex flex-row pr-[60px] flex-wrap">
          <div className="flex w-full flex-row flex-wrap items-center gap-3">
            <h5 className="text-lg font-bold">{branch.store?.name}</h5>
          </div>

          <div className="w-full">
            <span className="text-xs">{branch.address?.fullAddress}</span>

            {branch.address?.distance && (
              <span className="mt-1 text-xs">
                {metersToMiles(branch.address.distance)} mi
              </span>
            )}
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
        <Skeleton className="size-[40px] rounded-xl" style={{ width: 40 }} />
        <div className="flex flex-row pr-[60px] flex-wrap">
          <div className="flex w-full flex-row flex-wrap items-center gap-3">
            <Skeleton className="h-4 w-24 rounded-md" style={{ width: 96 }} />
          </div>

          <div className="w-full">
            <Skeleton className="h-3 w-40 rounded-md" style={{ width: 160 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
