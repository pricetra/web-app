"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type RouteHistoryContextType = {
  history: string[];
  addToHistory: (route: string) => void;
  prevRoute?: string;
};

export const RouteHistoryContext = createContext({} as RouteHistoryContextType);

export default function RouteHistoryContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [history, setHistory] = useState<string[]>([]);
  const prevRoute =
    useMemo(() => {
      if (history.length < 2) return undefined;
      return history[history.length - 2];
    }, [history]);

  return (
    <RouteHistoryContext.Provider
      value={{
        history,
        addToHistory: (route: string) => {
          setHistory((prevHistory) => [...prevHistory, route]);
        },
        prevRoute,
      }}
    >
      {children}
    </RouteHistoryContext.Provider>
  );
}

export const useRouteHistory = () => useContext(RouteHistoryContext);
