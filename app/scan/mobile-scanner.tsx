"use client";

import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import ScannerOverlay from "./scanner-overlay";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MdKeyboard } from "react-icons/md";
import ManualBarcodeForm from "./components/manual-barcode-form";
import { IoSearch } from "react-icons/io5";
import useAddProductPrompt from "@/hooks/useAddProductPrompt";
import ExtractImageDialog from "./components/extract-image-dialog";
import { handleInputFile } from "@/lib/files";
import { toast } from "sonner";
import { slugifyProductName } from "@/lib/strings";

export default function MobileScanner() {
  const router = useRouter();
  const {
    handleBarcodeScan,
    extractingProduct,
    processingBarcode,
    handleExtractionImage,
  } = useAddProductPrompt();
  const [scannedCode, setScannedCode] = useState<string>();
  const [openAddUpcModal, setOpenAddUpcModal] = useState(false);
  const [openManualBarcodeModal, setOpenManualBarcodeModal] = useState(false);
  const modalActivated = openAddUpcModal || openManualBarcodeModal;

  useLayoutEffect(() => {
    setScannedCode(undefined);
  }, []);

  const debouncedHandleBarcodeScan = useMemo(
    () =>
      debounce(
        (barcodes: DetectedBarcode[]) => {
          if (barcodes.length === 0) return;
          if (scannedCode) return;

          const barcodeObject = barcodes.at(0);
          if (!barcodeObject) return;

          const barcode = barcodeObject.rawValue;
          setScannedCode(barcode);

          handleBarcodeScan(barcode, {
            onSuccess: (data) => {
              setScannedCode(undefined);
              const params = new URLSearchParams();
              if (data.barcodeScan.stock) {
                params.set("stockId", String(data.barcodeScan.stock.id));
              }
              router.push(
                `/products/${data.barcodeScan.code}-${slugifyProductName(data.barcodeScan.name)}${params.size > 0 ? `?${params.toString()}` : ""}`,
              );
            },
            onError: () => setOpenAddUpcModal(true),
          });
        },
        500,
        { leading: true, trailing: false },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      {scannedCode && (
        <Dialog
          modal
          open={openAddUpcModal}
          defaultOpen={openAddUpcModal}
          onOpenChange={(o) => setOpenAddUpcModal(o)}
        >
          <ExtractImageDialog
            scannedCode={scannedCode}
            extractingProduct={extractingProduct}
            onFileChange={(e) => {
              const file = handleInputFile(e);
              if (!file) return;

              handleExtractionImage(file, scannedCode, {
                onSuccess: (data) => {
                  router.push(
                    `/products/${data.extractAndCreateProduct.code}-${slugifyProductName(data.extractAndCreateProduct.name)}`,
                  );
                },
                onError: (err) => {
                  toast.error(
                    `Error extracting data from image: ${err.message}`,
                  );
                },
                onFinally: () => {
                  setScannedCode(undefined);
                  setOpenAddUpcModal(false);
                },
              });
            }}
            onCancel={() => {
              setScannedCode(undefined);
              setOpenAddUpcModal(false);
            }}
          />
        </Dialog>
      )}

      <Dialog
        modal
        open={openManualBarcodeModal}
        defaultOpen={openManualBarcodeModal}
        onOpenChange={(o) => setOpenManualBarcodeModal(o)}
      >
        <DialogContent
          clickableOverlay={false}
          position="bottom"
          size="full"
          padding={false}
        >
          <DialogHeader className="px-5 pt-5">
            <DialogTitle className="mb-5 flex flex-row items-center gap-2 font-bold">
              <IoSearch /> Search Products
            </DialogTitle>
          </DialogHeader>

          <ManualBarcodeForm />
        </DialogContent>
      </Dialog>

      {processingBarcode ? (
        <div className="fixed z-10 flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-xl bg-black/50 px-10 py-7">
            <CgSpinner className="animate-spin text-white size-16" />
            <h3 className="mt-4 text-white">Processing Barcode</h3>
          </div>
        </div>
      ) : modalActivated ? (
        <></>
      ) : (
        <ScannerOverlay />
      )}

      <BarcodeScanner
        options={{ formats: ["upc_a", "upc_e", "ean_8", "ean_13"] }}
        onCapture={debouncedHandleBarcodeScan}
        paused={scannedCode !== undefined || modalActivated}
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
