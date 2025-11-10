"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import {
  AuthDeviceType,
  GoogleOAuthDocument,
  LoginInternalDocument,
} from "@/graphql/types/graphql";
import AuthContainer from "@/components/auth/auth-container";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage({ ipAddress }: { ipAddress: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { error: loginInternalError, loading: loginInternalLoading }] =
    useLazyQuery(LoginInternalDocument, {
      fetchPolicy: "no-cache",
    });
  const [
    loginGoogle,
    { error: loginGoogleError, loading: loginGoogleLoading },
  ] = useLazyQuery(GoogleOAuthDocument, {
    fetchPolicy: "no-cache",
  });
  const loading = loginInternalLoading || loginGoogleLoading;
  const error = loginInternalError || loginGoogleError;

  function onPressLoginInternal() {
    login({
      variables: { email, password, device: AuthDeviceType.Web, ipAddress },
    }).then(({ data }) => {
      if (!data) return;
      console.log(data.login);
    });
  }

  const googleOAuthCallback = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginGoogle({
        variables: {
          accessToken: tokenResponse.access_token,
          ipAddress,
        },
      }).then(({ data }) => {
        if (!data) return;
        console.log(data.googleOAuth);
      });
    },
  });

  return (
    <AuthContainer
      title="Welcome back"
      description="Login to your Pricetra account"
      onPressSubmit={onPressLoginInternal}
      error={error?.message}
      onPressApple={() => {}}
      onPressGoogle={googleOAuthCallback}
      loading={loading}
      extras={
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      }
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(v) => setEmail(v.target.value)}
          disabled={loading}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="#"
            className="ml-auto text-xs underline-offset-2 hover:underline text-gray-600 hover:text-black"
          >
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(v) => setPassword(v.target.value)}
          disabled={loading}
        />
      </div>
    </AuthContainer>
  );
}
