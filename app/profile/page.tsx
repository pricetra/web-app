import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import ProfileClient from "./client";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Profile - Pricetra"
  }
}

export default async function SearchPageServer() {
  return (
    <LayoutProvider>
      <ProfileClient />
    </LayoutProvider>
  );
}
