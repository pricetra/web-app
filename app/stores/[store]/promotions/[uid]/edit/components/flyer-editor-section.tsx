import { useEffect, useMemo } from "react";
import FlyerPage from "./flyer-page";
import { useNavbar } from "@/context/navbar-context";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  StorefrontFlyerDocument,
  StorefrontFlyerPageInput,
} from "graphql-utils";
import { useLazyQuery } from "@apollo/client/react";
import { CgSpinner } from "react-icons/cg";

export type FlyerEditorSectionProps = object;

export default function FlyerEditorSection({}: FlyerEditorSectionProps) {
  const { navbarHeight } = useNavbar();
  const {
    flyer,
    flyerStyles,
    pagesInput,
    setPagesInput,
    appendPageInput,
  } = useFlyerEditor();
  const [
    getStorefrontFlyerWithPages,
    { data: flyerWithPagesData, loading: flyerWithPagesLoading },
  ] = useLazyQuery(StorefrontFlyerDocument);

  const minHeight = useMemo(
    () => ({
      minHeight: `calc(100vh - ${navbarHeight}px)`,
    }),
    [navbarHeight],
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyerWithPagesData]);

  return (
    <>
      {/* Loading overlay */}
      {flyerWithPagesLoading && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50"
          style={{ background: "rgba(255, 255, 255, 0.7)" }}
        >
          <div className="flex items-center justify-center h-full w-full">
            <CgSpinner className="text-gray-800 text-[4rem] animate-spin" />
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
            onClick={() => appendPageInput()}
            className="flex flex-col gap-3 items-center py-5 px-10 border-[3px] border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 rounded-md cursor-pointer"
          >
            <IoMdAddCircleOutline className="text-4xl" />
            <span className="text-sm font-bold">Add page</span>
          </button>
        </div>
      </section>

      <section
        className="flex-1 bg-gray-100 border-gray-200 border-l relative"
        style={{ ...minHeight }}
      >
        <div className="w-full h-full overflow-y-auto sticky top-0 left-0">
          <div className="mb-4 text-gray-700">
            <h2 className="text-lg font-bold px-4 py-4">Flyer Settings</h2>
            <div className="flex flex-col gap-2 px-4 text-sm">
              <div className="flex flex-row gap-2">
                <h3 className="font-semibold">Title:</h3>
                <p className="flex-1">{flyer.title}</p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Description:</h3>
                <p className="flex-1">{flyer.description}</p>
              </div>

              <div className="flex flex-row gap-2">
                <h3 className="font-semibold">Format:</h3>
                <p className="flex-1">{flyerStyles.format as string}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
