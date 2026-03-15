import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import AddAdminBranchClient from "./client";

type Props = {
  searchParams: Promise<{
    storeId?: string;
  }>;
};

export function generateMetadata(): Metadata {
  return {
    title: "Add Branch",
  };
}

export default async function AddBranchPage({ searchParams }: Props) {
  const { storeId } = await searchParams;
  let parsedStoreId: number | undefined = undefined;
  if (storeId && !isNaN(+storeId)) {
    parsedStoreId = +storeId;
  }

  return (
    <LayoutProvider>
      <AddAdminBranchClient storeId={parsedStoreId} />
    </LayoutProvider>
  );
}
