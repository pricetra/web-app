import BranchItemWithLogo, {
  BranchItemWithLogoLoading,
} from "@/components/branch-item-with-logo";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useQuery } from "@apollo/client/react";
import { Branch, GetAllBranchListsByListIdDocument, List } from "graphql-utils";
import { HiInboxStack } from "react-icons/hi2";

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

  if (data && data.getAllBranchListsByListId.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HiInboxStack />
          </EmptyMedia>
          <EmptyTitle>Your Branch List is Empty</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

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
            {data.getAllBranchListsByListId.map((bList, i) => {
              if (!bList.branch) return <></>;

              const branch = { ...(bList.branch as Branch) };
              return (
                <BranchItemWithLogo
                  branch={branch}
                  key={`product-${bList.id}-${branch.id}-${i}`}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
