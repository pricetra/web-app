import { Button } from "@/components/ui/button";
import { MdLocationPin } from "react-icons/md";
import { useState } from "react";
import { useCurrentLocation } from "@/context/location-context";
import LocationDialog from "./location-dialog";

export default function LocationDialogButton() {
  const { currentLocation } = useCurrentLocation();
  const [open, setOpen] = useState(false);

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

      <LocationDialog open={open} setOpen={setOpen} />
    </>
  );
}
