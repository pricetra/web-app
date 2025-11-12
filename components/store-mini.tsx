import { Store } from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export type StoreMiniProps = {
  store: Store;
};

export default function StoreMini({
  store: { id, name, logo },
}: StoreMiniProps) {
  return (
    <Link
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
      <h3 className="text-xs md:text-sm max-w-14 sm:max-w-20 truncate">
        {name}
      </h3>
    </Link>
  );
}

export function StoreMiniShowMore() {
  return (
    <Link
      href="/stores"
      className="flex flex-col items-center justify-center gap-3"
    >
      <div className="size-10 md:size-14 lg:size-16 rounded-lg md:rounded-xl border-[1px] border-gray-200 bg-gray-50 flex items-center justify-center">
        <FiArrowRight className="size-[20px] md:size-[27px]" color="#374151" />
      </div>
      <h3 className="text-xs md:text-sm max-w-14 sm:max-w-20 text-center leading-5 truncate-1">
        All Stores
      </h3>
    </Link>
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
