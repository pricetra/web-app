import { Branch } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { metersToMiles } from '@/lib/utils';
import Image from "next/image"

export type BranchItemWithLogoProps = {
  branch: Branch;
};

export default function BranchItemWithLogo({ branch }: BranchItemWithLogoProps) {
  return (
    <div className="flex flex-row justify-between gap-5">
      <div className="flex flex-1 flex-row gap-4">
        <Image
          src={createCloudinaryUrl(branch.store?.logo ?? '', 500, 500)}
          className="size-[50px] rounded-xl"
          width={500}
          height={500}
          alt={branch.name}
        />
        <div className='flex flex-row pr-[60px] flex-wrap'>
          <div className="flex w-full flex-row flex-wrap items-center gap-3">
            <h5 className="text-lg font-bold">{branch.store?.name}</h5>
          </div>

          <div className="w-full">
            <span className="text-xs">{branch.address?.fullAddress}</span>

            {branch.address?.distance && (
              <span className="mt-1 text-xs">{metersToMiles(branch.address.distance)} mi</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
