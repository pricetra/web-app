import path from "path";
import "@/public/markdown.scss";
import { Metadata } from "next";
import Markdown from "@/components/markdown";

export const dynamic = "force-static"; // Ensures this route is pre-rendered at build time

export const metadata: Metadata = {
  title: "Privacy - Pricetra",
  description: "Pricetra privacy policy",
};

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "app", "privacy", "privacy.md");

  return <Markdown filePath={filePath} />;
}
