import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
import { AllStoresDocument, Store } from "graphql-utils";
import { useLazyQuery } from "@apollo/client/react";
import { createCloudinaryUrl } from "@/lib/files";
import { cn } from "@/lib/utils";

export type SelectStoreProps = {
  onSelectStore: (store: Store) => void;
  selectedStoreId?: number;
};

export default function SelectStore({
  onSelectStore,
  selectedStoreId,
}: SelectStoreProps) {
  const [searchStoreValue, setSearchStoreValue] = useState("");
  const [getAllStores, { data: storesData, loading: storesLoading }] =
    useLazyQuery(AllStoresDocument);

  useEffect(() => {
    getAllStores({
      variables: {
        search: searchStoreValue,
        paginator: {
          limit: 11,
          page: 1,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStoreValue]);

  return (
    <div>
      <InputGroup>
        <InputGroupInput
          placeholder="Search Store"
          value={searchStoreValue}
          onChange={(v) => setSearchStoreValue(v.target.value)}
        />
        <InputGroupAddon>
          {!storesLoading ? (
            <IoIosSearch />
          ) : (
            <CgSpinner className="animate-spin" />
          )}
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {storesData?.allStores.paginator?.total}
        </InputGroupAddon>
      </InputGroup>

      <h4 className="mt-3 font-bold">Select store</h4>
      <div className="mt-3 flex flex-row flex-wrap gap-3 items-center">
        {storesData &&
          storesData.allStores.stores.map((store) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                onSelectStore(store);
              }}
              className="cursor-pointer"
              key={store.id}
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-2 p-2 rounded-sm",
                  store.id === selectedStoreId ? "bg-gray-100" : "bg-white",
                )}
              >
                <Image
                  src={createCloudinaryUrl(store.logo, 300, 300)}
                  className="size-10 rounded-md"
                  alt={store.logo}
                  width={300}
                  height={300}
                />
                <h3 className="text-xs max-w-14 sm:max-w-20 truncate">
                  {store.name}
                </h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
