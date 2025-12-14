import { createContext, ReactNode, useContext, useState } from "react";

const searchTaglines = [
  "Search for milk, eggs, cereal...",
  "Find prices for groceries near you",
  "What are you shopping for today?",
  "Search products, brands, stores or categories",
  "Start with milk, bread, or coffee...",
];

export type NavbarContextType = {
  hideLogotype: boolean;
  setHideLogotype: (v: boolean) => void;

  searchPlaceholder?: string;
  setSearchPlaceholder: (p?: string) => void;

  searchQueryPath?: string;
  setSearchQueryPath: (p?: string) => void;

  pageIndicator?: ReactNode;
  setPageIndicator: (elem?: ReactNode) => void;

  navTools?: ReactNode;
  setNavTools: (elem?: ReactNode) => void;

  subHeader?: ReactNode;
  setSubHeader: (elem?: ReactNode) => void;

  resetAll: () => void;
};

export const NavbarContext = createContext({} as NavbarContextType);

const DEFAULT_SEARCH_PLACEHOLDER = searchTaglines[3];
const DEFAULT_SEARCH_QUERY_PATH = "/search";

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [hideLogotype, setHideLogotype] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    DEFAULT_SEARCH_PLACEHOLDER
  );
  const [searchQueryPath, setSearchQueryPath] = useState(
    DEFAULT_SEARCH_QUERY_PATH
  );
  const [pageIndicator, setPageIndicator] = useState<ReactNode>();
  const [navTools, setNavTools] = useState<ReactNode>();
  const [subHeader, setSubHeader] = useState<ReactNode>();

  return (
    <NavbarContext.Provider
      value={{
        hideLogotype,
        setHideLogotype,
        searchPlaceholder,
        setSearchPlaceholder: (p) => {
          setSearchPlaceholder(p ?? searchTaglines[3]);
        },
        searchQueryPath,
        setSearchQueryPath: (p) => {
          setSearchQueryPath(p ?? "/search");
        },
        pageIndicator,
        setPageIndicator,
        navTools,
        setNavTools,
        subHeader,
        setSubHeader: (elem) => {
          setSubHeader(elem);
        },
        resetAll: () => {
          setHideLogotype(false);
          setSearchPlaceholder(DEFAULT_SEARCH_PLACEHOLDER);
          setSearchQueryPath(DEFAULT_SEARCH_QUERY_PATH);
          setPageIndicator(undefined);
          setNavTools(undefined);
          setSubHeader(undefined);
        },
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
