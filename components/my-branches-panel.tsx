import useStoreUserBranches from "@/hooks/useStoreUser";
import ScrollContainer from "./scroll-container";
import Link from "@/components/ui/link";
import { Branch } from "graphql-utils";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { startOfNextSundayUTC } from "@/lib/utils";

export default function MyBranchPanel() {
  const myStoreUserBranches = useStoreUserBranches();

  if (!myStoreUserBranches || myStoreUserBranches.length === 0) return <></>;

  return (
    <div className="mb-10">
      <div className="mb-3 px-5">
        <h3 className="text-lg font-bold">Manage My Stores</h3>
      </div>
      <ScrollContainer>
        {myStoreUserBranches.map((branch) => (
          <MyBranchPanelItem branch={branch} key={`mystoreuser-${branch.id}`} />
        ))}
      </ScrollContainer>
    </div>
  );
}

type MyBranchPanelItemProps = {
  branch: Branch;
};

function MyBranchPanelItem({ branch }: MyBranchPanelItemProps) {
  return (
    <Link
      href={`/stores/${branch.store?.slug}/${branch.slug}`}
      className="min-h-28 w-62 sm:w-xs rounded-xl bg-gray-100 p-5 block"
    >
      <div className="flex flex-1 flex-row gap-4">
        <Image
          src={createCloudinaryUrl(
            branch.store?.logo ?? "",
            500,
            500,
            startOfNextSundayUTC(),
          )}
          className="size-[40px] rounded-xl"
          width={100}
          height={100}
          alt={branch.name}
        />
        <div className="flex flex-row flex-wrap gap-1 flex- w-full">
          <div className="flex w-full flex-row flex-wrap items-center gap-3">
            <h4 className="text-sm sm:text-base font-bold line-clamp-2 break-all sm:break-normal">
              {branch.name}
            </h4>
          </div>

          <div className="w-full">
            <p className="text-[10px] sm:text-xs line-clamp-1">
              {branch.address?.fullAddress}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
