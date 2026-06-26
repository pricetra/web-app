import { createContext, ReactNode, useContext, useState } from "react";

export type ProductFiltersPanelContextType = {
  panelOpen: boolean;
  togglePanel: (open?: boolean) => void;
};

export const ProductFiltersPanelContext = createContext(
  {} as ProductFiltersPanelContextType,
);

export default function ProductFiltersPanelContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <ProductFiltersPanelContext.Provider
      value={{
        panelOpen,
        togglePanel: (open?: boolean) =>
          setPanelOpen((panelOpen) => open ?? !panelOpen),
      }}
    >
      {children}
    </ProductFiltersPanelContext.Provider>
  );
}

export const useProductFiltersPanel = () =>
  useContext(ProductFiltersPanelContext);
