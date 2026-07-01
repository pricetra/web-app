import { createContext, ReactNode, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductSearch } from "graphql-utils";
import { buildSearchParamsFromFilters, parseSearchFilters } from "@/lib/product-search-filters-parsers";

export type ProductSearchFiltersContextType = {
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
        searchParamKeys,
        searchFilters,
        searchFiltersUrlParams,
      }}
    >
      {children}
    </ProductSearchFiltersContext.Provider>
  );
}

export const useProductSearchFilters = () =>
  useContext(ProductSearchFiltersContext);
