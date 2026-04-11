import {
  FindStoreDocument,
  FindStoreQuery,
  FindStoreQueryVariables,
  Store,
} from "graphql-utils";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import { storeUserAuthorized } from "@/lib/roles";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { cookies } from "next/headers";
import ManageStorePageClient from "./manage-store-page-client";
import LayoutProvider from "@/providers/layout-provider";

const cachedStore = cache(async (store: string) => {
  const storeId = +store;
  const queryVars: FindStoreQueryVariables = {};
  if (isNaN(storeId)) {
    queryVars.storeSlug = store;
  } else {
    queryVars.storeId = storeId;
  }

  const { data } = await fetchGraphql<FindStoreQueryVariables, FindStoreQuery>(
    FindStoreDocument,
    "query",
    queryVars,
  );
  if (!data || !data.findStore) return null;

  return data.findStore;
});

type Props = {
  params: Promise<{ store: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store } = await params;
  const storeData = await cachedStore(store);
  if (!storeData) return {};

  return {
    title: `Manage ${storeData.name} - Pricetra`,
  };
}

export default async function ManageStorePage({ params }: Props) {
  const { store } = await params;
  const storeData = await cachedStore(store);
  if (!storeData) notFound();

  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_KEY)?.value;
  if (!authToken) {
    redirect(`/auth/login?return=/stores/${storeData.slug}/manage`);
  }

  const storeUser = await storeUserAuthorized(authToken, storeData.id);
  if (!storeUser) {
    redirect(`/stores/${storeData.slug}`);
  }

  return (
    <LayoutProvider>
      <ManageStorePageClient store={storeData as Store} />
    </LayoutProvider>
  );
}
