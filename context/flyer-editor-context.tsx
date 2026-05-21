"use client";

import {
  Product,
  StorefrontFlyer,
  StorefrontFlyerItem,
  StorefrontFlyerItemInput,
  StorefrontFlyerPageInput,
  StorefrontFlyerSectionInput,
} from "graphql-utils";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type CurrentStorefrontFlyerPage = {
  type: "page";
  pageIndex: number;
  pageInput: StorefrontFlyerPageInput;
};

export type CurrentStorefrontFlyerSection = {
  type: "section";
  pageIndex: number;
  sectionIndex: number;
  sectionInput: StorefrontFlyerSectionInput;
};

export type CurrentStorefrontFlyerItem = {
  type: "item";
  pageIndex: number;
  sectionIndex: number;
  itemIndex: number;
  itemInput: StorefrontFlyerItem;
};

export type CurrentSelection =
  | CurrentStorefrontFlyerPage
  | CurrentStorefrontFlyerSection
  | CurrentStorefrontFlyerItem;

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

  appendSectionToPage: (pageIndex: number) => void;
  setSectionInput: (
    pageIndex: number,
    sectionIndex: number,
    sectionInput: StorefrontFlyerSectionInput,
  ) => void;
  removeSection: (pageIndex: number, sectionIndex: number) => void;
  setSectionLayout: (
    pageIndex: number,
    sectionIndex: number,
    layout: object,
  ) => void;

  addItemToPageSection: (
    pageIndex: number,
    sectionIndex: number,
    product: Product,
    itemInput: StorefrontFlyerItemInput,
  ) => void;
  removeItemFromPageSection: (
    pageIndex: number,
    sectionIndex: number,
    itemIndex: number,
  ) => void;

  productsMap: Map<string, Product>;
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
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(
    new Map(),
  );

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

  function appendSectionToPage(
    pageIndex: number,
    section?: StorefrontFlyerSectionInput,
  ) {
    const sectionInput = section ?? {
      sortOrder: pagesInput[pageIndex].sections.length,
      items: [],
    };
    const newPagesInput = [...pagesInput];
    const newSection = [...newPagesInput[pageIndex].sections];
    newSection.push(sectionInput);
    newPagesInput[pageIndex].sections = newSection;
    setPagesInput([...newPagesInput]);

    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex: newSection.length - 1,
      sectionInput,
    });
  }

  function setSectionInput(
    pageIndex: number,
    sectionIndex: number,
    sectionInput: StorefrontFlyerSectionInput,
  ) {
    const newPagesInput = [...pagesInput];
    const newSections = [...newPagesInput[pageIndex].sections];
    newSections[sectionIndex] = sectionInput;
    newPagesInput[pageIndex].sections = newSections;
    setPagesInput([...newPagesInput]);

    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex,
      sectionInput,
    });
  }

  function setSectionLayout(
    pageIndex: number,
    sectionIndex: number,
    layout: object,
  ) {
    const newPagesInput = [...pagesInput];
    const newSections = [...newPagesInput[pageIndex].sections];
    const newSectionInput = { ...newSections[sectionIndex] };
    newSectionInput.layout = JSON.stringify(layout);
    newSections[sectionIndex] = newSectionInput;
    newPagesInput[pageIndex].sections = newSections;
    setPagesInput([...newPagesInput]);

    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex,
      sectionInput: newSectionInput,
    });
  }

  function removeSection(pageIndex: number, sectionIndex: number) {
    const newPagesInput = [...pagesInput];
    const newSections = [...newPagesInput[pageIndex].sections];
    newSections.splice(sectionIndex, 1);
    newPagesInput[pageIndex].sections = newSections;
    setPagesInput([...newPagesInput]);

    setCurrentSelection({
      type: "page",
      pageIndex,
      pageInput: newPagesInput[pageIndex],
    });
  }

  function addItemToPageSection(
    pageIndex: number,
    sectionIndex: number,
    product: Product,
    itemInput: StorefrontFlyerItemInput,
  ) {
    if (!product.stock) return;

    const newPagesInput = [...pagesInput];
    const newSections = [...newPagesInput[pageIndex].sections];
    const newItems = [...newSections[sectionIndex].items];
    newItems.push(itemInput);
    newSections[sectionIndex].items = newItems;
    newPagesInput[pageIndex].sections = newSections;
    setPagesInput([...newPagesInput]);

    setProductsMap((prev) => {
      const newMap = new Map<string, Product>(prev); // Clone the existing map
      newMap.set(`${product.id}-${product.stock!.id}`, { ...product }); // Update the clone
      return newMap; // Return the new instance
    });

    setCurrentSelection({
      type: "section",
      pageIndex,
      sectionIndex,
      sectionInput: newSections[sectionIndex],
    });
  }

  function removeItemFromPageSection(
    pageIndex: number,
    sectionIndex: number,
    itemIndex: number,
  ) {
    const newPagesInput = [...pagesInput];
    const newSectionsInput = [...newPagesInput[pageIndex].sections];
    const items = [...newSectionsInput[sectionIndex].items]
    const newItemsInput = items.filter(
      (_, i) => i !== itemIndex,
    );
    newSectionsInput[sectionIndex].items = newItemsInput;
    newPagesInput[pageIndex].sections = newSectionsInput;
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

        appendSectionToPage,
        setSectionInput,
        removeSection,
        setSectionLayout,

        addItemToPageSection,
        removeItemFromPageSection,

        productsMap,
      }}
    >
      {children}
    </FlyerEditorContext.Provider>
  );
}

export const useFlyerEditor = () => useContext(FlyerEditorContext);
