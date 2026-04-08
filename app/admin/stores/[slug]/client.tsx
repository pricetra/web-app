"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  FindStoreDocument,
  UpdateStoreDocument,
  AllBranchesDocument,
  UpdateStore,
} from "graphql-utils";
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";
import { createCloudinaryUrl, convertFileToBase64 } from "@/lib/files";
import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { MdAdd, MdStorefront } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { BsPersonFillAdd } from "react-icons/bs";
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
import { useRef, useState } from "react";
import { toast } from "sonner";
import { allowedImageTypes } from "@/constants/uploads";
import useStoreNameAvailability from "@/hooks/useStoreNameAvailability";
import { CgCheckO, CgCloseO } from "react-icons/cg";
import slugify from "slugify";
import AdminListItem from "../../components/admin-list-item";

export type StoreDetailClientProps = {
  slug: string;
};

export default function StoreDetailClient({ slug }: StoreDetailClientProps) {
  const { data, loading, refetch } = useQuery(FindStoreDocument, {
    variables: { storeSlug: slug },
  });
  const { data: branchesData } = useQuery(AllBranchesDocument, {
    variables: {
      storeSlug: slug,
      paginator: { limit: 5, page: 1 },
    },
  });
  const [updateStore, { loading: updating }] =
    useMutation(UpdateStoreDocument);
  const {
    debouncedCheckStoreNameAvailability,
    storeNameAvailable,
    storeNameAvailabilityLoading,
  } = useStoreNameAvailability();

  const [editName, setEditName] = useState<string | null>(null);
  const [editWebsite, setEditWebsite] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>();
  const logoUploadInputRef = useRef<HTMLInputElement>(null);

  if (loading || !data) {
    return (
      <div className="w-full py-10 flex justify-center">
        <CgSpinner className="animate-spin size-10" />
      </div>
    );
  }

  const store = data.findStore;

  const handleUpdate = async (input: UpdateStore) => {
    try {
      const { data } = await updateStore({
        variables: { storeId: store.id, input },
      });
      if (data) {
        toast.success("Store updated successfully");
        refetch();
        setEditName(null);
        setEditWebsite(null);
        setSelectedImage(undefined);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  const branches = branchesData?.allBranches.branches ?? [];
  const branchCount = branchesData?.allBranches.paginator?.total ?? 0;

  return (
    <div className="w-full max-w-[1000px] flex-1 px-5">
      <div className="flex flex-row items-center gap-4 mb-8">
        <Image
          src={createCloudinaryUrl(store.logo, 300, 300)}
          className="size-16 rounded-xl"
          alt={store.name}
          width={300}
          height={300}
        />
        <div>
          <h1 className="text-xl font-bold">{store.name}</h1>
          <p className="text-sm text-gray-500">{store.website}</p>
        </div>
      </div>

      {/* Edit Store */}
      <div className="flex flex-col gap-5 mb-10">
        <h2 className="text-lg font-bold">Store Details</h2>

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
                    size="sm"
                    disabled={updating || !storeNameAvailable}
                    onClick={() => handleUpdate({ name: editName })}
                  >
                    {updating && <CgSpinner className="animate-spin" />}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
                  size="sm"
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
                  size="sm"
                  onClick={() => logoUploadInputRef.current?.click()}
                >
                  Change Logo
                </Button>
                {selectedImage && (
                  <Button
                    variant="pricetra"
                    size="sm"
                    disabled={updating}
                    onClick={() => {
                      // The base64 was stored when file was selected
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
                    size="sm"
                    disabled={updating || editWebsite.length === 0}
                    onClick={() => handleUpdate({ website: editWebsite })}
                  >
                    {updating && <CgSpinner className="animate-spin" />}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
                  size="sm"
                  onClick={() => setEditWebsite(store.website)}
                >
                  Edit
                </Button>
              </div>
            )}
          </Field>
        </FieldGroup>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold">
            Branches {branchCount > 0 && <span className="text-sm text-gray-500 font-normal">({branchCount})</span>}
          </h2>
          <Button variant="pricetra" size="sm" asChild>
            <Link href={`/admin/stores/${slug}/branches/new`}>
              <MdAdd /> New Branch
            </Link>
          </Button>
        </div>

        {branches.length > 0 ? (
          <div className="flex flex-col gap-2">
            {branches.map((branch) => (
              <Link
                key={branch.id}
                href={`/stores/${store.slug}/${branch.slug}`}
                className="flex flex-row items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <MdStorefront className="size-5 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{branch.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {branch.address?.fullAddress ?? branch.onlineAddress?.url ?? branch.type}
                  </p>
                </div>
                <FaAngleRight className="size-4 text-gray-400" />
              </Link>
            ))}
            {branchCount > 5 && (
              <Link
                href={`/admin/stores/${slug}/branches`}
                className="text-sm text-center text-gray-500 hover:text-gray-700 py-2"
              >
                View all {branchCount} branches
              </Link>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No branches yet.</p>
        )}

        <div className="mt-5">
          <AdminListItem
            href={`/admin/stores/${slug}/users/add`}
            icon={<BsPersonFillAdd />}
            title="Add Store User"
            content="Send a join request to a user for this store"
          />
        </div>
      </div>
    </div>
  );
}
