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
import { useState } from "react";
import useLocationService from "@/hooks/useLocation";
import { useCurrentLocation } from "@/context/location-context";

export default function LocationDialogButton() {
  const {currentLocation, setCurrentLocation} = useCurrentLocation();
  const [open, setOpen] = useState(false);
  const {} = useLocationService()

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
            <div>
              <label className="text-sm font-medium" htmlFor="fullAddress">Address</label>
              <Input defaultValue={currentLocation?.fullAddress ?? ""} id="fullAddress" />
              <Button variant="link" size="xs" className="mt-1.5 text-pricetra-green-heavy-dark px-0">
                <MdOutlineMyLocation />
                Use current location
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="searchRadius">Search radius (mi)</label>
              <Input defaultValue="10" type="number" id="searchRadius" />
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full justify-end gap-2 mt-5">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="pricetra">Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
