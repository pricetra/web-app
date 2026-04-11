"use client";

import { useMutation } from "@apollo/client/react";
import {
  UpdateStore,
  UpdateStoreDocument,
  Store,
} from "graphql-utils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CgCheckO, CgCloseO, CgSpinner } from "react-icons/cg";
import Image from "next/image";
import { createCloudinaryUrl, convertFileToBase64 } from "@/lib/files";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { allowedImageTypes } from "@/constants/uploads";
import useStoreNameAvailability from "@/hooks/useStoreNameAvailability";
import slugify from "slugify";

export default function ManageStoreInfo({
  store,
  onUpdated,
}: {
  store: Store;
  onUpdated?: () => void;
}) {
  const [updateStore, { loading: updating }] = useMutation(UpdateStoreDocument);
  const {
    debouncedCheckStoreNameAvailability,
    storeNameAvailable,
    storeNameAvailabilityLoading,
  } = useStoreNameAvailability();

  const [editName, setEditName] = useState<string | null>(null);
  const [editWebsite, setEditWebsite] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>();
  const logoUploadInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async (input: UpdateStore) => {
    try {
      const { data } = await updateStore({
        variables: { storeId: store.id, input },
      });
      if (data) {
        toast.success("Store updated successfully");
        setEditName(null);
        setEditWebsite(null);
        setSelectedImage(undefined);
        onUpdated?.();
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          {editName !== null ? (
            <>
              <InputGroup>
                <InputGroupInput
                  value={editName}
                  onChange={(v) => {
                    setEditName(v.target.value);
                    debouncedCheckStoreNameAvailability(v.target.value);
                  }}
                />
                <InputGroupAddon align="inline-end">
                  {storeNameAvailabilityLoading ? (
                    <CgSpinner className="animate-spin" />
                  ) : storeNameAvailable === undefined ? null : storeNameAvailable ? (
                    <CgCheckO className="text-green-600" />
                  ) : (
                    <CgCloseO className="text-red-600" />
                  )}
                </InputGroupAddon>
              </InputGroup>
              {editName.length > 0 && (
                <FieldDescription>
                  pricetra.com/stores/
                  {slugify(editName, { lower: true, strict: true })}
                </FieldDescription>
              )}
              <div className="flex flex-row gap-2 mt-2">
                <Button
                  variant="pricetra"
                  size="xs"
                  disabled={updating || !storeNameAvailable}
                  onClick={() => handleUpdate({ name: editName })}
                >
                  {updating && <CgSpinner className="animate-spin" />}
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setEditName(null)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-row items-center gap-3">
              <span>{store.name}</span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setEditName(store.name)}
              >
                Edit
              </Button>
            </div>
          )}
        </Field>
      </FieldGroup>

      {/* Logo */}
      <FieldGroup>
        <Field>
          <FieldLabel>Logo</FieldLabel>
          <div className="flex flex-row items-center gap-3">
            {selectedImage ? (
              <Image
                src={selectedImage}
                className="size-16 rounded-xl object-cover cursor-pointer"
                width={300}
                height={300}
                alt="New logo"
                onClick={() => logoUploadInputRef.current?.click()}
                onError={() => setSelectedImage(undefined)}
              />
            ) : (
              <Image
                src={createCloudinaryUrl(store.logo, 300, 300)}
                className="size-16 rounded-xl object-cover"
                alt={store.name}
                width={300}
                height={300}
              />
            )}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => logoUploadInputRef.current?.click()}
              >
                Change Logo
              </Button>
              {selectedImage && (
                <Button
                  variant="pricetra"
                  size="xs"
                  disabled={updating}
                  onClick={() => {
                    const input = logoUploadInputRef.current;
                    const file = input?.files?.item(0);
                    if (!file) return;
                    convertFileToBase64(file).then((base64) => {
                      if (!base64) return;
                      handleUpdate({ logoBase64: base64.toString() });
                    });
                  }}
                >
                  {updating && <CgSpinner className="animate-spin" />}
                  Save Logo
                </Button>
              )}
            </div>
          </div>
          <input
            type="file"
            ref={logoUploadInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.item(0);
              if (!file) return;
              if (!allowedImageTypes.includes(file.type)) {
                toast.error("Invalid file type");
                return;
              }
              setSelectedImage(URL.createObjectURL(file));
            }}
          />
        </Field>
      </FieldGroup>

      {/* Website */}
      <FieldGroup>
        <Field>
          <FieldLabel>Website</FieldLabel>
          {editWebsite !== null ? (
            <>
              <InputGroup>
                <InputGroupInput
                  value={editWebsite}
                  onChange={(v) => setEditWebsite(v.target.value)}
                  placeholder="https://example.com"
                />
              </InputGroup>
              <div className="flex flex-row gap-2 mt-2">
                <Button
                  variant="pricetra"
                  size="xs"
                  disabled={updating || editWebsite.length === 0}
                  onClick={() => handleUpdate({ website: editWebsite })}
                >
                  {updating && <CgSpinner className="animate-spin" />}
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setEditWebsite(null)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-row items-center gap-3">
              <span className="text-sm">{store.website}</span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setEditWebsite(store.website)}
              >
                Edit
              </Button>
            </div>
          )}
        </Field>
      </FieldGroup>
    </div>
  );
}
