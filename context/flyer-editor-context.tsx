"use client";

import {
  StorefrontFlyer,
  StorefrontFlyerItem,
  StorefrontFlyerPageInput,
  StorefrontFlyerSectionInput,
} from "graphql-utils";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type FlyerEditorContextType = {
  flyer: StorefrontFlyer;
  setFlyer: (flyer: StorefrontFlyer) => void;
  flyerStyles: Record<string, object | string | number | boolean>;

  pagesInput: StorefrontFlyerPageInput[];
  setPagesInput: (pages: StorefrontFlyerPageInput[]) => void;
  appendPageInput: (page?: StorefrontFlyerPageInput) => void;
  removePageInput: (index?: number) => void;

  currentPageInput?: StorefrontFlyerPageInput;
  setCurrentPageInput: (page?: StorefrontFlyerPageInput) => void;

  currentSectionInput?: StorefrontFlyerSectionInput;
  setCurrentSectionInput: (section?: StorefrontFlyerSectionInput) => void;

  currentSectionItemInput?: StorefrontFlyerItem;
  setCurrentSectionItemInput: (item?: StorefrontFlyerItem) => void;
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
  const [currentPageInput, setCurrentPageInput] =
    useState<StorefrontFlyerPageInput>();
  const [currentSectionInput, setCurrentSectionInput] =
    useState<StorefrontFlyerSectionInput>();
  const [currentSectionItemInput, setCurrentSectionItemInput] =
    useState<StorefrontFlyerItem>();

  const flyerStyles = useMemo(() => {
    try {
      return JSON.parse(flyer.flyerStyles ?? "{}");
    } catch {
      return {};
    }
  }, [flyer.flyerStyles]);

  function appendPageInput(page?: StorefrontFlyerPageInput) {
    setPagesInput((prev) => [...prev, page ?? { ...defaultPageInput }]);
  }

  function removePageInput(index?: number) {
    if (!index) {
      setPagesInput((prev) => prev.slice(0, -1));
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

        currentPageInput,
        setCurrentPageInput,

        currentSectionInput,
        setCurrentSectionInput,

        currentSectionItemInput,
        setCurrentSectionItemInput,
      }}
    >
      {children}
    </FlyerEditorContext.Provider>
  );
}

export const useFlyerEditor = () => useContext(FlyerEditorContext);
