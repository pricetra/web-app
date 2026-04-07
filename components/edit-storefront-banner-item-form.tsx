"use client";

import { useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  UpdateStorefrontBannerItemDocument,
  GetStorefrontBannerDocument,
  StorefrontBannerItem as StorefrontBannerItemType,
} from "graphql-utils";
import { convertFileToBase64, createCloudinaryUrl } from "@/lib/files";
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
import { FiCamera } from "react-icons/fi";
import Image from "next/image";

export default function EditStorefrontBannerItemForm({
  item,
  storeId,
  branchId,
  onSuccess,
}: {
  item: StorefrontBannerItemType;
  storeId: number;
  branchId?: number;
  onSuccess?: () => void;
}) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();
  const [title, setTitle] = useState(item.title ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [link, setLink] = useState(item.link ?? "");
  const [isExternal, setIsExternal] = useState(item.isExternal);
  const [sortOrder, setSortOrder] = useState(item.sortOrder);

  const [updateBannerItem, { loading }] = useMutation(
    UpdateStorefrontBannerItemDocument,
    {
      refetchQueries: [
        {
          query: GetStorefrontBannerDocument,
          variables: { storeId, branchId },
        },
      ],
    },
  );

  const handleImageChange = (file: File) => {
    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    let imageBase64: string | undefined;
    if (imageFile) {
      const base64 = await convertFileToBase64(imageFile);
      imageBase64 = base64 as string;
    }

    updateBannerItem({
      variables: {
        input: {
          bannerItemId: item.id,
          ...(imageBase64 && { imageBase64 }),
          title: title || undefined,
          description: description || undefined,
          link: link || undefined,
          isExternal,
          sortOrder,
        },
      },
    }).then(({ data }) => {
      if (!data) return;
      toast.success("Banner item updated");
      onSuccess?.();
    });
  };

  const currentImageUrl = createCloudinaryUrl(item.imageId, 1000, 400);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>Image</Label>
        <input
          ref={imageRef}
          type="file"
          accept={allowedImageTypesString}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.item(0);
            if (file) handleImageChange(file);
          }}
        />
        <div
          className="relative w-full aspect-5/2 rounded-lg overflow-hidden mt-1 cursor-pointer"
          onClick={() => imageRef.current?.click()}
        >
          <Image
            src={imagePreview ?? currentImageUrl}
            alt={title || "Banner preview"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
            <FiCamera className="size-6 text-white" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="edit-banner-title">Title</Label>
        <Input
          id="edit-banner-title"
          placeholder="Banner title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="edit-banner-description">Description</Label>
        <Textarea
          id="edit-banner-description"
          placeholder="Banner description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="edit-banner-link">Link</Label>
        <Input
          id="edit-banner-link"
          placeholder="https://example.com or /path"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {link && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="edit-banner-external"
            checked={isExternal}
            onCheckedChange={(checked) => setIsExternal(checked === true)}
          />
          <Label htmlFor="edit-banner-external">External link</Label>
        </div>
      )}

      <div>
        <Label htmlFor="edit-banner-sort-order">Sort order</Label>
        <Input
          id="edit-banner-sort-order"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(+e.target.value)}
        />
      </div>

      <Button variant="pricetra" disabled={loading} onClick={handleSubmit}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
