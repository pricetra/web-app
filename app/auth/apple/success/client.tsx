"use client";

import { useEffect } from "react";

export type AppleOAuthSuccessPageProps = {
  code: string;
  id_token: string;
  user?: string;
};

export default function AppleOAuthSuccessClient(
  props: AppleOAuthSuccessPageProps
) {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "APPLE_AUTH_SUCCESS", ...props },
        window.location.origin
      );
    }

    window.close();
  }, []);

  return <></>;
}
