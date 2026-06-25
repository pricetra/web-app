"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Formik } from "formik";
import {
  GetAllUsersDocument,
  UpdateUserByIdDocument,
  User,
  UserRole,
} from "graphql-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { createCloudinaryUrl, convertFileToBase64 } from "@/lib/files";
import { diffObjects } from "@/lib/utils";
import {
  allowedImageTypes,
  allowedImageTypesString,
} from "@/constants/uploads";
import { FiCamera } from "react-icons/fi";

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const roles = [
  UserRole.SuperAdmin,
  UserRole.Admin,
  UserRole.Contributor,
  UserRole.Consumer,
];

export default function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSaved,
}: EditUserDialogProps) {
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>();

  const [updateUser, { loading: updating }] = useMutation(
    UpdateUserByIdDocument,
    {
      refetchQueries: [GetAllUsersDocument],
    },
  );

  useEffect(() => {
    if (!user?.avatar) {
      setImagePreview(undefined);
      return;
    }

    setImagePreview(createCloudinaryUrl(user.avatar, 100, 100));
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Formik
            enableReinitialize
            initialValues={{
              name: user.name ?? "",
              email: user.email ?? "",
              role: user.role ?? "",
              active: !!user.active,
              avatarBase64: undefined,
            }}
            onSubmit={async (values) => {
              const input = { ...values } as Record<string, unknown>;
              if (!input.avatarBase64) {
                delete input.avatarBase64;
              }

              const filteredInput = diffObjects(
                input,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                user as any,
              );

              if (Object.keys(filteredInput).length === 0) return;

              updateUser({
                variables: {
                  userId: user.id,
                  input: filteredInput,
                },
              })
                .then(() => {
                  toast.success("User updated");
                  onOpenChange(false);
                  onSaved?.();
                })
                .catch((e) => toast.error(e.message));
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col items-center gap-3">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        width={100}
                        height={100}
                        quality={100}
                        alt="avatar preview"
                        className="rounded-full object-cover cursor-pointer"
                        onClick={() => imageUploadRef.current?.click()}
                      />
                    ) : (
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 cursor-pointer"
                        onClick={() => imageUploadRef.current?.click()}
                      >
                        <FiCamera className="h-7 w-7 text-gray-600" />
                      </div>
                    )}

                    <div className="hidden">
                      <input
                        ref={imageUploadRef}
                        type="file"
                        accept={allowedImageTypesString}
                        onChange={async (e) => {
                          const file = e.target.files?.item(0);
                          if (!file) return;
                          if (!allowedImageTypes.includes(file.type)) {
                            window.alert("invalid file type");
                            return;
                          }

                          const base64 = await convertFileToBase64(file);
                          if (typeof base64 !== "string") return;

                          formik.setFieldValue("avatarBase64", base64);
                          setImagePreview(URL.createObjectURL(file));
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formik.values.active}
                      onCheckedChange={(value) => formik.setFieldValue("active", !!value)}
                    />
                    <Label className="text-sm">Active</Label>
                  </div>
                </div>

                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={formik.values.name}
                    onChange={(e) => formik.setFieldValue("name", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={formik.values.email}
                    onChange={(e) => formik.setFieldValue("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <NativeSelect
                    name="role"
                    value={formik.values.role}
                    onChange={(e) => formik.setFieldValue("role", e.target.value)}
                  >
                    {roles.map((role) => (
                      <NativeSelectOption key={`role-${role.toString()}`} value={role.toString()}>
                        {role.toString()}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>

                <div className="flex flex-row gap-2 justify-end mt-4">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updating}>
                    {updating ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
}
