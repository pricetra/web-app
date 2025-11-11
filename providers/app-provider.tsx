'use client'
import { UserContextProvider } from "@/context/user-context";
import ApolloWrapper from "@/graphql/apollo-wrapper";
import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

export type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <CookiesProvider>
      <ApolloWrapper>
        <UserContextProvider>{children}</UserContextProvider>
      </ApolloWrapper>
    </CookiesProvider>
  );
}
