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
import { getGoogleMapsPredictions, GoogleMapsAutocompletePlacePrediction, GoogleMapsAutocompleteSuggestion } from "@/lib/google-maps-api";

export default function LocationDialogButton() {
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const [open, setOpen] = useState(false);
  const [addressInput, setAddressInput] = useState(currentLocation?.fullAddress ?? "");
  const [suggestions, setSuggestions] = useState<GoogleMapsAutocompleteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const debouncedFetch = useMemo(() => debounce(getGoogleMapsPredictions, 300), []);

  useEffect(() => {
    debouncedFetch(addressInput, currentLocation)?.then(data => setSuggestions(data));
    return () => debouncedFetch.cancel();
  }, [addressInput, debouncedFetch]);

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

  function selectSuggestion(s: GoogleMapsAutocompletePlacePrediction) {
    setAddressInput(s.text.text);
    setSuggestions([]);
    // TODO: later fetch place details and setCurrentLocation
  }

  return (
    <>
      <Button size="xs" rounded variant="secondary" onClick={() => setOpen(true)}>
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
                    <li key={s.placePrediction.placeId}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent text-xs"
                        onClick={() => selectSuggestion(s.placePrediction)}
                      >
                        {s.placePrediction.text.text}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <Button variant="link" size="xs" className="mt-1.5 text-pricetra-green-heavy-dark px-0">
                <MdOutlineMyLocation />
                Use current location
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="searchRadius">
                Search radius (mi)
              </label>
              <Input defaultValue="10" type="number" id="searchRadius" />
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full justify-end gap-2 mt-5">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="pricetra">
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
