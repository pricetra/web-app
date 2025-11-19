import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { IconType } from "react-icons/lib";

export type NavPageIndicatorProps = {
  href?: string;
  title: string;
  icon?: IconType;
  imgSrc?: string;
  subTitle?: string;
  subTitleHref?: string;
  subTitleHrefTargetBlank?: boolean;
};

export default function NavPageIndicator({
  href = "",
  title,
  icon: Icon,
  imgSrc,
  subTitle,
  subTitleHref,
  subTitleHrefTargetBlank = false,
}: NavPageIndicatorProps) {
  return (
    <Link
      href={href}
      className="flex flex-row items-center gap-2 justify-start"
    >
      <div className="block min-w-[35px]">
        {imgSrc && (
          <Image
            alt={title}
            src={imgSrc}
            width={200}
            height={200}
            quality={100}
            className="flex size-[35px] items-center justify-center rounded-md bg-white"
          />
        )}

        {Icon && (
          <div className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10 text-pricetra-green-heavy-dark">
            <Icon size={20} color="#396a12" />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full max-w-[200px]">
        <h2 className="font-bold line-clamp-1 break-all flex-1 sm:text-sm text-xs">
          {title}
        </h2>

        {subTitle && (
          <a
            href={subTitleHref}
            target={subTitleHrefTargetBlank ? "_blank" : undefined}
            className={cn("", subTitleHref ? "hover:underline" : "")}
          >
            <span className="line-clamp-1 break-all text-[10px] block">
              {subTitle}
            </span>
          </a>
        )}
      </div>
    </Link>
  );
}
