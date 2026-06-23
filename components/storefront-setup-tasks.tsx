import { useQuery } from "@apollo/client/react";
import { StorefrontSetupTasksDocument } from "graphql-utils";

export type StorefrontSetupTasksBannerProps = {
  storeId: number;
  branchId?: number;
};

export default function StorefrontSetupTasksBanner({
  storeId,
  branchId,
}: StorefrontSetupTasksBannerProps) {
  const { data } = useQuery(StorefrontSetupTasksDocument, {
    variables: { storeId, branchId },
  });

  console.log('setup tasks')
  console.log(data?.storefrontSetupTasks);

  return <></>;
}
