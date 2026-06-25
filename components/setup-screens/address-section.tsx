import { GoLocation } from "react-icons/go";
import LocationAutocompleteInput from "../location-autocomplete-input";
import { Button } from "../ui/button";
import { FiArrowRight } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Address,
  MeDocument,
  UpdateProfileDocument,
  User,
} from "graphql-utils";
import { toast } from "sonner";

export type AddressSectionProps = {
  user: User;
  next: (address: Address) => void;
};

export default function AddressSection({ user, next }: AddressSectionProps) {
  const [addressInput, setAddressInput] = useState<string>(
    user.address?.fullAddress ?? "",
  );
  const [updateProfile, { loading: profileLoading }] = useMutation(
    UpdateProfileDocument,
    { refetchQueries: [MeDocument] },
  );
  const [locating] = useState(false);

  function submitAddress(address: string) {
    updateProfile({
      variables: {
        input: { address: address.trim() },
      },
    }).then(({ data, error }) => {
      if (!data || error || !data.updateProfile.address) {
        return toast.error(
          "Could not save address. Perhaps your address is invalid.",
        );
      }

      const address = data.updateProfile.address as Address;
      next(address);
    });
  }

  return (
    <div className="flex flex-col justify-center gap-5 max-w-xl mx-auto">
      <div className="flex items-center">
        <div className="flex size-[70px] items-center justify-center rounded-full bg-pricetra-green-heavy-dark/10 text-pricetra-green-heavy-dark">
          <GoLocation className="size-8" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-pricetraGreenHeavyDark">
        Add Your Home Address
      </h2>

      <p className="mb-5 text-base sm:text-lg text-gray-800">
        {`This let's us find prices closest to you without using you
            location services constantly.`}
      </p>

      <div>
        <div className="flex flex-row items-center gap-3">
          <div className="flex-1">
            <LocationAutocompleteInput
              value={addressInput}
              onChange={(v) => setAddressInput(v)}
              disabled={profileLoading && locating}
              onSelectAddress={(a) => setAddressInput(a.fullAddress)}
              onEnter={(a) => {
                setAddressInput(a.fullAddress);
                submitAddress(a.fullAddress);
              }}
              placeholder="Enter your Zip Code or Full Address..."
            />
          </div>

          <Button
            onClick={() => submitAddress(addressInput)}
            variant="pricetra"
            disabled={
              !addressInput || addressInput.trim().length <= 3 || profileLoading
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
  );
}
