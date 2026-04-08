"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
import { AllStoresDocument } from "graphql-utils";
import { useLazyQuery } from "@apollo/client/react";
import { createCloudinaryUrl } from "@/lib/files";
import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { MdAdd } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";

export default function StoresClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [getAllStores, { data, loading }] = useLazyQuery(AllStoresDocument);

  useEffect(() => {
    getAllStores({
      variables: {
        search,
        paginator: { limit: 20, page },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const stores = data?.allStores.stores ?? [];
  const paginator = data?.allStores.paginator;

  return (
    <div className="w-full max-w-[1000px] flex-1 px-5">
      <div className="flex flex-row items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Stores</h1>
        <Button variant="pricetra" size="sm" href="/admin/stores/new">
          <MdAdd /> New Store
        </Button>
      </div>

      <InputGroup>
        <InputGroupInput
          placeholder="Search stores..."
          value={search}
          onChange={(v) => {
            setSearch(v.target.value);
            setPage(1);
          }}
        />
        <InputGroupAddon>
          {!loading ? (
            <IoIosSearch />
          ) : (
            <CgSpinner className="animate-spin" />
          )}
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {paginator?.total}
        </InputGroupAddon>
      </InputGroup>

      <div className="mt-5 flex flex-col gap-2">
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/admin/stores/${store.slug}`}
            className="flex flex-row items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Image
              src={createCloudinaryUrl(store.logo, 300, 300)}
              className="size-10 rounded-md"
              alt={store.name}
              width={300}
              height={300}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{store.name}</h3>
              <p className="text-sm text-gray-500 truncate">{store.website}</p>
            </div>
            <FaAngleRight className="size-4 text-gray-400" />
          </Link>
        ))}
      </div>

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
