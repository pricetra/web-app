import { createContext, ReactNode, useContext, useState } from "react";

export type NavbarContextType = {
  hideLogotype: boolean;
  setHideLogotype: (v: boolean) => void;

  pageIndicator?: ReactNode;
  setPageIndicator: (elem?: ReactNode) => void;

  navTools?: ReactNode;
  setNavTools: (elem?: ReactNode) => void;

  subHeader?: ReactNode;
  setSubHeader: (elem?: ReactNode) => void;

  resetAll: () => void;
};

export const NavbarContext = createContext({} as NavbarContextType);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [hideLogotype, setHideLogotype] = useState(false);
  const [pageIndicator, setPageIndicator] = useState<ReactNode>();
  const [navTools, setNavTools] = useState<ReactNode>();
  const [subHeader, setSubHeader] = useState<ReactNode>();

  return (
    <NavbarContext.Provider
      value={{
        hideLogotype,
        setHideLogotype,
        pageIndicator,
        setPageIndicator,
        navTools,
        setNavTools,
        subHeader,
        setSubHeader,
        resetAll: () => {
          setHideLogotype(false);
          setPageIndicator(undefined);
          setSubHeader(undefined);
        },
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
