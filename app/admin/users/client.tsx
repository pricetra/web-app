"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import {
  GetAllUsersDocument,
  User,
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
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { useSearchParams } from "next/navigation";
import EditUserDialog from "./components/edit-user-dialog";

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
        <EditUserDialog
          user={selectedUser}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </div>
  );
}
