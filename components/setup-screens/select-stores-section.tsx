import {
  Address,
  Branch,
  BulkAddBranchesToListDocument,
  FindBranchesByDistanceDocument,
  GetAllListsDocument,
  PostAuthUserDataDocument,
} from "graphql-utils";
import { Button } from "../ui/button";
import { MdCheck, MdStorefront } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import convert from "convert-units";
import { createCloudinaryUrl } from "@/lib/files";
import { UserListsType } from "@/context/user-context";

const BRANCH_SEARCH_RADIUS_MI = 10;

export type SelectStoreSectionProps = {
  newAddress: Address;
  back: () => void;
  lists?: UserListsType;
};

export default function SelectStoreSection({
  newAddress,
  back,
  lists,
}: SelectStoreSectionProps) {
  const { data: branchesData, loading: branchesLoading } = useQuery(
    FindBranchesByDistanceDocument,
    {
      variables: {
        lat: newAddress.latitude,
        lon: newAddress.longitude,
        radiusMeters: Math.round(
          convert(BRANCH_SEARCH_RADIUS_MI).from("mi").to("m"),
        ),
      },
      fetchPolicy: "no-cache",
    },
  );
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [addBranchesToList] = useMutation(BulkAddBranchesToListDocument, {
    refetchQueries: [GetAllListsDocument, PostAuthUserDataDocument],
  });
  const [addingBranches, setAddingBranches] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-5 max-w-3xl mx-auto">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center">
          <div className="flex size-[70px] items-center justify-center rounded-full bg-pricetra-green-heavy-dark/10 text-pricetra-green-heavy-dark">
            <MdStorefront className="size-8" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-pricetraGreenHeavyDark">
          Select Nearby Places You Like to Shop
        </h2>

        <p className="mb-5 text-base sm:text-lg text-gray-800">
          {newAddress.fullAddress}
        </p>
      </div>

      <div className="flex-2">
        <div className="rounded-lg bg-gray-50 border border-gray-200 relative">
          <div className="p-5">
            {branchesLoading && (
              <div className="flex flex-row items-center justify-center px-5 py-14">
                <CgSpinner className="animate-spin size-10" />
              </div>
            )}
            {branchesData?.findBranchesByDistance?.length === 0 && (
              <div>
                <p className="mb-3 text-lg font-semibold">
                  {`There aren't any stores located near you`}
                </p>

                <p>
                  We are constantly adding new stores and will alert you when
                  new locations are added.
                </p>
              </div>
            )}
            {branchesData &&
              branchesData.findBranchesByDistance.map((branch) => (
                <div
                  onClick={() => {
                    const foundBranch = selectedBranches.find(
                      ({ id }) => id === branch.id,
                    );
                    if (foundBranch) {
                      setSelectedBranches((branches) =>
                        branches.filter(({ id }) => id !== branch.id),
                      );
                      return;
                    }
                    setSelectedBranches((branches) => {
                      const newArr = branches.filter(
                        ({ id }) => id !== branch.id,
                      );
                      newArr.push(branch as Branch);
                      return newArr;
                    });
                  }}
                  className="mb-7 flex flex-row justify-between cursor-pointer"
                  key={branch.id}
                >
                  <div className="flex flex-1 flex-row items-center gap-2">
                    <Image
                      src={createCloudinaryUrl(
                        branch.store?.logo ?? "",
                        100,
                        100,
                      )}
                      width={100}
                      height={100}
                      quality={100}
                      alt={branch.name}
                      className="size-[35px] rounded-lg"
                    />
                    <div>
                      <h4 className="text font-semibold">
                        {branch.store?.name}
                      </h4>
                      <p className="text-xs">{branch.address?.fullAddress}</p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-center">
                    {selectedBranches.find(({ id }) => id === branch.id) && (
                      <MdCheck className="size-6 text-pricetra-green-heavy-dark" />
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-white sticky bottom-0 border-gray-200 border-t rounded-b-lg">
            <div className="flex flex-row items-center gap-3 px-5 py-3 justify-between">
              <Button
                variant="outline"
                disabled={addingBranches}
                onClick={back}
              >
                Back
              </Button>

              <Button
                variant="pricetra"
                disabled={selectedBranches.length === 0 || addingBranches}
                onClick={async () => {
                  setAddingBranches(true);
                  addBranchesToList({
                    variables: {
                      listId: lists!.favorites.id,
                      branchIds: selectedBranches.map(({ id }) => id),
                    },
                  }).then(({ data }) => {
                    if (!data)
                      return window.alert(
                        "There was an error while adding the selected branches to your favorites list. Please try again.",
                      );
                    setAddingBranches(false);
                  });
                }}
              >
                {addingBranches && <CgSpinner className="animate-spin" />}
                Finish Setup
              </Button>
            </div>
          </div>
        </div>

        <div style={{ height: "10vh" }} />
      </div>
    </div>
  );
}
