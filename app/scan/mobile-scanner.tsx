"use client";

import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  BarcodeScanDocument,
  ExtractAndCreateProductDocument,
  LocationInput,
} from "graphql-utils";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import ScannerOverlay from "./scanner-overlay";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { FiCamera } from "react-icons/fi";
import {
  allowedImageTypes,
  allowedImageTypesString,
} from "@/constants/uploads";
import { convertFileToBase64 } from "@/lib/files";
import useLocationService from "@/hooks/useLocation";
import { MdKeyboard } from "react-icons/md";
import ManualBarcodeForm from "./components/manual-barcode-form";

export default function MobileScanner() {
  const router = useRouter();
  const [scannedCode, setScannedCode] = useState<string>();
  const [barcodeScan, { loading: processingBarcode }] =
    useLazyQuery(BarcodeScanDocument);
  const debouncedHandleBarcodeScan = useMemo(
    () => debounce(_handleBarcodeScan, 500, { leading: true, trailing: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [openAddUpcModal, setOpenAddUpcModal] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [extractProductFields, { loading: extractingProduct }] = useMutation(
    ExtractAndCreateProductDocument,
  );
  const { geocodeWithCallback } = useLocationService();
  const [openManualBarcodeModal, setOpenManualBarcodeModal] = useState(false);

  const modalActivated = openAddUpcModal || openManualBarcodeModal;

  async function _handleBarcodeScan(barcodes: DetectedBarcode[]) {
    if (barcodes.length === 0) return;
    if (scannedCode) return;

    const barcodeObject = barcodes.at(0);
    if (!barcodeObject) return;

    geocodeWithCallback((geoLocation) => {
      let locationInput: LocationInput | undefined = undefined;
      if (geoLocation) {
        locationInput = {
          latitude: geoLocation.coords.latitude,
          longitude: geoLocation.coords.longitude,
        };
      }
      const barcode = barcodeObject.rawValue;
      setScannedCode(barcode);
      barcodeScan({
        variables: {
          barcode,
          location: locationInput,
        },
      })
        .then(({ data }) => {
          if (!data) return;

          setScannedCode(undefined);
          const params = new URLSearchParams();
          if (data.barcodeScan.stock) {
            params.set("stockId", String(data.barcodeScan.stock.id));
          }
          router.push(
            `/products/${data.barcodeScan.id}${params.size > 0 ? `?${params.toString()}` : ""}`,
          );
        })
        .catch(() => setOpenAddUpcModal(true));
    });
  }

  async function handleExtractionImage(file: File, barcode: string) {
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
        if (!data) throw new Error("could not extract data");

        router.push(`/products/${data.extractAndCreateProduct.id}`);
      })
      .catch((err) => {
        window.alert(`Error extracting product data. ${err}`);
      })
      .finally(() => {
        setScannedCode(undefined);
        setOpenAddUpcModal(false);
      });
  }

  useLayoutEffect(() => {
    setScannedCode(undefined);
  }, []);

  return (
    <>
      {scannedCode && (
        <Dialog
          modal
          open={openAddUpcModal}
          defaultOpen={openAddUpcModal}
          onOpenChange={(o) => setOpenAddUpcModal(o)}
        >
          <DialogContent clickableOverlay={false}>
            <DialogHeader>
              <DialogTitle className="mb-5">Add UPC</DialogTitle>
              <DialogDescription>
                The barcode ({scannedCode}) you scanned does not exist in our
                database.
              </DialogDescription>
              <DialogDescription>
                You can help us record and track prices for this product by
                taking a picture.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setScannedCode(undefined);
                    setOpenAddUpcModal(false);
                  }}
                  disabled={extractingProduct}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                disabled={extractingProduct}
                onClick={() => {
                  imageUploadRef.current?.click();
                }}
              >
                {extractingProduct ? (
                  <>
                    <CgSpinner className="animate-spin" />
                    Extracting Image Data
                  </>
                ) : (
                  <>
                    <FiCamera />
                    Take Picture
                  </>
                )}
              </Button>

              <div className="hidden">
                <input
                  ref={imageUploadRef}
                  type="file"
                  accept={allowedImageTypesString}
                  onChange={async (e) => {
                    const files = e.target.files;
                    const file = files?.item(0);
                    if (!file) return;
                    if (!allowedImageTypes.includes(file.type)) {
                      window.alert("invalid file type");
                      return;
                    }

                    handleExtractionImage(file, scannedCode);
                  }}
                />
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        modal
        open={openManualBarcodeModal}
        defaultOpen={openManualBarcodeModal}
        onOpenChange={(o) => setOpenManualBarcodeModal(o)}
      >
        <DialogContent clickableOverlay={false} position="bottom" size="full">
          <DialogHeader>
            <DialogTitle className="mb-5">Search Products</DialogTitle>
          </DialogHeader>

          <ManualBarcodeForm />
        </DialogContent>
      </Dialog>

      {processingBarcode || modalActivated ? (
        <div className="fixed z-10 flex h-full w-full items-center justify-center">
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
        paused={
          scannedCode !== undefined || modalActivated
        }
      />

      <div className="fixed bottom-0 z-2 w-full rounded-t-3xl bg-black px-5 py-7 text-white">
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

        <div className="mt-3 mb-5">
          <p className="text-white text-sm">
            Point your camera at the product barcode to search
          </p>

          <div className="mt-3">
            <Button
              onClick={() => {
                setOpenManualBarcodeModal(true);
              }}
              className="bg-[#111] color-white"
            >
              <MdKeyboard /> Use Keyboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
