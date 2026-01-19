import { useEffect, useState } from "react";

export type YahooOAuthSuccessData = {
  code: string;
}

export default function useYahooLogin() {
  const [data, setData] = useState<YahooOAuthSuccessData>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { data } = event;
      const {type, ...res} = data;
      if (type === "YAHOO_AUTH_SUCCESS") {
        setData(res);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    launchYahooOAuth: () => {
      const url = "https://api.login.yahoo.com/oauth2/request_auth";
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_YAHOO_OAUTH_CLIENT_ID ?? "",
        redirect_uri: `https://pricetra.com/auth/yahoo`,
        response_type: "code",
        scope: "openid",
      });
      if (process.env.NODE_ENV !== "production") {
        params.set(
          "state",
          encodeURIComponent(JSON.stringify({
            returnTo: `${window.location.origin}/auth/yahoo`,
          }))
        );
      }
      const popup = window.open(
        `${url}?${params.toString()}`,
        "_blank",
        "width=500,height=600"
      );

      if (!popup) {
        window.alert("Popup blocked! Please allow popups for this website.");
        return;
      }
    },
    data,
  };
}
