import { Store } from "@/graphql/types/graphql";
import { createCloudinaryUrl } from "@/lib/files";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

export type StoreMiniProps = {
  store: Store;
};

export default function StoreMini({
  store: { id, name, logo },
}: StoreMiniProps) {
  return (
    <a href={`/stores/${id}`} className="flex flex-col items-center justify-center gap-3">
      <Image
        src={createCloudinaryUrl(logo, 300, 300)}
        className="size-16 rounded-lg border-[1px] border-gray-200"
        alt={name}
        width={300}
        height={300}
      />
      <h3 className="text-sm max-w-20 truncate">{name}</h3>
    </a>
  );
}

export function StoreMiniShowMore() {
  return (
    <a
      href="/stores"
      className="flex flex-col items-center gap-1 rounded-xl border-[1px] border-gray-200 bg-gray-50 px-2 py-3"
    >
      <div className="size-[20px]" />

      <h3 className="text-xs color-gray-700">See All</h3>
    </a>
  );
}

export function StoreMiniLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Skeleton className="size-16 rounded-lg" style={{ width: 64 }} />
      <Skeleton className="h-4 w-20 rounded-md" style={{ width: 64 }} />
    </div>
  );
}
