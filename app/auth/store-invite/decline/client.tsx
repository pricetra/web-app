"use client";

import { useAuth } from "@/context/user-context";
import { useMutation } from "@apollo/client/react";
import {
  DeclinePendingStoreUserInviteDocument,
  StoreUserData,
} from "graphql-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdCheckCircle, MdError } from "react-icons/md";

export type DeclineInviteClientProps = {
  data: string;
  parsedData: StoreUserData;
};

export const STORE_INVITE_DECLINE = "STORE_INVITE_DECLINE";

export default function DeclineInviteClient({
  data,
  parsedData,
}: DeclineInviteClientProps) {
  const { loggedIn } = useAuth();
  const router = useRouter();
  const [declineInvite, { loading, error, data: acceptData }] = useMutation(
    DeclinePendingStoreUserInviteDocument
  );

  useEffect(() => {
    if (!loggedIn) {
      const returnTo = encodeURIComponent(
        `/auth/store-invite/decline?data=${data}`
      );
      router.push(
        `/auth/signup?email=${encodeURIComponent(parsedData.email)}&reason=${STORE_INVITE_DECLINE}&return=${returnTo}`
      );
      return;
    }

    declineInvite({
      variables: { data },
    })
      .then(({ data: declineData }) => {
        if (!declineData) return;

        document.title = "Invitation declined";
      })
      .catch(() => {
        document.title = "Could not process";
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, data, parsedData]);

  return (
    <div className="w-full px-5 py-20">
      {loading && (
        <div className="flex flex-col gap-5 items-center">
          <CgSpinner className="animate-spin size-16" />
          <h3>Processing</h3>
        </div>
      )}

      {error && (
        <div className="flex flex-col gap-5 items-center">
          <MdError className="size-16 text-red-700" />
          <div>
            <h3 className="font-bold text-lg text-center">
              Decline request failed
            </h3>
            <p>We could not process your decline request: {error.message}</p>
          </div>
        </div>
      )}

      {acceptData && (
        <div className="flex flex-col gap-5 items-center">
          <MdCheckCircle className="size-16 text-green-700" />
          <div>
            <h3 className="font-bold text-lg text-center">Invite declined!</h3>
          </div>
        </div>
      )}
    </div>
  );
}
