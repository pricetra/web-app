import {
  Branch,
  BranchDocument,
  BranchQuery,
  BranchQueryVariables,
  Store,
} from "graphql-utils";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import { storeUserAuthorized } from "@/lib/roles";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { cookies } from "next/headers";
import ManageBranchPageClient from "./manage-branch-page-client";
import LayoutProvider from "@/providers/layout-provider";

const cachedStoreAndBranch = cache(async (store: string, branch: string) => {
  const storeId = +store;
  const branchId = +branch;
  const queryVars: BranchQueryVariables = {};
  if (isNaN(storeId)) {
    queryVars.storeSlug = store;
  } else {
    queryVars.storeId = storeId;
  }
  if (isNaN(branchId)) {
    queryVars.branchSlug = branch;
  } else {
    queryVars.branchId = branchId;
  }

  const { data } = await fetchGraphql<BranchQueryVariables, BranchQuery>(
    BranchDocument,
    "query",
    queryVars,
  );
  if (!data || !data.findStore || !data.findBranch) return null;

  return data;
});

type Props = {
  params: Promise<{ store: string; branch: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store, branch } = await params;
  const data = await cachedStoreAndBranch(store, branch);
  if (!data) return {};

  return {
    title: `Manage ${data.findBranch.name} - ${data.findStore.name} - Pricetra`,
  };
}

export default async function ManageBranchPage({ params }: Props) {
  const { store, branch } = await params;
  const data = await cachedStoreAndBranch(store, branch);
  if (!data) notFound();

  const storeData = data.findStore as Store;
  const branchData = data.findBranch as Branch;

  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_KEY)?.value;
  if (!authToken) {
    redirect(
      `/auth/login?return=/stores/${storeData.slug}/${branchData.slug}/manage`,
    );
  }

  const storeUser = await storeUserAuthorized(
    authToken,
    storeData.id,
    branchData.id,
  );
  if (!storeUser) {
    redirect(`/stores/${storeData.slug}/${branchData.slug}`);
  }

  return (
    <LayoutProvider>
      <ManageBranchPageClient store={storeData} branch={branchData} />
    </LayoutProvider>
  );
}
