"use client";

import { useQuery } from "@apollo/client/react";
import { AllBranchesDocument, Store } from "graphql-utils";
import { CgSpinner } from "react-icons/cg";
import { MdStorefront } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import Link from "@/components/ui/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ManageBranchList({
  store,
  branchHref,
}: {
  store: Store;
  branchHref: (branchSlug: string) => string;
}) {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(AllBranchesDocument, {
    variables: {
      storeSlug: store.slug,
      paginator: { limit: 20, page },
    },
  });

  const branches = data?.allBranches.branches ?? [];
  const paginator = data?.allBranches.paginator;

  if (loading) {
    return (
      <div className="w-full py-10 flex justify-center">
        <CgSpinner className="animate-spin size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {branches.map((branch) => (
        <Link
          key={branch.id}
          href={branchHref(branch.slug)}
          className="flex flex-row items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <MdStorefront className="size-5 text-gray-500" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{branch.name}</h3>
            <p className="text-sm text-gray-500 truncate">
              {branch.address?.fullAddress ??
                branch.onlineAddress?.url ??
                branch.type}
            </p>
          </div>
          <FaAngleRight className="size-4 text-gray-400" />
        </Link>
      ))}

      {branches.length === 0 && (
        <p className="text-sm text-gray-500 py-5 text-center">
          No branches yet.
        </p>
      )}

      {paginator && paginator.numPages > 1 && (
        <div className="flex flex-row items-center justify-center gap-3 mt-5">
          <Button
            variant="outline"
            size="sm"
            disabled={!paginator.prev}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {paginator.page} of {paginator.numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!paginator.next}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
