import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import ProductViewClient from "./client";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Product views - Admin"
  }
}

export default async function ProductViewsPageServer() {
  return (
    <LayoutProvider>
      <ProductViewClient />
    </LayoutProvider>
  );
}
