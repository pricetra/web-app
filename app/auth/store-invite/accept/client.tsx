"use client";

import { useAuth } from "@/context/user-context";
import { useMutation } from "@apollo/client/react";
import {
  AcceptPendingStoreUserInviteDocument,
  StoreUserData,
} from "graphql-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdCheckCircle, MdError } from "react-icons/md";

export type AcceptInviteClientProps = {
  data: string;
  parsedData: StoreUserData;
};

export const STORE_INVITE = "STORE_INVITE";

export default function AcceptInviteClient({
  data,
  parsedData,
}: AcceptInviteClientProps) {
  const { loggedIn } = useAuth();
  const router = useRouter();
  const [acceptInvite, { loading, error, data: acceptData }] = useMutation(
    AcceptPendingStoreUserInviteDocument
  );

  useEffect(() => {
    if (!loggedIn) {
      const returnTo = `/auth/store-invite/accept?data=${data}`;
      router.push(
        `/auth/signup?email=${encodeURIComponent(parsedData.email)}&reason=${STORE_INVITE}&return=${returnTo}`
      );
      return;
    }

    acceptInvite({
      variables: { data },
    })
      .then(({ data: acceptData }) => {
        if (!acceptData) return;

        const storeUser = acceptData.acceptPendingStoreUserInvite;
        const store = storeUser.store?.slug ?? storeUser.storeId;
        const branch = storeUser.branch?.slug;

        document.title = "Invite accepted";

        setTimeout(() => {
          router.replace(`/stores/${store}/${branch ?? ""}`);
        }, 1000);
      })
      .catch(() => {
        document.title = "Could not process invite";
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, data, parsedData]);

  return (
    <div className="w-full px-5 py-20">
      {loading && (
        <div className="flex flex-col gap-5 items-center">
          <CgSpinner className="animate-spin size-16" />
          <h3>Processing invite</h3>
        </div>
      )}

      {error && (
        <div className="flex flex-col gap-5 items-center">
          <MdError className="size-16 text-red-700" />
          <div>
            <h3 className="font-bold text-lg text-center">
              Invite request failed
            </h3>
            <p>We could not process your invite link: {error.message}</p>
          </div>
        </div>
      )}

      {acceptData && (
        <div className="flex flex-col gap-5 items-center">
          <MdCheckCircle className="size-16 text-green-700" />
          <div>
            <h3 className="font-bold text-lg text-center">
              Joined {acceptData.acceptPendingStoreUserInvite.store?.name} Successfully!
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
