"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdLocationPin, MdOutlineMyLocation } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useMemo, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import { useCurrentLocation } from "@/context/location-context";
import { useLazyQuery } from "@apollo/client/react";
import {
  Address,
  AddressAutocompleteDocument,
  AddressAutocompleteSuggestion,
  AddressFromLatLonDocument,
  AddressFromPlaceIdDocument,
} from "graphql-utils";
import { toast } from "sonner";
import convert from "convert-units";
import useLocationService from "@/hooks/useLocation";
import { CgSpinner } from "react-icons/cg";

export default function LocationDialogButton() {
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const { geocodeWithCallback } = useLocationService();
  const [open, setOpen] = useState(false);
  const [addressInput, setAddressInput] = useState(
    currentLocation?.fullAddress ?? "",
  );
  const [radiusInput, setRadiusInput] = useState(
    currentLocation?.locationInput.radiusMeters ?? 50,
  );
  const [suggestions, setSuggestions] = useState<
    AddressAutocompleteSuggestion[]
  >([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [getAddressSuggestions] = useLazyQuery(AddressAutocompleteDocument, {
    fetchPolicy: "cache-first",
  });
  const [addressFromPlaceId, { loading: addressFromPlaceIdLoading }] =
    useLazyQuery(AddressFromPlaceIdDocument);
  const [addressFromLatLon, { loading: addressFromLatLonLoading }] =
    useLazyQuery(AddressFromLatLonDocument);
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false)
  const [newSelectedAddress, setNewSelectedAddress] = useState<Address>();

  const debouncedFetch = useMemo(
    () => debounce(getAddressSuggestions, 300),
    [],
  );

  useEffect(() => {
    debouncedFetch({
      variables: {
        input: addressInput,
        locationBias: currentLocation
          ? {
              ...currentLocation?.locationInput,
            }
          : undefined,
      },
    })?.then(({ data }) => {
      if (!data) return;
      setSuggestions(data.addressAutocomplete);
    });
    return () => debouncedFetch.cancel();
  }, [addressInput, currentLocation, debouncedFetch]);

  useEffect(() => {
    setAddressInput(currentLocation?.fullAddress ?? "");
  }, [currentLocation?.fullAddress]);

  // close suggestions when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function selectSuggestion({
    addressText,
    placeId,
  }: AddressAutocompleteSuggestion) {
    setAddressInput(addressText);
    setSuggestions([]);
    addressFromPlaceId({
      variables: {
        placeId,
      },
    })
      .then(({ data }) => {
        if (!data) return;
        setNewSelectedAddress(data.addressFromPlaceId as Address);
      })
      .catch((err) => toast.error(err.message));
  }

  return (
    <>
      <Button
        size="xs"
        rounded
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        <MdLocationPin /> {currentLocation?.fullAddress?.split(",")[0]}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Change Location</DialogTitle>
            <DialogDescription className="text-gray-600 text-xs">
              Update the address and search radius for your current session.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-5">
            <div ref={containerRef} className="relative">
              <label className="text-sm font-medium" htmlFor="fullAddress">
                Address
              </label>
              <Input
                id="fullAddress"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                autoComplete="off"
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md max-h-60 overflow-auto">
                  {suggestions.map((s) => (
                    <li key={s.placeId}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent text-xs cursor-pointer"
                        onClick={() => selectSuggestion(s)}
                      >
                        {s.addressText}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <Button
                variant="link"
                size="xs"
                className="mt-1.5 text-pricetra-green-heavy-dark px-0"
                onClick={() => {
                  setCurrentLocationLoading(true);
                  geocodeWithCallback((location) => {
                    setCurrentLocationLoading(false);
                    if (!location) return;

                    addressFromLatLon({
                      variables: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      },
                    }).then(({ data }) => {
                      if (!data) return;
                      setNewSelectedAddress(data.addressFromLatLon as Address);
                      setAddressInput(data.addressFromLatLon.fullAddress);
                    });
                  });
                }}
                disabled={addressFromLatLonLoading || currentLocationLoading}
              >
                {currentLocationLoading ? <CgSpinner className="animate-spin" /> : <MdOutlineMyLocation />}
                Use current location
              </Button>
            </div>

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="pricetra"
                disabled={addressFromPlaceIdLoading || addressFromLatLonLoading}
                onClick={() => {
                  if (!currentLocation) return;

                  setCurrentLocation({
                    fullAddress: (newSelectedAddress ?? currentLocation)
                      .fullAddress,
                    locationInput: {
                      latitude: (
                        newSelectedAddress ?? currentLocation?.locationInput
                      ).latitude,
                      longitude: (
                        newSelectedAddress ?? currentLocation?.locationInput
                      ).longitude,
                      radiusMeters: Math.round(
                        convert(radiusInput).from("mi").to("m"),
                      ),
                    },
                  });
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
