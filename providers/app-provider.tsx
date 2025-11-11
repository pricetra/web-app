'use client'
import ApolloWrapper from "@/graphql/apollo-wrapper";
import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

export type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <CookiesProvider>
      <ApolloWrapper>{children}</ApolloWrapper>
    </CookiesProvider>
  );
}
