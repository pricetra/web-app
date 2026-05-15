import { StorefrontFlyerPageInput } from "graphql-utils";

export type FlyerPageProps = {
  page: StorefrontFlyerPageInput;
  pageNumber: number;
};

// TODO: This should be of size flyer.format, and should fit with that aspect ratio scaled to fit the screen. For example if the format is A4 it should have an aspect ratio of 1:1.41 and should scale to fit the screen while maintaining that aspect ratio.
export default function FlyerPage({ page, pageNumber }: FlyerPageProps) {
  return (
    <div className="my-5 p-4">
      <h2 className="text-xs mb-2">Page {pageNumber}</h2>

      <article className="border border-gray-200 bg-white shadow-sm"></article>
    </div>
  );
}
