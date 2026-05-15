import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import {
  StorefrontFlyer,
  StorefrontFlyerSimpleDocument,
  StorefrontFlyerSimpleQuery,
  StorefrontFlyerSimpleQueryVariables,
} from "graphql-utils";
import { cache } from "react";
import { createCloudinaryUrl } from "@/lib/files";
import FlyerViewPageClient from "./flyer-view-page-client";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { cookies } from "next/headers";
import LayoutProvider from "@/providers/layout-provider";

export const cachedFlyerSimple = cache(async (uid: string, authToken?: string) => {
  const queryVars: StorefrontFlyerSimpleQueryVariables = {
    uid,
  };

  const { data } = await fetchGraphql<
    StorefrontFlyerSimpleQueryVariables,
    StorefrontFlyerSimpleQuery
  >(StorefrontFlyerSimpleDocument, "query", queryVars, authToken);
  if (!data || !data.storefrontFlyerSimple) return null;

  return data.storefrontFlyerSimple;
});

type Props = {
  params: Promise<{
    store: string;
    uid: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_KEY);
  const { store, uid } = await params;
  const flyerData = await cachedFlyerSimple(uid, authToken?.value);
  if (!flyerData || !flyerData.store) return {};

  const title = `${flyerData.title} - ${flyerData.branch?.name ?? flyerData.store.name} | Pricetra`;
  const description =
    flyerData.description ??
    `Discover the latest promotions and deals in this flyer. Explore discounts on popular products at ${flyerData.branch?.name ?? flyerData.store.name}. Don't miss out on these exclusive offers!`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: flyerData.flyerImageId
        ? createCloudinaryUrl(flyerData.flyerImageId)
        : undefined,
      url: `https://pricetra.com/stores/${store}/promotions/${uid}`,
    },
  };
}

export default async function FlyerViewPage({ params }: Props) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_KEY);
  const { store, uid } = await params;
  const flyerData = await cachedFlyerSimple(uid, authToken?.value);
  if (!flyerData || !flyerData.store) notFound();
  if (flyerData.store.slug !== store) {
    notFound();
  }

  return <LayoutProvider>
    <FlyerViewPageClient flyer={flyerData as StorefrontFlyer} />
  </LayoutProvider>;
}
