"use client";

import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { createCloudinaryUrl } from "@/lib/files";
import { StorefrontFlyer, StorefrontFlyerPageInput } from "graphql-utils";
import { useLayoutEffect, useMemo, useState } from "react";
import FlyerPage from "./components/flyer-page";
import { IoMdAddCircleOutline } from "react-icons/io";

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
  const [pagesInput, setPagesInput] = useState<StorefrontFlyerPageInput[]>([]);

  useLayoutEffect(() => {
    if (!flyer.store) return;

    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={flyer.branch?.name ?? flyer.store.name}
        subTitle="Flyer Editor"
        imgSrc={createCloudinaryUrl(flyer.store.logo, 100, 100)}
        href={`/stores/${flyer.store.slug}${flyer.branch ? `/${flyer.branch.slug}` : ""}`}
      />,
    );
    setSearchPlaceholder(`Search ${flyer.store.name}`);
    setSearchQueryPath(`/stores/${flyer.store.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const minHeight = useMemo(
    () => ({
      minHeight: `calc(100vh - ${navbarHeight}px)`,
    }),
    [navbarHeight],
  );

  return (
    <>
      <section className="flex-3 bg-gray-50" style={{ ...minHeight }}>
        <div>
          {pagesInput.map((p, index) => (
            <FlyerPage key={index} page={p} pageNumber={index + 1} />
          ))}
        </div>

        <div className="flex flex-row items-center justify-center">
          <button onClick={() => {
            setPagesInput(p => ([...p, {
              pageImage: "",
              sections: [],
              storefrontFlyerId: flyer.id,
            }]))
          }} className="flex flex-col gap-5 items-center py-5 px-10 border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 rounded-md mt-5 cursor-pointer">
            <IoMdAddCircleOutline className="text-3xl" />
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
