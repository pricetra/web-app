import { useEffect, useState } from "react";

export type GeolocationCallback = (l?: GeolocationPosition) => void

export default function useLocationService() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((l) => {
      setPermissionGranted(true);
      setLocation(l)
    }, () => {
      setPermissionGranted(false);
      setLocation(undefined)
    });
  }, []);

  function getCurrentGeocodeAddress() {
    navigator.geolocation.getCurrentPosition((l) => {
      setPermissionGranted(true);
      setLocation(l)
    }, () => {
      setPermissionGranted(false);
      setLocation(undefined)
    });
  }

  function watchLocation(cb: GeolocationCallback) {
    navigator.geolocation.watchPosition((l) => {
      cb(l);
      setLocation(l);
    }, () => {
      cb(undefined);
      setLocation(undefined);
    })
  }

  function geocodeWithCallback(cb: GeolocationCallback) {
    navigator.geolocation.getCurrentPosition((l) => {
      setPermissionGranted(true);
      setLocation(l);
      cb(l)
    }, () => {
      setPermissionGranted(false);
      setLocation(undefined)
      cb(undefined);
    });
  }

  return {
    location,
    permissionGranted,
    watchLocation,
    getCurrentGeocodeAddress,
    geocodeWithCallback,
  };
}
