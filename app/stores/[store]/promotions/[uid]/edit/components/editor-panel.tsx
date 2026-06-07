import { useFlyerEditor } from "@/context/flyer-editor-context";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import SectionPanelEditor from "./section-panel-editor";
import FlyerDetailsEditor from "./flyer-details-editor";

export default function EditorPanel() {
  const { currentSelection } = useFlyerEditor();
  const [detailsToggle, setDetailsToggle] = useState(true);

  useEffect(() => {
    if (currentSelection.type !== "page") setDetailsToggle(false);
  }, [currentSelection]);

  return (
    <>
      <div className="mb-10">
        <div
          className="flex flex-row items-center justify-start px-4 gap-4 py-4 cursor-pointer select-none"
          onClick={() => setDetailsToggle(!detailsToggle)}
        >
          {detailsToggle ? (
            <IoIosArrowForward className="rotate-90" />
          ) : (
            <IoIosArrowForward />
          )}
          <h2 className="text-lg font-bold flex-2">Flyer Details</h2>
        </div>

        {detailsToggle && (
          <FlyerDetailsEditor />
        )}
      </div>

      {currentSelection && currentSelection.type === "section" && (
        <div className="px-2">
          <SectionPanelEditor />
        </div>
      )}
    </>
  );
}
