import LayoutProvider from "@/providers/layout-provider";
import { StoreUserData } from "graphql-utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import DeclineInviteClient from "./client";

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

  const bufferDataObj = Buffer.from(searchParams.data, "base64");
  const decodedRawDataObj = bufferDataObj.toString("utf-8");
  let parsedData = {} as StoreUserData;
  try {
    parsedData = JSON.parse(decodedRawDataObj);
  } catch {
    redirect("/");
  }
  return (
    <LayoutProvider>
      <DeclineInviteClient data={searchParams.data} parsedData={parsedData} />
    </LayoutProvider>
  );
}
