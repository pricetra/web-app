import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import BranchesClient from "./client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: "Store Branches",
  };
}

export default async function BranchesPage({ params }: Props) {
  const { slug } = await params;

  return (
    <LayoutProvider>
      <BranchesClient storeSlug={slug} />
    </LayoutProvider>
  );
}
