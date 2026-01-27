import { useAuth } from "@/context/user-context";
import { useLazyQuery } from "@apollo/client/react";
import { AllBranchesDocument, Branch, StoreUser } from "graphql-utils";
import { useEffect, useState } from "react";

export default function useStoreUser() {
  const { loggedIn, myStoreUsers } = useAuth();
  const [allBranches] = useLazyQuery(AllBranchesDocument, {
    fetchPolicy: "no-cache",
  });
  const [myStoreUserBranches, setMyStoreUserBranches] = useState<Branch[]>();

  async function allBranchesForStoreUser(myStoreUsers: StoreUser[]) {
    const allStoreUserBranches: Branch[] = [];
    for (const storeUser of myStoreUsers) {
      if (!storeUser.store) continue;
      if (!storeUser.approved || !storeUser.userId) continue;

      if (storeUser.branch) {
        allStoreUserBranches.push({
          ...storeUser.branch,
          __typename: "Branch",
          store: { ...storeUser.store },
        });
        continue;
      }

      const { data: storeBranchesData } = await allBranches({
        variables: {
          storeId: storeUser.storeId,
          paginator: { page: 1, limit: 50 },
        },
      });
      if (!storeBranchesData) continue;

      const branches = storeBranchesData.allBranches.branches.map(
        (branch) =>
          ({
            ...branch,
            store: { ...storeUser.store },
          } as Branch)
      );
      allStoreUserBranches.push(...branches);
    }
    setMyStoreUserBranches(allStoreUserBranches);
  }

  useEffect(() => {
    if (!loggedIn) return;
    if (!myStoreUsers || myStoreUsers.length === 0) return;

    allBranchesForStoreUser(myStoreUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, myStoreUsers]);

  return myStoreUserBranches;
}
