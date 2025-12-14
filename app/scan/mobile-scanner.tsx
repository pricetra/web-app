"use client";

import { useLazyQuery } from "@apollo/client/react";
import { BarcodeScanDocument } from "graphql-utils";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import ScannerOverlay from "./scanner-overlay";

export default function MobileScanner() {
  const router = useRouter();
  const [scannedCode, setScannedCode] = useState<string>();
  const [barcodeScan, { loading: processingBarcode }] =
    useLazyQuery(BarcodeScanDocument);
  const debouncedHandleBarcodeScan = useMemo(
    () =>
      debounce(_handleBarcodeScan, 1000, { leading: true, trailing: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function _handleBarcodeScan(barcodes: DetectedBarcode[]) {
    if (barcodes.length === 0) return;
    if (scannedCode) return;

    const barcodeObject = barcodes.at(0);
    if (!barcodeObject) return;

    const barcode = barcodeObject.rawValue;
    setScannedCode(barcode);
    barcodeScan({
      variables: {
        barcode,
      },
    })
      .then(({ data }) => {
        if (!data) return;
        router.push(`/products/${data.barcodeScan.id}`);
      })
      .finally(() => {
        setScannedCode(undefined);
      });
  }

  return (
    <>
      <ScannerOverlay />

      {processingBarcode && (
        <div className="bg-black/50 absolute top-0 left-0 z-1"></div>
      )}

      <BarcodeScanner
        options={{ formats: ["upc_a", "upc_e", "ean_8", "ean_13"] }}
        onCapture={debouncedHandleBarcodeScan}
        paused
      />
    </>
  );
}
