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
  AddressFromPlaceIdDocument,
  AddressFromRawStringDocument,
} from "graphql-utils";
import { toast } from "sonner";

export type LocationAutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress?: (address: Address) => void;
  onEnter?: (address: Address) => void | Promise<void>;
  onUseCurrentLocation?: () => void;
  showCurrentLocationButton?: boolean;
  currentLocationLoading?: boolean;
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
  onUseCurrentLocation,
  showCurrentLocationButton = false,
  currentLocationLoading = false,
  label = "Address",
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

  const [getAddressSuggestions, { loading: suggestionsLoading }] =
    useLazyQuery(AddressAutocompleteDocument, {
      fetchPolicy: "cache-first",
    });
  const [addressFromPlaceId, { loading: addressFromPlaceIdLoading }] =
    useLazyQuery(AddressFromPlaceIdDocument);
  const [addressFromText, { loading: addressFromTextLoading }] =
    useLazyQuery(AddressFromRawStringDocument);

  const debouncedFetch = useMemo(
    () => debounce((variables) => getAddressSuggestions(variables), 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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

  async function selectSuggestion({ addressText, placeId }: AddressAutocompleteSuggestion) {
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

  return (
    <div ref={containerRef} className="relative">
      <label className="text-sm font-medium" htmlFor={inputId}>
        {label}
      </label>
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
        <ul className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md max-h-60 overflow-auto">
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
          {suggestions.length === 0 && !suggestionsLoading && value.length > 0 && (
            <li className="px-3 py-2 text-xs text-gray-500">No suggestions found.</li>
          )}
        </ul>
      )}

      {(addressFromPlaceIdLoading || addressFromTextLoading) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <CgSpinner className="animate-spin" /> Resolving address...
        </div>
      )}

      {showCurrentLocationButton && onUseCurrentLocation && (
        <Button
          variant="link"
          size="xs"
          className="mt-3 text-pricetra-green-heavy-dark px-0"
          onClick={onUseCurrentLocation}
          disabled={currentLocationLoading}
        >
          {currentLocationLoading ? (
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
