"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  GetAllUsersDocument,
  UpdateUserByIdDocument,
  User,
  UserRole,
} from "graphql-utils";
import { SmartPagination } from "@/components/ui/smart-pagination";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { RiAdminLine } from "react-icons/ri";
import { useNavbar } from "@/context/navbar-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ProfileFull from "@/components/profile-full";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { toast } from "sonner";
import Image from "next/image";
import { createCloudinaryUrl, convertFileToBase64 } from "@/lib/files";
import { useSearchParams } from "next/navigation";
import { diffObjects } from "@/lib/utils";
import {
  allowedImageTypes,
  allowedImageTypesString,
} from "@/constants/uploads";
import { FiCamera } from "react-icons/fi";

const roles = [
  UserRole.SuperAdmin,
  UserRole.Admin,
  UserRole.Contributor,
  UserRole.Consumer,
];

export default function UsersClient() {
  const { setPageIndicator, resetAll } = useNavbar();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [getUsers, { data, loading }] = useLazyQuery(GetAllUsersDocument, {
    fetchPolicy: "no-cache",
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>();

  const [updateUser, { loading: updating }] = useMutation(
    UpdateUserByIdDocument,
    {
      refetchQueries: [GetAllUsersDocument],
    },
  );

  useLayoutEffect(() => {
    setPageIndicator(
      <NavPageIndicator icon={RiAdminLine} title="Admin" href="/admin" />,
    );
    return () => resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUsers({ variables: { paginator: { limit: 25, page } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!selectedUser?.avatar) {
      setImagePreview(undefined);
      return;
    }

    setImagePreview(createCloudinaryUrl(selectedUser.avatar, 100, 100));
  }, [selectedUser]);

  const users = data?.getAllUsers?.users ?? [];
  const paginator = data?.getAllUsers?.paginator;

  return (
    <div className="w-full flex-1 p-5">
      <div className="flex flex-row items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-bold">Users</h1>
          <p className="text-sm text-gray-500">
            Manage users and view user profiles.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Created</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array(8)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    {Array(6)
                      .fill(0)
                      .map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 w-full rounded bg-gray-100" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}

            {users.map((u: User) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.id}</TableCell>
                <TableCell className="min-w-[250px]">
                  <div className="flex flex-row items-center gap-3">
                    <Image
                      src={createCloudinaryUrl(
                        u.avatar ?? "f89a1553-b74e-426c-a82a-359787168a53",
                        50,
                        50,
                      )}
                      alt="avatar"
                      width={50}
                      height={50}
                      quality={100}
                      className="rounded-full size-8 object-cover"
                    />
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-gray-600">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.active ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  {new Date(u.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(u);
                        setViewOpen(true);
                      }}
                    >
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(u);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginator?.numPages && paginator.numPages > 1 && (
        <div className="mt-6">
          <SmartPagination paginator={paginator} urlBase="/admin/users" />
        </div>
      )}

      {/* View dialog */}
      {selectedUser && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>{selectedUser.name}</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <ProfileFull user={selectedUser} />
            </div>

            <DialogFooter>
              <Button onClick={() => setViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit dialog */}
      {selectedUser && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>

            <div className="py-2">
              <Formik
                enableReinitialize
                initialValues={{
                  name: selectedUser.name ?? "",
                  email: selectedUser.email ?? "",
                  role: selectedUser.role ?? "",
                  active: !!selectedUser.active,
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
                    selectedUser as any,
                  );

                  if (Object.keys(filteredInput).length === 0) return;

                  updateUser({
                    variables: {
                      userId: selectedUser.id,
                      input: filteredInput,
                    },
                  })
                    .then(() => {
                      toast.success("User updated");
                      setEditOpen(false);
                    })
                    .catch((e) => toast.error(e.message));
                }}
              >
                {(formik) => (
                  <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            width={80}
                            height={80}
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
                    </div>

                    <div>
                      <Label>Name</Label>
                      <Input
                        name="name"
                        value={formik.values.name}
                        onChange={(e) =>
                          formik.setFieldValue("name", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        name="email"
                        value={formik.values.email}
                        onChange={(e) =>
                          formik.setFieldValue("email", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Role</Label>
                      <NativeSelect
                        name="role"
                        value={formik.values.role}
                        onChange={(e) =>
                          formik.setFieldValue("role", e.target.value)
                        }
                      >
                        {roles.map((role) => (
                          <NativeSelectOption
                            key={`role-${role.toString()}`}
                            value={role.toString()}
                          >
                            {role.toString()}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={formik.values.active}
                        onCheckedChange={(value) =>
                          formik.setFieldValue("active", !!value)
                        }
                      />
                      <Label className="text-sm">Active</Label>
                    </div>

                    <div className="flex flex-row gap-2 justify-end mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setEditOpen(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updating}
                        onClick={formik.submitForm}
                      >
                        {updating ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
