"use client";

import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { createCloudinaryUrl } from "@/lib/files";
import {
  StorefrontFlyer,
  StorefrontFlyerDocument,
  StorefrontFlyerPageInput,
} from "graphql-utils";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import FlyerPage from "./components/flyer-page";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useLazyQuery } from "@apollo/client/react";
import { CgSpinner } from "react-icons/cg";

export type FlyerEditorClientProps = {
  flyer: StorefrontFlyer;
};

export default function FlyerEditorClient({ flyer }: FlyerEditorClientProps) {
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
    navbarHeight,
  } = useNavbar();
  const [
    getStorefrontFlyerWithPages,
    { data: flyerWithPagesData, loading: flyerWithPagesLoading },
  ] = useLazyQuery(StorefrontFlyerDocument);
  const [pagesInput, setPagesInput] = useState<StorefrontFlyerPageInput[]>([]);
  const minHeight = useMemo(
    () => ({
      minHeight: `calc(100vh - ${navbarHeight}px)`,
    }),
    [navbarHeight],
  );

  useLayoutEffect(() => {
    if (!flyer.store) return;

    const storeHref = `/stores/${flyer.store.slug}${flyer.branch ? `/${flyer.branch.slug}` : ""}`;
    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title="Flyer Editor"
        subTitle={flyer.branch?.name ?? flyer.store.name}
        imgSrc={createCloudinaryUrl(flyer.store.logo, 100, 100)}
        href={storeHref}
        titleHref=""
        subTitleHref={storeHref}
      />,
    );
    setSearchPlaceholder(`Search ${flyer.store.name}`);
    setSearchQueryPath(`/stores/${flyer.store.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyer]);

  useEffect(() => {
    getStorefrontFlyerWithPages({
      variables: {
        uid: flyer.uid,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!flyerWithPagesData) return;

    const pages = flyerWithPagesData.storefrontFlyer.pages;
    const pagesInput = pages.map(
      (p) =>
        ({
          bgImage: p.bgImageId, // TODO: add cloudinary URL
          description: p.description,
          heroImage: p.heroImageId, // TODO: add cloudinary URL
          layout: p.layout,
          pageImage: p.pageImageId, // TODO: add cloudinary URL
          sections: p.sections,
          storefrontFlyerId: p.storefrontFlyerId,
          styles: p.styles,
          title: p.title,
        }) as StorefrontFlyerPageInput,
    );
    setPagesInput([...pagesInput]);
  }, [flyerWithPagesData]);

  return (
    <>
      {/* Overlay */}
      {flyerWithPagesLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50">
          <div className="flex items-center justify-center h-full w-full">
            <CgSpinner className="text-gray-500 text-4xl animate-spin" />
          </div>
        </div>
      )}

      <section className="flex-3 bg-gray-50" style={{ ...minHeight }}>
        <div>
          {pagesInput.map((p, index) => (
            <FlyerPage
              key={index}
              flyer={flyer}
              page={p}
              pageNumber={index + 1}
            />
          ))}
        </div>

        <div className="flex flex-row items-center justify-center mt-5 mb-10">
          <button
            onClick={() => {
              setPagesInput((p) => [
                ...p,
                {
                  pageImage: "",
                  sections: [],
                  storefrontFlyerId: flyer.id,
                },
              ]);
            }}
            className="flex flex-col gap-3 items-center py-5 px-10 border-[3px] border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 rounded-md cursor-pointer"
          >
            <IoMdAddCircleOutline className="text-4xl" />
            <span className="text-sm font-bold">Add page</span>
          </button>
        </div>
      </section>

      <section
        className="flex-1 bg-gray-100 border-gray-200 border-l"
        style={{ ...minHeight }}
      ></section>
    </>
  );
}
