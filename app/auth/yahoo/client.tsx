"use client";

import { useEffect } from "react";

export type YahooOAuthSuccessPageProps = {
  code: string;
  state?: string;
};

export default function YahooOAuthSuccessClient(
  props: YahooOAuthSuccessPageProps
) {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "YAHOO_AUTH_SUCCESS", ...props },
        "*"
      );
    }

    window.close();
  }, [props]);

  return <></>;
}
