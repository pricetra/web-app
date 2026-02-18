import useLocationService from "./useLocation";
import {
  BarcodeScanDocument,
  BarcodeScanQuery,
  ExtractAndCreateProductDocument,
  ExtractAndCreateProductMutation,
  LocationInput,
} from "graphql-utils";
import { convertFileToBase64 } from "@/lib/files";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";

export default function useAddProductPrompt() {
  const [barcodeScan, { loading: processingBarcode }] =
    useLazyQuery(BarcodeScanDocument);
  const [extractProductFields, { loading: extractingProduct }] = useMutation(
    ExtractAndCreateProductDocument,
  );
  const { geocodeWithCallback } = useLocationService();

  async function handleBarcodeScan(
    barcode: string,
    {
      onSuccess,
      onError,
    }: {
      onSuccess: (data: BarcodeScanQuery) => void;
      onError: (err: Error) => void;
    },
  ) {
    geocodeWithCallback((geoLocation) => {
      let locationInput: LocationInput | undefined = undefined;
      if (geoLocation) {
        locationInput = {
          latitude: geoLocation.coords.latitude,
          longitude: geoLocation.coords.longitude,
        };
      }

      barcodeScan({
        variables: {
          barcode,
          location: locationInput,
        },
      })
        .then(({ data }) => {
          if (!data) return;
          onSuccess(data);
        })
        .catch(onError);
    });
  }

  async function handleExtractionImage(
    file: File,
    barcode: string,
    {
      onSuccess,
      onError,
      onFinally,
    }: {
      onSuccess: (data: ExtractAndCreateProductMutation) => void;
      onError: (err: Error) => void;
      onFinally: () => void;
    },
  ) {
    const base64Image = await convertFileToBase64(file);
    if (!base64Image) {
      window.alert("Could not handle file to base64 conversion");
      return;
    }

    extractProductFields({
      variables: {
        barcode,
        base64Image: base64Image.toString(),
      },
    })
      .then(async ({ data }) => {
        if (!data) return;
        onSuccess(data);
      })
      .catch((err) => {
        toast.error(`Error extracting product data. ${err}`);
        onError(err)
      })
      .finally(onFinally);
  }

  return {
    handleBarcodeScan,
    handleExtractionImage,
    processingBarcode,
    extractingProduct,
  };
}
