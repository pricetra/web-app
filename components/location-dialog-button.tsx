import { Button, ButtonProps } from "@/components/ui/button";
import { MdLocationPin } from "react-icons/md";
import { useState } from "react";
import { useCurrentLocation } from "@/context/location-context";
import LocationDialog from "./location-dialog";
import convert from "convert-units";
import { LuDot } from "react-icons/lu";
import { IoMdArrowDropdown } from "react-icons/io";

export type LocationDialogButtonProps = {
  size?: ButtonProps["size"];
};

export default function LocationDialogButton({
  size,
}: LocationDialogButtonProps) {
  const { currentLocation } = useCurrentLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size={size ?? "xs"}
        rounded
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        <MdLocationPin />{" "}
        <div className="flex flex-row items-center">
          <span>{currentLocation?.fullAddress?.split(",")[0]}</span>
          {currentLocation?.locationInput.radiusMeters && (
            <>
              <LuDot />
              <span>
                {Math.round(
                  convert(currentLocation.locationInput.radiusMeters)
                    .from("m")
                    .to("mi"),
                )}{" "}
                mi
              </span>
            </>
          )}
        </div>
        <IoMdArrowDropdown className="-mr-1" />
      </Button>

      <LocationDialog open={open} setOpen={setOpen} />
    </>
  );
}
