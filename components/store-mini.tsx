import { Store } from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

import { FiArrowRight } from "react-icons/fi";

export type StoreMiniProps = {
  store: Store;
};

export default function StoreMini({
  store: { id, name, logo },
}: StoreMiniProps) {
  return (
    <a
      href={`/stores/${id}`}
      className="flex flex-col items-center justify-center gap-3"
    >
      <Image
        src={createCloudinaryUrl(logo, 300, 300)}
        className="size-10 md:size-14 lg:size-16 rounded-lg md:rounded-xl border-[1px] border-gray-200"
        alt={name}
        width={300}
        height={300}
      />
      <h3 className="text-sm max-w-14 sm:max-w-20 truncate">{name}</h3>
    </a>
  );
}

export function StoreMiniShowMore() {
  return (
    <div className="flex flex-row items-center justify-center">
      <a
        href="/stores"
        className="flex flex-col items-center justify-center gap-1 rounded-lg border-[1px] border-gray-200 bg-gray-50 px-1 py-2 max-w-[80px] w-[80px] h-full"
      >
        <FiArrowRight size={20} color="#374151" className="mt-1" />

        <h3 className="text-xs color-gray-700 text-center">See All</h3>
      </a>
    </div>
  );
}

export function StoreMiniLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Skeleton
        className="size-10 md:size-14 lg:size-16 rounded-lg md:rounded-xl"
        style={{ width: 64, borderRadius: 10 }}
      />
      <Skeleton
        className="h-4 max-w-14 sm:max-w-20 rounded-md"
        style={{ width: 64, borderRadius: 5 }}
      />
    </div>
  );
}
