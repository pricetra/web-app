import { StorefrontBannerItem as StorefrontBannerItemType } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "@/components/ui/link";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function StorefrontBannerItem({
  item,
  isStoreUser,
  onEdit,
  onDelete,
}: {
  item: StorefrontBannerItemType;
  isStoreUser?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const imgUrl = createCloudinaryUrl(item.imageId, 1000, 400);

  const content = (
    <div className="relative w-full aspect-5/2 rounded-xl overflow-hidden">
      <Image
        src={imgUrl}
        alt={item.title ?? ""}
        fill
        className="object-cover"
        sizes="(max-width: 1000px) 100vw, 1000px"
      />
      {(item.title || item.description) && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
          {item.title && (
            <h3 className="text-white font-semibold text-lg">{item.title}</h3>
          )}
          {item.description && (
            <p className="text-white/80 text-sm line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      )}
      {isStoreUser && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <FiEdit2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-2 rounded-full bg-black/50 hover:bg-red-600 text-white transition-colors"
          >
            <FiTrash2 className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <CarouselItem>
      {item.link ? (
        <Link
          href={item.link}
          target={item.isExternal ? "_blank" : undefined}
          rel={item.isExternal ? "noopener noreferrer" : undefined}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </CarouselItem>
  );
}
