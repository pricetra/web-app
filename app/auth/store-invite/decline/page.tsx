import LayoutProvider from "@/providers/layout-provider";
import { StoreUserData } from "graphql-utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import DeclineInviteClient from "./client";
import { parseBase64StringToObject } from "@/lib/strings";

type Props = {
  searchParams: Promise<{ data?: string }>;
};

export async function generateMetadata({}: Props): Promise<Metadata> {
  return {
    title: `Declining invitation...`,
  };
}

export default async function StoreUserInviteDeclinePage(props: Props) {
  const searchParams = await props.searchParams;
  if (!searchParams.data || searchParams.data === "") redirect("/");

  let parsedData = {} as StoreUserData;
  try {
    parsedData = parseBase64StringToObject<StoreUserData>(searchParams.data);
  } catch {
    redirect("/");
  }
  return (
    <LayoutProvider>
      <DeclineInviteClient data={searchParams.data} parsedData={parsedData} />
    </LayoutProvider>
  );
}
