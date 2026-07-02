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
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  PaginatedAdminAuthSessionsDocument,
  AdminRemoveAuthSessionDocument,
  AuthSession,
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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { useSearchParams } from "next/navigation";

const LIMIT = 50;

export default function AuthSessionsClient() {
  const { setPageIndicator, resetAll } = useNavbar();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [getAuthSessions, { data, loading }] = useLazyQuery(
    PaginatedAdminAuthSessionsDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  const [removeAuthSession] = useMutation(AdminRemoveAuthSessionDocument);

  const [selectedSession, setSelectedSession] = useState<AuthSession | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  useLayoutEffect(() => {
    setPageIndicator(
      <NavPageIndicator icon={RiAdminLine} title="Admin" href="/admin" />,
    );
    return () => resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAuthSessions({ variables: { paginator: { limit: LIMIT, page } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const authSessions = data?.paginatedAdminAuthSessions?.authSessions ?? [];
  const paginator = data?.paginatedAdminAuthSessions?.paginator;

  const handleRemove = async () => {
    if (!selectedSession) return;

    setRemoving(true);
    try {
      await removeAuthSession({
        variables: { authStateId: selectedSession.id },
      });
      setConfirmOpen(false);
      setSelectedSession(null);
      // Refetch the data
      getAuthSessions({ variables: { paginator: { limit: LIMIT, page } } });
    } catch (error) {
      console.error("Error removing session:", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="w-full flex-1 p-5">
      <div className="flex flex-row items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-bold">Authentication Sessions</h1>
          <p className="text-sm text-gray-500">
            View and manage user authentication sessions.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Logged In</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array(8)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    {Array(7)
                      .fill(0)
                      .map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 w-full rounded bg-gray-100" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}

            {authSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium text-xs">
                  {session.id}
                </TableCell>
                <TableCell className="min-w-[250px]">
                  {session.user ? (
                    <div className="flex flex-row items-center gap-3">
                      <Image
                        src={createCloudinaryUrl(
                          session.user.avatar ??
                            "f89a1553-b74e-426c-a82a-359787168a53",
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
                        <div className="font-medium">{session.user.name}</div>
                        <div className="text-xs text-gray-600">
                          ID: {session.user.id}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </TableCell>
                <TableCell>{session.platform}</TableCell>
                <TableCell>{session.device || "-"}</TableCell>
                <TableCell className="text-sm">
                  {session.ipAddress || "-"}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {new Date(session.loggedInAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="xs"
                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => {
                      setSelectedSession(session as AuthSession);
                      setConfirmOpen(true);
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginator?.numPages && paginator.numPages > 1 && (
        <div className="mt-6">
          <SmartPagination paginator={paginator} urlBase="/admin/users/auth" />
        </div>
      )}

      {/* Remove confirmation dialog */}
      {selectedSession && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Session</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to remove this authentication session?
              </p>
              {selectedSession.user && (
                <p className="text-sm text-gray-600 mt-2">
                  User:{" "}
                  <span className="font-medium">
                    {selectedSession.user.name}
                  </span>
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                disabled={removing}
              >
                No
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemove}
                disabled={removing}
              >
                {removing ? "Removing..." : "Yes, Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
