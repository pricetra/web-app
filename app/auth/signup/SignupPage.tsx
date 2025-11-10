"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  AuthDeviceType,
  GoogleOAuthDocument,
  LoginInternalDocument,
} from "@/graphql/types/graphql";
import AuthContainer from "@/components/auth/auth-container";
import { useGoogleLogin } from "@react-oauth/google";

export default function SignupPage({ ipAddress }: { ipAddress: string }) {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [login, { error: loginInternalError, loading: loginInternalLoading }] =
    useMutation(LoginInternalDocument, {
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
          device: AuthDeviceType.Web,
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
      title="Create your account"
      buttonLabel="Sign Up"
      description="Signup to start tracking prices and managing your purchases"
      onPressSubmit={onPressLoginInternal}
      error={error?.message}
      onPressApple={() => {}}
      onPressGoogle={googleOAuthCallback}
      loading={loading}
      extras={
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      }
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          required
          value={email}
          onChange={(v) => setEmail(v.target.value)}
          disabled={loading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Full name</Label>
        <Input
          id="fullname"
          type="text"
          placeholder="John Doe"
          required
          value={fullname}
          onChange={(v) => setFullname(v.target.value)}
          disabled={loading}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="ml-auto text-xs underline-offset-2 hover:underline text-gray-600 hover:text-black"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(v) => setPassword(v.target.value)}
          disabled={loading}
        />
      </div>
    </AuthContainer>
  );
}
