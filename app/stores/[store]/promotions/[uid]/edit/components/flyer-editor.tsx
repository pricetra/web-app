import { useEffect, useMemo } from "react";
import FlyerPage from "./flyer-page";
import { useNavbar } from "@/context/navbar-context";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import {
  StorefrontFlyerDocument,
  StorefrontFlyerPageInput,
} from "graphql-utils";
import { useLazyQuery } from "@apollo/client/react";
import { CgSpinner } from "react-icons/cg";
import EditorPanel from "./editor-panel";
import { IoMdAddCircleOutline } from "react-icons/io";
import useFlyerLayoutSize from "@/hooks/useFlyerLayoutSize";

export type FlyerEditorSectionProps = object;

export default function FlyerEditor({}: FlyerEditorSectionProps) {
  const { navbarHeight } = useNavbar();
  const {
    flyer,
    flyerStyles,
    pagesInput,
    currentSelection,
    setPagesInput,
    setCurrentSelection,
    appendPageInput,
  } = useFlyerEditor();
  const size = useFlyerLayoutSize(flyerStyles.format as string);
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
        <div className="mb-7">
          {pagesInput.map((p, i) => (
            <div
              onClick={() => {
                if (currentSelection.pageIndex === i) return;
                setCurrentSelection({
                  type: "page",
                  pageIndex: i,
                  pageInput: p,
                });
              }}
              className="mb-5"
              key={i}
            >
              <FlyerPage flyer={flyer} page={p} pageIndex={i} />
            </div>
          ))}

          {pagesInput.length === 0 && <div
            className="flex flex-col items-center justify-center mt-10 mb-16 mx-auto"
            style={{ width: size.width }}
          >
            <button
              onClick={() => {
                appendPageInput();
              }}
              className="flex flex-col gap-3 items-center py-5 px-10 border-[3px] border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 rounded-md cursor-pointer w-full"
            >
              <IoMdAddCircleOutline className="text-4xl" />
              <span className="text-sm font-bold">Add page</span>
            </button>
          </div>}
        </div>
      </section>

      <section
        className="flex-1 bg-gray-100 border-gray-200 border-l relative"
        style={{ ...minHeight }}
      >
        <div className="sticky top-0 h-full" style={{height: minHeight.minHeight}}>
          <div className="w-full h-full overflow-y-auto">
            <EditorPanel />

            <div style={{height: '10vh'}} />
          </div>
        </div>
      </section>
    </>
  );
}
