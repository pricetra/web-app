import { useLazyQuery } from "@apollo/client/react";
import { StoreSlugAvailabilityDocument } from "graphql-utils";
import _ from "lodash";
import { useCallback } from "react";

export default function useStoreNameAvailability() {
  const [
    storeSlugAvailability,
    { data: storeAvailabilityData, loading: storeAvailabilityLoading },
  ] = useLazyQuery(StoreSlugAvailabilityDocument);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedStoreAvailability = useCallback(
    _.debounce((store: string) => {
      storeSlugAvailability({ variables: { store } });
    }, 300),
    [],
  );

  return {
    debouncedCheckStoreNameAvailability: debouncedStoreAvailability,
    storeNameAvailable: storeAvailabilityData?.storeSlugAvailability,
    storeNameAvailabilityLoading: storeAvailabilityLoading,
  };
}
