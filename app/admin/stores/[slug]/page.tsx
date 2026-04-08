import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import StoreDetailClient from "./client";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: "Store Details",
  };
}

export default async function StoreDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <LayoutProvider>
      <StoreDetailClient slug={slug} />
    </LayoutProvider>
  );
}
