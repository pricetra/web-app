import { useEffect, useState } from "react";

export default function useAppleLogin() {
  const [popupRef, setPopupRef] = useState<WindowProxy | null>(null);

  useEffect(() => {
    if (!popupRef) return;

    popupRef.addEventListener("message", (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { data } = event;
      if (data.type === "apple-oauth-success") {
        // Handle successful Apple OAuth here
        const { code, id_token } = data.payload;
        console.log("Apple OAuth Success:", code, id_token);
        // You can close the popup after successful login
        popupRef.close();
      } else if (data.type === "apple-oauth-error") {
        // Handle Apple OAuth error here
        console.error("Apple OAuth Error:", data.payload);
        popupRef.close();
      }
    });
  }, [popupRef]);

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
          })
        );
      }
      const popup = window.open(
        `${url}?${params.toString()}`,
        "_blank",
        "width=500,height=600"
      );
      setPopupRef(popup);
    },
    popupRef,
  };
}
