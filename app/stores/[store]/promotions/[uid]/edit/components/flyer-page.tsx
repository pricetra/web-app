import {
  StorefrontFlyerPageInput,
  StorefrontFlyer,
} from "graphql-utils";
import { useMemo } from "react";

export type FlyerPageProps = {
  flyer: StorefrontFlyer;
  page: StorefrontFlyerPageInput;
  pageNumber: number;
};

export default function FlyerPage({ flyer, page, pageNumber }: FlyerPageProps) {
  const flyerStyles = useMemo(() => {
    return JSON.parse(flyer.flyerStyles || "{}");
  }, [flyer.flyerStyles]);

  return (
    <div className="my-5 p-4">
      <h2 className="text-xs mb-2">Page {pageNumber}</h2>

      {/* TODO: This should be of size flyerStyles.format, and should fit with that aspect ratio scaled to fit the screen. For example if the format is A4 it should have an aspect ratio of 1:1.41 and should scale to fit the screen while maintaining that aspect ratio. */}
      <article className="border border-gray-200 bg-white shadow-sm">
        {/* This represents the inside of the flyer page. It will hold the sections, and products. */}
      </article>
    </div>
  );
}
