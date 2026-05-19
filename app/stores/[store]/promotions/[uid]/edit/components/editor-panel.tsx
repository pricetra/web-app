import { useFlyerEditor } from "@/context/flyer-editor-context";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import SectionPanelEditor from "./section-panel-editor";

export default function EditorPanel() {
  const { flyer, flyerStyles, currentSelection } = useFlyerEditor();
  const [detailsToggle, setDetailsToggle] = useState(true);

  useEffect(() => {
    if (currentSelection.type !== 'page') setDetailsToggle(false)
  }, [currentSelection]);

  return (
    <>
      <div className="mb-10">
        <div className="flex flex-row items-center justify-start px-4 gap-4 py-4 cursor-pointer select-none" onClick={() => setDetailsToggle(!detailsToggle)}>
          {detailsToggle ? <IoIosArrowForward className="rotate-90" /> : <IoIosArrowForward />}
          <h2 className="text-lg font-bold flex-2">Flyer Details</h2>
        </div>

        {detailsToggle && (
          <div className="flex flex-col gap-2 px-4 text-sm text-gray-700">
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Title:</h3>
              <p className="flex-1 text-black">{flyer.title}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Description:</h3>
              <p className="flex-1 text-black">{flyer.description}</p>
            </div>

            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Format:</h3>
              <p className="flex-1 text-black">{flyerStyles.format as string}</p>
            </div>
          </div>
        )}
      </div>

      {currentSelection && currentSelection.type === "section" && (
        <div className="px-4">
          <SectionPanelEditor />
        </div>
      )}
    </>
  );
}
