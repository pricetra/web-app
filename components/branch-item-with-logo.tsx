import { Branch } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { metersToMiles } from '@/lib/utils';
import Image from "next/image"
import Link from "next/link";
import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { FiChevronRight } from "react-icons/fi";

export type BranchItemWithLogoProps = {
  branch: Branch;
  hideStoreLogo?: boolean;
  branchName?: boolean;
  cityName?: boolean;
};

export default function BranchItemWithLogo({
  branch,
  hideStoreLogo = false,
  branchName = false,
  cityName = false,
}: BranchItemWithLogoProps) {
  const name = useMemo(() => {
    if (branchName) return branch.name;
    if (cityName && branch.address) return branch.address.city;
    return branch.store?.name ?? branch.name;
  }, [branch, cityName, branchName]);

  return (
    <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-1 flex-row gap-4">
        {!hideStoreLogo && (
          <Link
            href={`/stores/${branch.storeSlug}`}
            className="block min-w-[40px] sm:min-w-[50px]"
          >
            <Image
              src={createCloudinaryUrl(branch.store?.logo ?? "", 500, 500)}
              className="size-[40px] sm:size-[50px] rounded-lg border-[1px] border-gray-200"
              width={500}
              height={500}
              alt={branch.name}
            />
          </Link>
        )}
        <div className="flex flex-col flex-1">
          <Link
            href={`/stores/${branch.storeSlug}/${branch.slug}`}
            className="flex w-full flex-row flex-nowrap items-center gap-x-3"
          >
            <h5 className="text-sm xs:text-base sm:text-lg font-bold line-clamp-1 break-all">
              {name}
            </h5>

            {branch.address?.distance && (
              <div className="rounded-full bg-pricetraGreenDark/10 px-2 py-0.5">
                <div className="text-[10px] color-pricetraGreenHeavyDark text-nowrap">
                  {metersToMiles(branch.address.distance)} mi
                </div>
              </div>
            )}
          </Link>

          {branch.address && (
            <a
              href={branch.address.mapsLink}
              target="_blank"
              className="text-[10px] sm:text-xs w-full line-clamp-1 break-all hover:underline"
            >
              <span>{branch.address.fullAddress}</span>
            </a>
          )}
        </div>
      </div>

      <Link href={`/stores/${branch.storeSlug}/${branch.slug}`} className="p-2">
        <FiChevronRight className="size-[20px]" />
      </Link>
    </div>
  );
}

export function BranchItemWithLogoLoading({
  hideStoreLogo = false,
}: {
  hideStoreLogo?: boolean;
}) {
  return (
    <div className="flex flex-row justify-between gap-5">
      <div className="flex flex-1 flex-row gap-4">
        {!hideStoreLogo && (
          <Skeleton
            className="size-[40px] rounded-xl"
            style={{ width: 40, borderRadius: 7 }}
          />
        )}
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
