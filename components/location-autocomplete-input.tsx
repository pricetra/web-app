import { useLazyQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CgSpinner } from "react-icons/cg";
import { MdOutlineMyLocation } from "react-icons/md";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Address,
  AddressAutocompleteDocument,
  AddressAutocompleteSuggestion,
  AddressFromLatLonDocument,
  AddressFromPlaceIdDocument,
  AddressFromRawStringDocument,
} from "graphql-utils";
import { toast } from "sonner";
import useLocationService from "@/hooks/useLocation";
import { cn } from "@/lib/utils";

export type LocationAutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress?: (address: Address) => void;
  onEnter?: (address: Address) => void | Promise<void>;
  showCurrentLocationButton?: boolean;
  label?: string;
  placeholder?: string;
  inputId?: string;
  locationBias?: {
    latitude: number;
    longitude: number;
  };
  disabled?: boolean;
};

export default function LocationAutocompleteInput({
  value,
  onChange,
  onSelectAddress,
  onEnter,
  showCurrentLocationButton = false,
  label,
  placeholder = "Ex. 123 Main St, Seattle, WA",
  inputId = "locationAddress",
  locationBias,
  disabled = false,
}: LocationAutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<
    AddressAutocompleteSuggestion[]
  >([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [getAddressSuggestions, { loading: suggestionsLoading }] = useLazyQuery(
    AddressAutocompleteDocument,
    {
      fetchPolicy: "cache-first",
    },
  );
  const [addressFromPlaceId, { loading: addressFromPlaceIdLoading }] =
    useLazyQuery(AddressFromPlaceIdDocument);
  const [addressFromText, { loading: addressFromTextLoading }] = useLazyQuery(
    AddressFromRawStringDocument,
  );
  const [addressFromLatLon, { loading: addressFromLatLonLoading }] =
    useLazyQuery(AddressFromLatLonDocument);
  const { geocodeWithCallback } = useLocationService();
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);

  const debouncedFetch = useMemo(
    () => debounce((variables) => getAddressSuggestions(variables), 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const addressLoading =
    addressFromPlaceIdLoading ||
    addressFromTextLoading ||
    addressFromLatLonLoading;

  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    debouncedFetch({
      variables: {
        input: value,
        locationBias,
      },
    })?.then(({ data }) => {
      if (!data) return;
      setSuggestions(data.addressAutocomplete ?? []);
    });

    return () => debouncedFetch.cancel();
  }, [value, locationBias, debouncedFetch]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    }

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function selectSuggestion({
    addressText,
    placeId,
  }: AddressAutocompleteSuggestion) {
    onChange(addressText);
    setSuggestionsOpen(false);

    try {
      const { data } = await addressFromPlaceId({
        variables: { placeId },
      });
      if (!data) return;
      const selectedAddress = data.addressFromPlaceId as Address;
      onSelectAddress?.(selectedAddress);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function selectTextAddress(fullAddress: string) {
    onChange(fullAddress);
    setSuggestionsOpen(false);

    try {
      const { data } = await addressFromText({
        variables: { fullAddress },
      });
      if (!data) return;
      const selectedAddress = data.addressFromRawString as Address;
      onSelectAddress?.(selectedAddress);
      if (selectedAddress && onEnter) {
        await onEnter(selectedAddress);
      }
      return selectedAddress;
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  function handleUseCurrentLocation() {
    setCurrentLocationLoading(true);
    geocodeWithCallback(async (location) => {
      setCurrentLocationLoading(false);

      if (!location) {
        toast.error("Unable to get current location.");
        return;
      }

      try {
        const { data } = await addressFromLatLon({
          variables: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });

        if (!data?.addressFromLatLon) {
          toast.error("Unable to resolve current location address.");
          return;
        }

        const selectedAddress = data.addressFromLatLon as Address;
        onChange(selectedAddress.fullAddress);
        setSuggestionsOpen(false);
        onSelectAddress?.(selectedAddress);
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-sm font-bold" htmlFor={inputId}>
          {label}
        </label>
      )}

      <Input
        id={inputId}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSuggestionsOpen(true);
        }}
        onFocus={() => setSuggestionsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            selectTextAddress(e.currentTarget.value);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
      />

      {(suggestionsOpen || suggestionsLoading) && (
        <ul
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md bg-background shadow-md max-h-60 overflow-auto",
            suggestions.length > 0 ? "border" : "border-none",
          )}
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.placeId}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-accent text-xs cursor-pointer"
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.addressText}
              </button>
            </li>
          ))}
          {suggestionsLoading && (
            <li className="px-3 py-2 text-xs text-gray-500 flex items-center gap-2">
              <CgSpinner className="animate-spin" /> Searching...
            </li>
          )}
          {suggestions.length === 0 &&
            !suggestionsLoading &&
            value.length > 0 && (
              <li className="px-3 py-2 text-xs text-gray-500">
                No suggestions found.
              </li>
            )}
        </ul>
      )}

      {(showCurrentLocationButton || addressLoading) && (
        <Button
          variant="link"
          size="xs"
          className="mt-1 text-pricetra-green-heavy-dark px-0"
          onClick={handleUseCurrentLocation}
          disabled={currentLocationLoading || addressLoading}
        >
          {currentLocationLoading || addressLoading ? (
            <CgSpinner className="animate-spin" />
          ) : (
            <MdOutlineMyLocation />
          )}
          Use current location
        </Button>
      )}
    </div>
  );
}
