"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  BranchDocument,
  BranchType,
  UpdateBranch,
  UpdateBranchDocument,
} from "graphql-utils";
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useState } from "react";
import { toast } from "sonner";
import slugify from "slugify";

export type BranchDetailClientProps = {
  storeSlug: string;
  branchSlug: string;
};

export default function BranchDetailClient({
  storeSlug,
  branchSlug,
}: BranchDetailClientProps) {
  const { data, loading, refetch } = useQuery(BranchDocument, {
    variables: { storeSlug, branchSlug },
  });
  const [updateBranch, { loading: updating }] =
    useMutation(UpdateBranchDocument);

  const [editName, setEditName] = useState<string | null>(null);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editType, setEditType] = useState<BranchType | null>(null);
  const [editOnlineUrl, setEditOnlineUrl] = useState<string | null>(null);

  if (loading || !data?.findBranch || !data?.findStore) {
    return (
      <div className="w-full py-10 flex justify-center">
        <CgSpinner className="animate-spin size-10" />
      </div>
    );
  }

  const branch = data.findBranch;
  const store = data.findStore;

  const handleUpdate = async (input: UpdateBranch) => {
    try {
      const { data } = await updateBranch({
        variables: { storeId: store.id, branchId: branch.id, input },
      });
      if (data) {
        toast.success("Branch updated successfully");
        refetch();
        setEditName(null);
        setEditSlug(null);
        setEditType(null);
        setEditOnlineUrl(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="w-full max-w-[1000px] flex-1 px-5">
      {/* Header */}
      <div className="flex flex-row items-center gap-4 mb-8">
        <Link href={`/admin/stores/${storeSlug}`}>
          <Image
            src={createCloudinaryUrl(store.logo, 300, 300)}
            className="size-10 rounded-md"
            alt={store.name}
            width={300}
            height={300}
          />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-gray-500">
            <Link
              href={`/admin/stores/${storeSlug}`}
              className="hover:underline"
            >
              {store.name}
            </Link>
            {" / "}
            <Link
              href={`/admin/stores/${storeSlug}/branches`}
              className="hover:underline"
            >
              Branches
            </Link>
          </p>
          <h1 className="text-xl font-bold">{branch.name}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-row">
          {/* Name */}
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              {editName !== null ? (
                <>
                  <InputGroup>
                    <InputGroupInput
                      value={editName}
                      onChange={(v) => setEditName(v.target.value)}
                    />
                  </InputGroup>
                  <div className="flex flex-row gap-2 mt-2">
                    <Button
                      variant="pricetra"
                      size="xs"
                      disabled={updating || editName.length === 0}
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
                  <span className="text-sm">{branch.name}</span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setEditName(branch.name)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Field>
          </FieldGroup>

          {/* Slug */}
          <FieldGroup>
            <Field>
              <FieldLabel>Slug</FieldLabel>
              {editSlug !== null ? (
                <>
                  <InputGroup>
                    <InputGroupInput
                      value={editSlug}
                      onChange={(v) => setEditSlug(v.target.value)}
                    />
                  </InputGroup>
                  <FieldDescription>
                    pricetra.com/stores/{storeSlug}/
                    {slugify(editSlug || "", { lower: true, strict: true })}
                  </FieldDescription>
                  <div className="flex flex-row gap-2 mt-2">
                    <Button
                      variant="pricetra"
                      size="xs"
                      disabled={updating || editSlug.length === 0}
                      onClick={() =>
                        handleUpdate({
                          slug: slugify(editSlug, {
                            lower: true,
                            strict: true,
                          }),
                        })
                      }
                    >
                      {updating && <CgSpinner className="animate-spin" />}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setEditSlug(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-row items-center gap-3">
                  <span className="text-sm">{branch.slug}</span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setEditSlug(branch.slug)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Field>
          </FieldGroup>
        </div>

        {/* Type */}
        <FieldGroup>
          <Field>
            <FieldLabel>Type</FieldLabel>
            {editType !== null ? (
              <>
                <NativeSelect
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as BranchType)}
                >
                  <NativeSelectOption value={BranchType.Physical}>
                    Physical
                  </NativeSelectOption>
                  <NativeSelectOption value={BranchType.Online}>
                    Online
                  </NativeSelectOption>
                </NativeSelect>
                <div className="flex flex-row gap-2 mt-2">
                  <Button
                    variant="pricetra"
                    size="xs"
                    disabled={updating}
                    onClick={() => handleUpdate({ type: editType })}
                  >
                    {updating && <CgSpinner className="animate-spin" />}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setEditType(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-row items-center gap-3">
                <span className="text-sm capitalize">
                  {branch.type.toLowerCase()}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setEditType(branch.type)}
                >
                  Edit
                </Button>
              </div>
            )}
          </Field>
        </FieldGroup>

        {/* Address (physical) */}
        {branch.address && (
          <FieldGroup>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <div className="text-sm space-y-1">
                <p>{branch.address.fullAddress}</p>
                {branch.address.mapsLink && (
                  <a
                    href={branch.address.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View on Maps
                  </a>
                )}
              </div>
            </Field>
          </FieldGroup>
        )}

        {/* Online Address */}
        {branch.onlineAddress && (
          <FieldGroup>
            <Field>
              <FieldLabel>Online URL</FieldLabel>
              {editOnlineUrl !== null ? (
                <>
                  <InputGroup>
                    <InputGroupInput
                      value={editOnlineUrl}
                      onChange={(v) => setEditOnlineUrl(v.target.value)}
                    />
                  </InputGroup>
                  <div className="flex flex-row gap-2 mt-2">
                    <Button
                      variant="pricetra"
                      size="xs"
                      disabled={updating || editOnlineUrl.length === 0}
                      onClick={() =>
                        handleUpdate({
                          onlineAddress: {
                            url: editOnlineUrl,
                            itemUrlTemplate:
                              branch.onlineAddress?.itemUrlTemplate,
                            referralCode: branch.onlineAddress?.referralCode,
                            referralQueryParam:
                              branch.onlineAddress?.referralQueryParam,
                          },
                        })
                      }
                    >
                      {updating && <CgSpinner className="animate-spin" />}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setEditOnlineUrl(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-row items-center gap-3">
                  <a
                    href={branch.onlineAddress.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {branch.onlineAddress.url}
                  </a>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setEditOnlineUrl(branch.onlineAddress?.url ?? "")
                    }
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Field>
          </FieldGroup>
        )}

        {branch.onlineAddress && (
          <>
            <FieldGroup>
              <Field>
                <FieldLabel>Item URL Template</FieldLabel>
                <p className="text-sm text-gray-500">
                  {branch.onlineAddress.itemUrlTemplate || "Not set"}
                </p>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Referral Code</FieldLabel>
                <p className="text-sm text-gray-500">
                  {branch.onlineAddress.referralCode || "Not set"}
                </p>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Referral Query Param</FieldLabel>
                <p className="text-sm text-gray-500">
                  {branch.onlineAddress.referralQueryParam || "Not set"}
                </p>
              </Field>
            </FieldGroup>
          </>
        )}
      </div>
    </div>
  );
}
