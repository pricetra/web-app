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
    <div className="flex flex-row items-center gap-2 justify-start">
      <Link href={href} className="block min-w-[35px]">
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
      </Link>

      <div className="flex flex-col w-full max-w-[200px] flex-1">
        <Link href={href}>
          <h2
            className={cn(
              "font-bold break-all sm:text-sm text-xs",
              subTitle ? "line-clamp-1" : "line-clamp-2"
            )}
          >
            {title}
          </h2>
        </Link>

        {subTitle && (
          <a
            href={subTitleHref}
            target={subTitleHrefTargetBlank ? "_blank" : undefined}
            className={cn(
              "line-clamp-1 break-all text-[10px]",
              subTitleHref ? "hover:underline" : ""
            )}
          >
            {subTitle}
          </a>
        )}
      </div>
    </div>
  );
}
