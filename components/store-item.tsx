import Link from "next/link";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { Branch, Store } from "graphql-utils";

export default function StoreItem({
  store,
  branch,
}: {
  store: Store;
  branch?: Branch | null;
}) {
  const img = store.logo
    ? createCloudinaryUrl(store.logo, 64, 64)
    : "/placeholder-store.png";

  const href = branch ? `/stores/${store.slug}/${branch.slug}` : `/stores/${store.name}`;

  return (
    <div className="flex items-center gap-3">
      <Image
        src={img}
        alt={store.name}
        width={48}
        height={48}
        className="rounded-md object-cover"
      />
      <div>
        <div className="font-medium text-sm">
          <Link href={href}>{store.name}</Link>
        </div>
        {branch && (
          <div className="text-xs text-gray-600">{branch.name}</div>
        )}
      </div>
    </div>
  );
}
