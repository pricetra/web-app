import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

export type AppleOAuthSuccessData = {
  code: string;
  id_token: string;
  user?: string;
};

export default function useAppleLogin() {
  const [data, setData] = useState<AppleOAuthSuccessData>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { data } = event;
      const { type, ...res } = data;
      if (type === "APPLE_AUTH_SUCCESS") {
        setData(res);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    launchAppleOAuth: () => {
      const url = "https://appleid.apple.com/auth/authorize";
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_APPLE_OAUTH_CLIENT_ID ?? "",
        redirect_uri: `https://pricetra.com/auth/apple`,
        response_type: "code id_token",
        scope: "name email",
        response_mode: "form_post",
      });
      if (process.env.NODE_ENV !== "production") {
        params.set(
          "state",
          JSON.stringify({
            returnTo: `${window.location.origin}/auth/apple`,
          }),
        );
      }
      const authFlowUrl = `${url}?${params.toString()}`;
      let popup: Window | null = null;
      if (isMobile) {
        window.location.href = authFlowUrl;
      } else {
        popup = window.open(authFlowUrl, "_blank", "width=500,height=600");

        if (!popup) {
          window.alert("Popup blocked! Please allow popups for this website.");
          return;
        }
      }

    },
    data,
  };
}
