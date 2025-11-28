import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from './user-context';
import { LocationInput } from "graphql-utils/types/graphql";

export const DEFAULT_SEARCH_RADIUS = 160_934; // ~100 miles

export type LocationInputWithFullAddress = {
  locationInput: LocationInput;
  fullAddress: string;
};

export type LocationContextType = {
  currentLocation?: LocationInputWithFullAddress;
  locationSetInProgress: boolean;
  setCurrentLocation: (location?: LocationInputWithFullAddress) => void;
  resetCurrentLocation: () => LocationInputWithFullAddress | undefined;
};

export const LocationContext = createContext({} as LocationContextType);

export type LocationContextProviderProps = {
  children: ReactNode;
};

export default function LocationContextProvider({
  children,
}: LocationContextProviderProps) {
  const { token, user } = useAuth();
  const [currentLocation, setCurrentLocation] =
    useState<LocationInputWithFullAddress>();
  const [locationSetInProgress, setLocationSetInProgress] = useState(true);

  function resetCurrentLocation() {
    if (!user?.address) return;

    const newLocation = {
      locationInput: {
        latitude: user.address?.latitude,
        longitude: user.address?.longitude,
        radiusMeters: DEFAULT_SEARCH_RADIUS,
      },
      fullAddress: user.address.fullAddress,
    } as LocationInputWithFullAddress;
    setCurrentLocation(newLocation);
    return newLocation;
  }

  useEffect(() => {
    if (token) return;
    setLocationSetInProgress(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationSetInProgress]);

  useEffect(() => {
    resetCurrentLocation();
    setLocationSetInProgress(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.address]);

  if (user && !user.address) {
    // TODO: Add location setup screen
  }

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        locationSetInProgress,
        setCurrentLocation: (l) => {
          if (!l) return resetCurrentLocation();
          setCurrentLocation(l);
        },
        resetCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useCurrentLocation = () => useContext(LocationContext);
