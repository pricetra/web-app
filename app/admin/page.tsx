import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import AdminClient from "./admin-client";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin"
  }
}

export default async function SearchPageServer() {
  return (
    <LayoutProvider>
      <AdminClient />
    </LayoutProvider>
  );
}

