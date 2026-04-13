"use client";

import { useMutation } from "@apollo/client/react";
import {
  Branch,
  BranchType,
  UpdateBranch,
  UpdateBranchDocument,
} from "graphql-utils";
import { useState } from "react";
import { toast } from "sonner";
import { CgSpinner } from "react-icons/cg";
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
import { Button } from "@/components/ui/button";
import slugify from "slugify";

export default function ManageBranchInfo({
  branch,
  storeId,
  onUpdated,
}: {
  branch: Branch;
  storeId: number;
  onUpdated?: () => void;
}) {
  const [updateBranch, { loading: updating }] =
    useMutation(UpdateBranchDocument);

  const [editName, setEditName] = useState<string | null>(null);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editType, setEditType] = useState<BranchType | null>(null);
  const [editOnlineUrl, setEditOnlineUrl] = useState<string | null>(null);

  const handleUpdate = async (input: UpdateBranch) => {
    try {
      const { data } = await updateBranch({
        variables: { storeId, branchId: branch.id, input },
      });
      if (data) {
        toast.success("Branch updated successfully");
        setEditName(null);
        setEditSlug(null);
        setEditType(null);
        setEditOnlineUrl(null);
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
              <span>{branch.name}</span>
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
                pricetra.com/stores/{branch.storeSlug}/
                {slugify(editSlug || "", { lower: true, strict: true })}
              </FieldDescription>
              <div className="flex flex-row gap-2 mt-2">
                <Button
                  variant="pricetra"
                  size="xs"
                  disabled={updating || editSlug.length === 0}
                  onClick={() =>
                    handleUpdate({
                      slug: slugify(editSlug, { lower: true, strict: true }),
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
                {branch.type?.toLowerCase()}
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

      {/* Address (read-only) */}
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

      {/* Online URL */}
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
    </div>
  );
}
