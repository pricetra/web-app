"use client";

import { useLazyQuery } from "@apollo/client/react";
import { BarcodeScanDocument } from "graphql-utils";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";

export default function MobileScanner() {
  const [scannedCode, setScannedCode] = useState<string>();
  const [barcodeScan, { loading: processingBarcode }] =
    useLazyQuery(BarcodeScanDocument);
  const debouncedHandleBarcodeScan = useMemo(
    () =>
      debounce(_handleBarcodeScan, 1000, { leading: true, trailing: false }),
    []
  );

  async function _handleBarcodeScan(
    barcodes: DetectedBarcode[],
    searchMode?: boolean
  ) {
    const barcodeObject = barcodes.at(0);
    if (!barcodeObject) return;

    const barcode = barcodeObject.rawValue;
    // const coords = await getCurrentLocation({});
    // const location = {
    //   latitude: coords.coords.latitude,
    //   longitude: coords.coords.longitude,
    //   radiusMeters: 6000, // ~3.7 miles
    // };

    setScannedCode(barcode);
    window.alert(barcode);
  }

  return (
    <BarcodeScanner
      options={{ formats: ["upc_a", "upc_e", "ean_8", "ean_13"] }}
      onCapture={debouncedHandleBarcodeScan}
    />
  );
}
