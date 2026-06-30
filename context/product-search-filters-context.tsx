import ProductFiltersDialog from "@/components/product-filters-dialog";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductSearch } from "graphql-utils";
import { buildSearchParamsFromFilters, parseSearchFilters } from "@/lib/product-search-filters-parsers";

export type ProductSearchFiltersContextType = {
  panelOpen: boolean;
  togglePanel: (open?: boolean) => void;
  keys: string[];
  searchFilters: ProductSearch;
  urlParams: URLSearchParams;
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

  const { keys, searchFilters, urlParams } = useMemo(() => {
    const filters = parseSearchFilters(searchParams);
    const parsedKeys = Object.keys(filters) as string[];
    const params = buildSearchParamsFromFilters(filters);

    return {
      keys: parsedKeys,
      searchFilters: filters,
      urlParams: params,
    };
  }, [searchParams]);

  return (
    <ProductSearchFiltersContext.Provider
      value={{
        panelOpen,
        togglePanel: (open?: boolean) =>
          setPanelOpen((panelOpen) => open ?? !panelOpen),
        keys,
        searchFilters,
        urlParams,
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
