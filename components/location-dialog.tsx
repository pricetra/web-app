import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useCurrentLocation } from "@/context/location-context";
import { Address } from "graphql-utils";
import convert from "convert-units";
import LocationAutocompleteInput from "@/components/location-autocomplete-input";

export type LocationDialogProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function LocationDialog({ open, setOpen }: LocationDialogProps) {
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const [addressInput, setAddressInput] = useState(
    currentLocation?.fullAddress ?? "",
  );
  const [radiusInput, setRadiusInput] = useState(
    Math.round(
      convert(currentLocation?.locationInput.radiusMeters ?? 80467)
        .from("m")
        .to("mi"),
    ),
  );
  const [newSelectedAddress, setNewSelectedAddress] = useState<Address>();

  useEffect(() => {
    setAddressInput(currentLocation?.fullAddress ?? "");
  }, [currentLocation?.fullAddress]);

  function submit(address?: Address) {
    if (!currentLocation) return;

    const selected = address ?? newSelectedAddress ?? currentLocation;
    const locationInput =
      "locationInput" in selected
        ? selected.locationInput
        : {
            latitude: selected.latitude,
            longitude: selected.longitude,
          };

    setCurrentLocation({
      fullAddress: selected.fullAddress,
      locationInput: {
        latitude: locationInput.latitude,
        longitude: locationInput.longitude,
        radiusMeters: Math.round(convert(radiusInput).from("mi").to("m")),
      },
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Change Location</DialogTitle>
          <DialogDescription className="text-gray-600 text-xs">
            Update the address and search radius for your current session.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 my-5">
          <LocationAutocompleteInput
            value={addressInput}
            onChange={setAddressInput}
            onSelectAddress={(address) => {
              setNewSelectedAddress(address);
              setAddressInput(address.fullAddress);
            }}
            onEnter={(address) => {
              setNewSelectedAddress(address);
              submit(address);
            }}
            showCurrentLocationButton
            locationBias={
              currentLocation
                ? {
                    latitude: currentLocation.locationInput.latitude,
                    longitude: currentLocation.locationInput.longitude,
                  }
                : undefined
            }
            inputId="fullAddress"
            label="Address"
            placeholder="Ex. 123 Main St, Seattle, WA"
          />

          <div>
            <label className="text-sm font-medium" htmlFor="searchRadius">
              Search radius (mi)
            </label>
            <Input
              value={radiusInput}
              onChange={(e) => setRadiusInput(parseInt(e.target.value))}
              type="number"
              id="searchRadius"
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end gap-2 mt-5">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button size="sm" variant="pricetra" onClick={() => submit()}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
