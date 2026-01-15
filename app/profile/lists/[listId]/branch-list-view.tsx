import BranchItemWithLogo, { BranchItemWithLogoLoading } from "@/components/branch-item-with-logo";
import { useQuery } from "@apollo/client/react";
import { Branch, GetAllBranchListsByListIdDocument, List } from "graphql-utils";

export type BranchListViewProps = {
  list: List;
};

export default function BranchListView({ list }: BranchListViewProps) {
  const { data, loading } = useQuery(GetAllBranchListsByListIdDocument, {
    fetchPolicy: "no-cache",
    variables: {
      listId: list.id,
    },
  });

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-10 gap-x-3">
        {!data || loading ? (
          Array(10)
            .fill(0)
            .map((_, j) => (
              <BranchItemWithLogoLoading key={`product-loading-${j}`} />
            ))
        ) : (
          <>
            {data.getAllBranchListsByListId.length > 0 ? (
              data.getAllBranchListsByListId.map((bList, i) => {
                if (!bList.branch) return <></>;

                const branch = { ...(bList.branch as Branch) };
                return (
                  <BranchItemWithLogo
                    branch={branch}
                    key={`product-${bList.id}-${branch.id}-${i}`}
                  />
                );
              })
            ) : (
              <p className="py-10 px-5 text-center">List is empty</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
