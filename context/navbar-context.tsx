import { createContext, ReactNode, useContext, useState } from "react";

export type NavbarContextType = {
  hideLogotype: boolean;
  setHideLogotype: (v: boolean) => void;

  pageIndicator?: ReactNode
  setPageIndicator: (elem?: ReactNode) => void;

  subHeader?: ReactNode;
  setSubHeader: (elem?: ReactNode) => void;
};

export const NavbarContext = createContext({} as NavbarContextType);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [hideLogotype, setHideLogotype] = useState(false);
  const [pageIndicator, setPageIndicator] = useState<ReactNode>();
  const [subHeader, setSubHeader] = useState<ReactNode>();

  return (
    <NavbarContext.Provider
      value={{
        hideLogotype,
        setHideLogotype,
        pageIndicator,
        setPageIndicator,
        subHeader,
        setSubHeader,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
