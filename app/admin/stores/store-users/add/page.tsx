import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import AddStoreUserClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Create Store User",
  };
}

export default function AddStoreUserPage() {
  return (
    <LayoutProvider>
      <AddStoreUserClient />
    </LayoutProvider>
  );
}
