import { notFound } from "next/navigation";
import { cachedFlyerSimple } from "../page";
import { cookies } from "next/headers";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import LayoutProvider from "@/providers/layout-provider";
import FlyerEditorClient from "./flyer-editor-client";
import { StorefrontFlyer } from "graphql-utils";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

type Props = {
  params: Promise<{
    store: string;
    uid: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_KEY);
  const { uid } = await params;
  const flyerData = await cachedFlyerSimple(uid, authToken?.value);
  if (!flyerData || !flyerData.store) return {};

  const title = `Flyer editor -${flyerData.title} - ${flyerData.branch?.name ?? flyerData.store.name} | Pricetra`;
  return {
    title,
  };
}

export default async function FlyerEditorPage({ params }: Props) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_KEY);
  const { store, uid } = await params;
  const flyerData = await cachedFlyerSimple(uid, authToken?.value);
  if (!flyerData || !flyerData.store) notFound();
  if (flyerData.store.slug !== store) {
    notFound();
  }

  return <LayoutProvider fullScreen>
    <FlyerEditorClient flyer={flyerData as StorefrontFlyer} />
  </LayoutProvider>;
}
