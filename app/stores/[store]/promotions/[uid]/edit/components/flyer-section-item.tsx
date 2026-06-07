import { Product, StorefrontFlyerItem } from "graphql-utils";
import ItemProductHorizontal from "./item-product-horizontal";
import { useState } from "react";
import { useFlyerEditor } from "@/context/flyer-editor-context";
import { IoMdRemove } from "react-icons/io";

export type FlyerSectionItemProps = {
  pageIndex: number;
  sectionIndex: number;
  itemIndex: number;
  item: StorefrontFlyerItem;
  type: "horizontal" | "vertical" | "custom";
};

export default function FlyerSectionItem({
  pageIndex,
  sectionIndex,
  itemIndex,
  item,
  type,
}: FlyerSectionItemProps) {
  const { removeItemFromPageSection } = useFlyerEditor();
  const [showRemoveButton, setShowRemoveButton] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowRemoveButton(true)}
      onMouseLeave={() => setShowRemoveButton(false)}
    >
      {showRemoveButton && (
        <div className="absolute top-0 right-0 z-10">
          <button
            onClick={() => {
              removeItemFromPageSection(pageIndex, sectionIndex, itemIndex);
            }}
            className="cursor-pointer text-white bg-red-600 rounded-full p-1 text-sm"
          >
            <IoMdRemove />
          </button>
        </div>
      )}

      {type === "horizontal" && (
        <ItemProductHorizontal product={item.product as Product} />
      )}
    </div>
  );
}
