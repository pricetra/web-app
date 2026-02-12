import NextLink, { LinkProps } from "next/link";
import NProgress from "nprogress";
import { AnchorHTMLAttributes, ReactNode } from "react";

export type CustomLinkType = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps & {
    children?: ReactNode | undefined;
  };

export default function Link({ onClick, ...props }: CustomLinkType) {
  return (
    <NextLink
      onClick={(e) => {
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }

        NProgress.start();
        if (onClick) onClick(e);
      }}
      {...props}
    />
  );
}
