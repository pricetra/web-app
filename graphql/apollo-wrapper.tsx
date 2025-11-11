'use client'
import { SiteCookieValues } from "@/lib/cookies";
import { HttpLink } from "@apollo/client";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { RetryLink } from "@apollo/client/link/retry";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";
import { useCookies } from "react-cookie";

export const uri =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/graphql";

const httpLink = new HttpLink({ uri });
const uploadLink = new HttpLink({ uri }); // createUploadLink({ uri });

const retryLink = new RetryLink({
  delay: {
    initial: 1000,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error) => !!error,
  },
});

function createAuthLink(jwt: string) {
  return new SetContextLink(({ headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${jwt}`,
    },
  }));
}

function newClient(jwt?: string) {
  if (!jwt)
    return new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });

  return new ApolloClient({
    link: ApolloLink.from([retryLink, createAuthLink(jwt), uploadLink]),
    cache: new InMemoryCache(),
  });
}

type ApolloWrapperProps = { children: ReactNode };

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  const [cookies] = useCookies<"auth_token", SiteCookieValues>(["auth_token"]);
  return (
    <ApolloProvider client={newClient(cookies.auth_token)}>
      {children}
    </ApolloProvider>
  );
}
