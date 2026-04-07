"use client";

import { useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  CreateStorefrontBannerItemsDocument,
  AppendStorefrontBannerItemsDocument,
  GetStorefrontBannerDocument,
} from "graphql-utils";
import { convertFileToBase64 } from "@/lib/files";
import {
  allowedImageTypes,
  allowedImageTypesString,
} from "@/constants/uploads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FiCamera, FiPlus, FiTrash2 } from "react-icons/fi";
import Image from "next/image";

type BannerItemField = {
  imageFile?: File;
  imagePreview?: string;
  link: string;
  isExternal: boolean;
  title: string;
  description: string;
};

const emptyItem = (): BannerItemField => ({
  link: "",
  isExternal: false,
  title: "",
  description: "",
});

export default function CreateStorefrontBannerForm({
  storeId,
  branchId,
  onSuccess,
  append = false,
}: {
  storeId: number;
  branchId?: number;
  onSuccess?: () => void;
  append?: boolean;
}) {
  const [items, setItems] = useState<BannerItemField[]>([emptyItem()]);
  const imageRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [createBannerItems, { loading }] = useMutation(
    append ? AppendStorefrontBannerItemsDocument : CreateStorefrontBannerItemsDocument,
    {
      refetchQueries: [
        {
          query: GetStorefrontBannerDocument,
          variables: { storeId, branchId },
        },
      ],
    },
  );

  const updateItem = (
    index: number,
    updates: Partial<BannerItemField>,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = async (index: number, file: File) => {
    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }
    updateItem(index, {
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async () => {
    const hasImages = items.every((item) => item.imageFile);
    if (!hasImages) {
      toast.error("Each banner item requires an image");
      return;
    }

    const bannerItems = await Promise.all(
      items.map(async (item, i) => {
        const base64 = await convertFileToBase64(item.imageFile!);
        return {
          imageBase64: base64 as string,
          link: item.link || undefined,
          isExternal: item.isExternal,
          title: item.title || undefined,
          description: item.description || undefined,
          sortOrder: i,
        };
      }),
    );

    createBannerItems({
      variables: {
        input: {
          storeId,
          branchId,
          bannerItems,
        },
      },
    }).then(({ data }) => {
      if (!data) return;
      toast.success(append ? "Slides added successfully" : "Banner created successfully");
      onSuccess?.();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 border rounded-lg p-4 relative"
        >
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <FiTrash2 className="size-4" />
            </button>
          )}

          <div>
            <Label>Image *</Label>
            <input
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              type="file"
              accept={allowedImageTypesString}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.item(0);
                if (file) handleImageChange(index, file);
              }}
            />
            {item.imagePreview ? (
              <div
                className="relative w-full aspect-5/2 rounded-lg overflow-hidden mt-1 cursor-pointer"
                onClick={() => imageRefs.current[index]?.click()}
              >
                <Image
                  src={item.imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center w-full aspect-5/2 rounded-lg border-2 border-dashed border-gray-300 mt-1 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => imageRefs.current[index]?.click()}
              >
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <FiCamera className="size-6" />
                  <span className="text-sm">Upload image</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor={`banner-title-${index}`}>Title</Label>
            <Input
              id={`banner-title-${index}`}
              placeholder="Banner title"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor={`banner-description-${index}`}>Description</Label>
            <Textarea
              id={`banner-description-${index}`}
              placeholder="Banner description"
              value={item.description}
              onChange={(e) =>
                updateItem(index, { description: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor={`banner-link-${index}`}>Link</Label>
            <Input
              id={`banner-link-${index}`}
              placeholder="https://example.com or /path"
              value={item.link}
              onChange={(e) => updateItem(index, { link: e.target.value })}
            />
          </div>

          {item.link && (
            <div className="flex items-center gap-2">
              <Checkbox
                id={`banner-external-${index}`}
                checked={item.isExternal}
                onCheckedChange={(checked) =>
                  updateItem(index, { isExternal: checked === true })
                }
              />
              <Label htmlFor={`banner-external-${index}`}>External link</Label>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        type="button"
        onClick={() => setItems((prev) => [...prev, emptyItem()])}
      >
        <FiPlus className="size-4 mr-2" />
        Add another slide
      </Button>

      <Button
        variant="pricetra"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Saving..." : append ? "Add Slides" : "Create Banner"}
      </Button>
    </div>
  );
}
