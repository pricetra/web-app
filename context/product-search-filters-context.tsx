import ProductFiltersDialog from "@/components/product-filters-dialog";
import { createContext, ReactNode, useContext, useState } from "react";

export type ProductSearchFiltersContextType = {
  panelOpen: boolean;
  togglePanel: (open?: boolean) => void;
};

export const ProductSearchFiltersContext = createContext(
  {} as ProductSearchFiltersContextType,
);

export default function ProductSearchFiltersContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <ProductSearchFiltersContext.Provider
      value={{
        panelOpen,
        togglePanel: (open?: boolean) =>
          setPanelOpen((panelOpen) => open ?? !panelOpen),
      }}
    >
      <ProductFiltersDialog
        open={panelOpen}
        onOpenChange={(v) => setPanelOpen(v)}
      />

      {children}
    </ProductSearchFiltersContext.Provider>
  );
}

export const useProductSearchFilters = () =>
  useContext(ProductSearchFiltersContext);
