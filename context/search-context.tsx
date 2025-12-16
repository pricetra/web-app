import { createContext, ReactNode, useContext, useState } from "react";

export type SearchContextType = {
  searchText?: string;
  setSearchText: (searchText?: string) => void;
};

export const SearchContext = createContext({} as SearchContextType);

export default function SearchContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [searchText, setSearchText] = useState<string>();
  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchContext = () => useContext(SearchContext);
