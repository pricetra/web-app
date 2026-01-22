import path from "path";
import "@/public/markdown.scss";
import { Metadata } from "next";
import Markdown from "@/components/markdown";
import LayoutProvider from "@/providers/layout-provider";

export const dynamic = "force-static"; // Ensures this route is pre-rendered at build time

export const metadata: Metadata = {
  title: "Copyright Information - Pricetra",
  description: "Pricetra copyright information",
};

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "app", "copyright", "copyright.md");

  return <LayoutProvider>
    <Markdown filePath={filePath} />
  </LayoutProvider>;
}
