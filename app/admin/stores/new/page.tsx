import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";
import AddStoreClient from "./client";
import { BusinessForm } from "graphql-utils";
import { parseBase64StringToObject } from "@/lib/strings";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    businessFormId?: string;
    businessForm?: string;
  }>;
};

export function generateMetadata(): Metadata {
  return {
    title: "Add Store",
  };
}

export default async function AddStorePage({ searchParams }: Props) {
  const { businessFormId, businessForm: businessFormRaw } = await searchParams;
  let businessForm: BusinessForm | undefined = undefined;
  if (businessFormRaw) {
    try {
      businessForm = parseBase64StringToObject<BusinessForm>(businessFormRaw);
    } catch {
      redirect('/');
    }
  }

  return (
    <LayoutProvider>
      <AddStoreClient
        businessFormId={businessFormId}
        businessForm={businessForm}
      />
    </LayoutProvider>
  );
}
