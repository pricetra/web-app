import { Address, Branch, BulkAddBranchesToListDocument, FindBranchesByDistanceDocument, GetAllListsDocument, MeDocument, PostAuthUserDataDocument, UpdateProfileDocument, User } from "graphql-utils";
import { Button } from "@/components/ui/button";
import { GoLocation } from "react-icons/go";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Input } from "@/components/ui/input";
import { FiArrowRight } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { MdStorefront } from "react-icons/md";
import convert from "convert-units";
import { createCloudinaryUrl } from "@/lib/files";
import { MdCheck } from "react-icons/md";
import { useAuth } from "@/context/user-context";
import { startOfNextSundayUTC } from "@/lib/utils";

export enum WelcomePageType {
  WELCOME,
  ADDRESS,
  BRANCHES,
}

export type WelcomeScreenProps = {
  user: User;
};

export default function WelcomeScreen({user}: WelcomeScreenProps) {
  const { lists, setShowWelcomeScreen } = useAuth();
  const [page, setPage] = useState<WelcomePageType>(WelcomePageType.WELCOME);
  const [addressInput, setAddressInput] = useState<string>(
    user.address?.fullAddress ?? ""
  );
  const [updateProfile, { loading: profileLoading }] = useMutation(
    UpdateProfileDocument,
    { refetchQueries: [MeDocument] }
  );
  const [locating] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>();
  const [
    getBranches,
    { data: branchesData, loading: branchesLoading },
  ] = useLazyQuery(FindBranchesByDistanceDocument, { fetchPolicy: "no-cache" });
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [addBranchesToList] = useMutation(BulkAddBranchesToListDocument, {
    refetchQueries: [GetAllListsDocument, PostAuthUserDataDocument],
  });
  const [addingBranches, setAddingBranches] = useState(false);

  useEffect(() => {
    if (user.address && (lists?.favorites.branchList ?? []).length > 0) {
      setShowWelcomeScreen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.address, lists?.favorites?.branchList]);

  return (
    <div className="flex p-5 flex-col justify-center gap-5 w-full max-w-xl mx-auto min-h-screen">
      {page === WelcomePageType.WELCOME && (
        <div>
          <div className="w-full flex flex-row justify-start items-center mb-5">
            <Image
              src="/logo_black_color_dark_leaf.svg"
              className="w-[60px]"
              alt="Logo"
              width={100}
              height={100}
              priority
            />
          </div>

          <h1 className="text-4xl font-extrabold text-pricetra-green-dark">
            Welcome to Pricetra.
          </h1>

          <h1 className="text-4xl font-extrabold text-pricetra-green-heavy-dark mb-5">
            Let&apos;s Setup Your Account...
          </h1>

          <p className="mb-10 text-lg text-gray-800">
            In order to help you shop efficiently, we will need just a little
            more information from you. This won&apos;t take long.
          </p>

          <Button
            onClick={() => setPage(WelcomePageType.ADDRESS)}
            size="lg"
            variant="pricetra"
            className="font-bold"
          >
            <GoLocation />
            Add Your Address
          </Button>
        </div>
      )}

      {page === WelcomePageType.ADDRESS && (
        <div className="flex flex-col justify-center gap-5">
          <div className="flex items-center">
            <div className="flex size-[70px] items-center justify-center rounded-full bg-pricetra-green-heavy-dark/10 text-pricetra-green-heavy-dark">
              <GoLocation className="size-8" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-pricetraGreenHeavyDark">
            Add Your Home Address
          </h2>

          <p className="mb-5 text-base sm:text-lg text-gray-800">
            This let&apos;s us find prices closest to you without using you
            location services constantly.
          </p>

          <div>
            <div className="flex flex-row items-center gap-3">
              <Input
                placeholder="Enter you Zip Code or Full Address..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                disabled={profileLoading && locating}
                className="flex-1"
              />

              <Button
                onClick={() => {
                  updateProfile({
                    variables: {
                      input: { address: addressInput?.trim() },
                    },
                  }).then(({ data, error }) => {
                    if (!data || error || !data.updateProfile.address)
                      return window.alert(
                        "Could not save address. Perhaps your address is invalid."
                      );

                    const address = data.updateProfile.address as Address;
                    setNewAddress(address);
                    getBranches({
                      variables: {
                        lat: address.latitude,
                        lon: address.longitude,
                        radiusMeters: Math.round(
                          convert(10).from("mi").to("m")
                        ),
                      },
                    });
                    setPage(WelcomePageType.BRANCHES);
                  });
                }}
                variant="pricetra"
                disabled={
                  !addressInput ||
                  addressInput.trim().length <= 3 ||
                  profileLoading
                }
              >
                {profileLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  <FiArrowRight />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {page === WelcomePageType.BRANCHES && newAddress && (
        <div className="flex flex-col justify-center gap-5">
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

          <div>
            <div className="rounded-lg bg-gray-50 p-5">
              {branchesLoading && (
                <div className="flex flex-row items-center justify-center px-5 py-14">
                  <CgSpinner className="animate-spin size-10" />
                </div>
              )}
              {branchesData?.findBranchesByDistance?.length === 0 && (
                <div>
                  <p className="mb-3 text-lg font-semibold">
                    There aren&apos;t any stores located near you
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
                        ({ id }) => id === branch.id
                      );
                      if (foundBranch) {
                        setSelectedBranches((branches) =>
                          branches.filter(({ id }) => id !== branch.id)
                        );
                        return;
                      }
                      setSelectedBranches((branches) => {
                        const newArr = branches.filter(
                          ({ id }) => id !== branch.id
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
                          startOfNextSundayUTC(),
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

            <div className="flex flex-row items-center gap-3 mt-10 justify-between">
              <Button
                variant="outline"
                disabled={addingBranches}
                onClick={() => setPage(WelcomePageType.ADDRESS)}
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
                        return window.alert("There was an error while adding the selected branches to your favorites list. Please try again.");
                      setAddingBranches(false);
                    });
                  }}
                >
                  {addingBranches && (
                    <CgSpinner className="animate-spin" />
                  )}
                  Finish Setup
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
