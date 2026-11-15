import {
  createContext,
  ReactNode,
  useContext,
  useState,
  RefObject,
  useRef,
} from "react";

export type SearchContextType = {
  searchText?: string;
  setSearchText: (searchText?: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

export const SearchContext = createContext({} as SearchContextType);

export default function SearchContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [searchText, setSearchText] = useState<string>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <SearchContext.Provider
      value={{ searchText, setSearchText, searchInputRef }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchContext = () => useContext(SearchContext);
