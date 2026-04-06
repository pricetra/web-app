import { StorefrontBannerItem as StorefrontBannerItemType } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "@/components/ui/link";

export default function StorefrontBannerItem({
  item,
}: {
  item: StorefrontBannerItemType;
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
