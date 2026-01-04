import path from "path";
import "@/public/markdown.scss";
import { Metadata } from "next";
import Markdown from "@/components/markdown";
import LayoutProvider from "@/providers/layout-provider";

export const dynamic = "force-static"; // Ensures this route is pre-rendered at build time

export const metadata: Metadata = {
  title: "Terms - Pricetra",
  description: "Pricetra terms of service",
};

export default async function TermsPage() {
  const filePath = path.join(process.cwd(), "app", "terms", "terms.md");

  return <LayoutProvider>
    <Markdown filePath={filePath} />
  </LayoutProvider>;
}
