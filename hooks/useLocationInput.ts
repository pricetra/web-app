import { DEFAULT_SEARCH_RADIUS, LocationInputWithFullAddress, useCurrentLocation } from "@/context/location-context";
import { IpToAddressDocument } from "@/graphql/types/graphql";
import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

const DEFAULT_LOCATION_INPUT: LocationInputWithFullAddress = {
  locationInput: {
    latitude: 41.7956366,
    longitude: -88.0206993,
    radiusMeters: DEFAULT_SEARCH_RADIUS,
  },
  fullAddress: "Downers Grove, IL 60515, USA"
}

export default function useLocationInput(ipAddress?: string): LocationInputWithFullAddress | undefined {
  const { currentLocation } = useCurrentLocation();
  const [locationInput, setLocationInput] = useState<LocationInputWithFullAddress>();
  const [getIpToAddress] = useLazyQuery(IpToAddressDocument, { fetchPolicy: "cache-first" });

  useEffect(() => {
    console.log(currentLocation, ipAddress)
    if (currentLocation) return;
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
      setLocationInput({
        fullAddress,
        locationInput: {
          latitude,
          longitude,
          radiusMeters: DEFAULT_SEARCH_RADIUS
        }
      })
    }).catch(() => setLocationInput(DEFAULT_LOCATION_INPUT))
  }, [currentLocation, ipAddress]);
  return locationInput;
}
