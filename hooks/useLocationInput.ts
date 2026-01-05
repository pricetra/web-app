import { LocationInputWithFullAddress, useCurrentLocation } from "@/context/location-context";
import { IpToAddressDocument } from "graphql-utils";
import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

const DEFAULT_LOCATION_INPUT: LocationInputWithFullAddress = {
  locationInput: {
    latitude: 41.8105301,
    longitude: -88.0414555,
  },
  fullAddress: "Downers Grove, IL 60515, USA"
}

export default function useLocationInput(ipAddress?: string): LocationInputWithFullAddress | undefined {
  const { currentLocation, locationSetInProgress, setCurrentLocation } = useCurrentLocation();
  const [locationInput, setLocationInput] = useState<LocationInputWithFullAddress>();
  const [getIpToAddress] = useLazyQuery(IpToAddressDocument, { fetchPolicy: "cache-first" });

  useEffect(() => {
    if (locationSetInProgress) return;

    if (currentLocation) {
      setLocationInput(currentLocation);
      return;
    }

    if (!ipAddress) {
      setLocationInput(DEFAULT_LOCATION_INPUT);
      return;
    }

    getIpToAddress({ variables: { ipAddress } }).then(({ data, error }) => {
      if (!data || error) {
        setLocationInput(DEFAULT_LOCATION_INPUT)
        return;
      }

      const { fullAddress, latitude, longitude } = data.ipToAddress;
      const newLocationInput: LocationInputWithFullAddress = {
        fullAddress,
        locationInput: {
          latitude,
          longitude,
        }
      };
      setLocationInput({...newLocationInput});
      setCurrentLocation({...newLocationInput});
    }).catch(() => setLocationInput(DEFAULT_LOCATION_INPUT))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, ipAddress, locationSetInProgress]);
  return locationInput;
}
