import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import AddStoreUserClient from "./client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: "Add Store User",
  };
}

export default async function AddStoreUserPage({ params }: Props) {
  const { slug } = await params;

  return (
    <LayoutProvider>
      <AddStoreUserClient storeSlug={slug} />
    </LayoutProvider>
  );
}
