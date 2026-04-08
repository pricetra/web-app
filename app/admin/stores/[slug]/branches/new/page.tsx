import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import NewBranchClient from "./client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: "Add Branch",
  };
}

export default async function NewBranchPage({ params }: Props) {
  const { slug } = await params;

  return (
    <LayoutProvider>
      <NewBranchClient storeSlug={slug} />
    </LayoutProvider>
  );
}
