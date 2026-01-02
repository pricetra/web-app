import { createContext, ReactNode, useContext, useState } from "react";

export const NAVBAR_HEIGHT = 60;
export const SUBNAV_HEIGHT = 40;

const searchTaglines = [
  "Search for milk, eggs, cereal...",
  "Find prices for groceries near you",
  "What are you shopping for today?",
  "Search products, brands, stores or categories",
  "Start with milk, bread, or coffee...",
];

export type NavbarContextType = {
  navbarHeight: number;
  setNavbarHeight: (height: number) => void;

  hideLogotype: boolean;
  setHideLogotype: (v: boolean) => void;

  searchPlaceholder: string;
  setSearchPlaceholder: (p?: string) => void;

  searchQueryPath?: string;
  setSearchQueryPath: (p?: string) => void;

  pageIndicator?: ReactNode;
  setPageIndicator: (elem?: ReactNode) => void;

  navTools?: ReactNode;
  setNavTools: (elem?: ReactNode) => void;

  subHeader?: ReactNode;
  setSubHeader: (elem?: ReactNode) => void;

  subHeaderHeight: number;
  setSubHeaderHeight: (height: number) => void;

  resetAll: () => void;
};

export const NavbarContext = createContext({} as NavbarContextType);

const DEFAULT_SEARCH_PLACEHOLDER = searchTaglines[3];
const DEFAULT_SEARCH_QUERY_PATH = "/search";

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [navbarHeight, setNavbarHeight] = useState(NAVBAR_HEIGHT);
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
  const [subHeaderHeight, setSubHeaderHeight] = useState(SUBNAV_HEIGHT);

  return (
    <NavbarContext.Provider
      value={{
        navbarHeight,
        setNavbarHeight,

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
        subHeaderHeight,
        setSubHeaderHeight,

        resetAll: () => {
          setNavbarHeight(NAVBAR_HEIGHT);
          setHideLogotype(false);
          setSearchPlaceholder(DEFAULT_SEARCH_PLACEHOLDER);
          setSearchQueryPath(DEFAULT_SEARCH_QUERY_PATH);
          setPageIndicator(undefined);
          setNavTools(undefined);
          setSubHeader(undefined);
          setSubHeaderHeight(SUBNAV_HEIGHT);
        },
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
