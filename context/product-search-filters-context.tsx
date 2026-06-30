import ProductFiltersDialog from "@/components/product-filters-dialog";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductSearch } from "graphql-utils";
import { buildSearchParamsFromFilters, parseSearchFilters } from "@/lib/product-search-filters-parsers";

export type ProductSearchFiltersContextType = {
  panelOpen: boolean;
  togglePanel: (open?: boolean) => void;
  searchParamKeys: string[];
  searchFilters: ProductSearch;
  searchFiltersUrlParams: URLSearchParams;
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
  const searchParams = useSearchParams();

  const { searchParamKeys, searchFilters, searchFiltersUrlParams } = useMemo(() => {
    const searchFilters = parseSearchFilters(searchParams);
    const searchParamKeys = Object.keys(searchFilters) as string[];
    const searchFiltersUrlParams = buildSearchParamsFromFilters(searchFilters);

    return {
      searchParamKeys,
      searchFilters,
      searchFiltersUrlParams,
    };
  }, [searchParams]);

  return (
    <ProductSearchFiltersContext.Provider
      value={{
        panelOpen,
        togglePanel: (open?: boolean) =>
          setPanelOpen((panelOpen) => open ?? !panelOpen),
        searchParamKeys,
        searchFilters,
        searchFiltersUrlParams,
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
