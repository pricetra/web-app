"use client";

import { useAuth } from "@/context/user-context";
import { useMutation } from "@apollo/client/react";
import { DeleteMyAccountDocument } from "graphql-utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function deleteAccountPrompt(callback: () => void) {
  const confirmation = "PERMANENTLY DELETE MY ACCOUNT";
  const promptText = window.prompt(
    `Type "${confirmation}" to confirm account deletion. This action is irreversible.`,
  );
  if (promptText === confirmation) {
    callback();
  } else {
    alert("Incorrect confirmation text. Account deletion cancelled.");
  }
}

export default function DeleteAccountClient() {
  const router = useRouter();
  const { loggedIn, user, lists, logout } = useAuth();
  const [permanentlyDeleteMyAccount] = useMutation(DeleteMyAccountDocument);

  if (!loggedIn || !user) return <></>;

  return (
    <div>
      <div className="border border-red-600/30 bg-red-100/20 p-5 rounded-lg">
        <h3 className="font-bold text-2xl mb-5 text-red-700">
          Permanently Delete My Account
        </h3>

        <div className="flex flex-col gap-7 justify-between">
          <div>
            <p className="text-black mt-2">
              This action cannot be undone. All your personal data will be
              removed, and your user information will be disassociated from your
              account.
            </p>

            <h5 className="font-bold font-lg mt-2">This action will delete <i>your</i></h5>
            <ul className="list-disc list-inside">
              <li>Email ({user.email})</li>
              <li>Hashed passwords (if set)</li>
              <li>Full name ({user.name})</li>
              <li>Avatar image</li>
              <li>
                Other profile related information like (Phone number, Address,
                Birth date, etc.)
              </li>
              <li>
                Lists created by you and all products/branches within those lists
                <ul className="list-inside list-decimal ml-5">
                  {lists?.allLists?.map((list) => (
                    <li key={list.id}>{list.name} ({(list.branchList?.length ?? 0) + (list.productList?.length ?? 0)} items)</li>
                  ))}
                </ul>
              </li>
              <li>All your grocery lists and the contents within them</li>
              <li>Any relations to any product, store, branch, or price creation/management</li>
              <li><i>Your account will no longer be accessible or recoverable after deletion</i></li>
            </ul>
          </div>
          <div>
            <Button
              onClick={() => {
                deleteAccountPrompt(() => {
                  permanentlyDeleteMyAccount().then(() => {
                    logout().finally(() => {
                      router.push("/");
                    });
                  });
                });
              }}
              variant="destructive"
              className="float-right"
            >
              <b>
                Confirm and Delete My Account
              </b>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
