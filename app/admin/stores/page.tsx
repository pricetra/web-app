import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import StoresClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Manage Stores",
  };
}

export default function StoresPage() {
  return (
    <LayoutProvider>
      <StoresClient />
    </LayoutProvider>
  );
}
