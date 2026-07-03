import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import StocksClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Stocks - Admin",
  };
}

export default function StocksPage() {
  return (
    <LayoutProvider fullScreen>
      <StocksClient />
    </LayoutProvider>
  );
}
