"use client";

import { useLazyQuery } from "@apollo/client/react";
import { BarcodeScanDocument } from "graphql-utils";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import ScannerOverlay from "./scanner-overlay";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";

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

  useLayoutEffect(() => {
    setScannedCode(undefined);
  }, []);

  return (
    <>
      {processingBarcode ? (
        <div className="absolute z-10 flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-xl bg-black/50 px-10 py-7">
            <CgSpinner className="animate-spin text-white size-16" />
            <h3 className="mt-4 text-white">Processing Barcode</h3>
          </div>
        </div>
      ) : (
        <ScannerOverlay />
      )}

      <BarcodeScanner
        options={{ formats: ["upc_a", "upc_e", "ean_8", "ean_13"] }}
        onCapture={debouncedHandleBarcodeScan}
        paused={!!scannedCode}
      />

      <div className="absolute bottom-0 z-2 w-full rounded-t-3xl bg-black px-5 py-7 text-white">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-white">Scan Barcode</h1>

          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-3 text-white"
            size="lg"
          >
            <AiOutlineClose />
          </Button>
        </div>

        <div className="my-5">
          <p className="text-white">
            Point your camera at the product barcode to search
          </p>
        </div>
      </div>
    </>
  );
}
