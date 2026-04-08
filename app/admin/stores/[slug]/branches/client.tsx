"use client";

import { useQuery } from "@apollo/client/react";
import { AllBranchesDocument, FindStoreDocument } from "graphql-utils";
import { CgSpinner } from "react-icons/cg";
import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { MdAdd, MdStorefront } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { useState } from "react";

export type BranchesClientProps = {
  storeSlug: string;
};

export default function BranchesClient({ storeSlug }: BranchesClientProps) {
  const [page, setPage] = useState(1);
  const { data: storeData, loading: storeLoading } = useQuery(
    FindStoreDocument,
    { variables: { storeSlug } },
  );
  const { data: branchesData, loading: branchesLoading } = useQuery(
    AllBranchesDocument,
    {
      variables: {
        storeSlug,
        paginator: { limit: 20, page },
      },
    },
  );

  if (storeLoading || !storeData) {
    return (
      <div className="w-full py-10 flex justify-center">
        <CgSpinner className="animate-spin size-10" />
      </div>
    );
  }

  const store = storeData.findStore;
  const branches = branchesData?.allBranches.branches ?? [];
  const paginator = branchesData?.allBranches.paginator;

  return (
    <div className="w-full max-w-[1000px] flex-1 px-5">
      <div className="flex flex-row items-center gap-4 mb-5">
        <Link href={`/admin/stores/${storeSlug}`}>
          <Image
            src={createCloudinaryUrl(store.logo, 300, 300)}
            className="size-10 rounded-md"
            alt={store.name}
            width={300}
            height={300}
          />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-gray-500">
            <Link href={`/admin/stores/${storeSlug}`} className="hover:underline">
              {store.name}
            </Link>
          </p>
          <h1 className="text-xl font-bold">Branches</h1>
        </div>
        <Button variant="pricetra" size="sm" href={`/admin/stores/${storeSlug}/branches/new`}>
          <MdAdd /> New Branch
        </Button>
      </div>

      {branchesLoading ? (
        <div className="w-full py-10 flex justify-center">
          <CgSpinner className="animate-spin size-10" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {branches.map((branch) => (
            <Link
              key={branch.id}
              href={`/stores/${store.slug}/${branch.slug}`}
              className="flex flex-row items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MdStorefront className="size-5 text-gray-500" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{branch.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {branch.address?.fullAddress ?? branch.onlineAddress?.url ?? branch.type}
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
        </div>
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
