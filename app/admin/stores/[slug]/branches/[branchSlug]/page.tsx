import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import BranchDetailClient from "./client";

type Props = {
  params: Promise<{ slug: string, branchSlug: string; }>;
};

export function generateMetadata(): Metadata {
  return {
    title: "Branch Details",
  };
}

export default async function BranchDetailPage({ params }: Props) {
  const { slug, branchSlug } = await params;

  console.log("Branch Slug:", branchSlug);

  return (
    <LayoutProvider>
      <BranchDetailClient storeSlug={slug} branchSlug={branchSlug} />
    </LayoutProvider>
  );
}
