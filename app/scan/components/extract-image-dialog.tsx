import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { FiCamera } from "react-icons/fi";
import { allowedImageTypesString } from "@/constants/uploads";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useRef } from "react";
import { CgSpinner } from "react-icons/cg";

export type ExtractImageDialogProps = {
  scannedCode: string;
  onCancel: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  extractingProduct: boolean;
}

export default function ExtractImageDialog({scannedCode, extractingProduct, onFileChange, onCancel}: ExtractImageDialogProps) {
  const imageUploadRef = useRef<HTMLInputElement>(null);

  return (
    <DialogContent clickableOverlay={false}>
      <DialogHeader>
        <DialogTitle className="mb-5">Add UPC</DialogTitle>
        <DialogDescription>
          The searched barcode{" "}
          <span className="font-mono font-bold">{scannedCode}</span> does not
          exist in our database.
        </DialogDescription>
        <DialogDescription>
          You can help us record and track prices for this product by taking a
          picture.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline"
            onClick={onCancel}
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
            onChange={async (e) => onFileChange(e)}
          />
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
