"use client";

import {
  StorefrontFlyer,
  StorefrontFlyerItem,
  StorefrontFlyerPageInput,
  StorefrontFlyerSectionInput,
} from "graphql-utils";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type CurrentStorefrontFlyerPage = {
  type: "page";
  pageIndex: number;
  pageInput: StorefrontFlyerPageInput;
}

export type CurrentStorefrontFlyerSection = {
  type: "section";
  pageIndex: number;
  sectionIndex: number;
  sectionInput: StorefrontFlyerSectionInput;
}

export type CurrentStorefrontFlyerItem = {
  type: "item";
  pageIndex: number;
  sectionIndex: number;
  itemIndex: number;
  itemInput: StorefrontFlyerItem;
}

export type CurrentSelection = CurrentStorefrontFlyerPage | CurrentStorefrontFlyerSection | CurrentStorefrontFlyerItem;

export type FlyerEditorContextType = {
  flyer: StorefrontFlyer;
  setFlyer: (flyer: StorefrontFlyer) => void;
  flyerStyles: Record<string, object | string | number | boolean>;

  pagesInput: StorefrontFlyerPageInput[];
  setPagesInput: (pages: StorefrontFlyerPageInput[]) => void;
  appendPageInput: (page?: StorefrontFlyerPageInput) => void;
  removePageInput: (index?: number) => void;

  currentSelection: CurrentSelection;
  setCurrentSelection: (selection: CurrentSelection) => void;
};

export const FlyerEditorContext = createContext({} as FlyerEditorContextType);

export default function FlyerEditorProvider({
  flyer,
  children,
}: {
  flyer: StorefrontFlyer;
  children: ReactNode;
}) {
  const defaultPageInput: StorefrontFlyerPageInput = {
    storefrontFlyerId: flyer.id,
    sections: [],
    pageImage: "",
  };

  const [internalFlyer, setInternalFlyer] = useState<StorefrontFlyer>(flyer);
  const [pagesInput, setPagesInput] = useState<StorefrontFlyerPageInput[]>([
    { ...defaultPageInput },
  ]);
  const [currentSelection, setCurrentSelection] = useState<CurrentSelection>({
    type: "page",
    pageIndex: 0,
    pageInput: { ...defaultPageInput },
  });

  const flyerStyles = useMemo(() => {
    try {
      return JSON.parse(flyer.flyerStyles ?? "{}");
    } catch {
      return {};
    }
  }, [flyer.flyerStyles]);

  function appendPageInput(page?: StorefrontFlyerPageInput) {
    setPagesInput((prev) => [...prev, page ?? { ...defaultPageInput }]);
    setCurrentSelection({
      type: "page",
      pageIndex: pagesInput.length,
      pageInput: page ?? { ...defaultPageInput },
    });
  }

  function removePageInput(index?: number) {
    if (!index) {
      setPagesInput((prev) => prev.slice(0, -1));
      setCurrentSelection({
        type: "page",
        pageIndex: pagesInput.length - 1,
        pageInput: pagesInput[pagesInput.length - 1],
      });
      return;
    }

    setPagesInput((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <FlyerEditorContext.Provider
      value={{
        flyer: internalFlyer,
        setFlyer: setInternalFlyer,
        flyerStyles,

        pagesInput,
        setPagesInput,
        appendPageInput,
        removePageInput,

        currentSelection,
        setCurrentSelection,
      }}
    >
      {children}
    </FlyerEditorContext.Provider>
  );
}

export const useFlyerEditor = () => useContext(FlyerEditorContext);
