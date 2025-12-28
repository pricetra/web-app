"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  AppleOAuthDocument,
  AuthDeviceType,
  CreateAccountDocument,
  GoogleOAuthDocument,
} from "graphql-utils";
import AuthContainer from "@/components/auth/auth-container";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { AUTH_TOKEN_KEY, cookieDefaults, SITE_COOKIES } from "@/lib/cookies";
import { useAuth } from "@/context/user-context";
import useAppleLogin from "@/hooks/useAppleLogin";

export default function SignupPage({ ipAddress }: { ipAddress: string }) {
  const { loggedIn } = useAuth();
  const [, setCookie] = useCookies(SITE_COOKIES);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailSearchParam = searchParams.get("email");

  const { launchAppleOAuth, data: appleOAuthSuccessData } = useAppleLogin();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { error: signupError, loading: signupLoading }] = useMutation(
    CreateAccountDocument,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [
    loginGoogle,
    { error: loginGoogleError, loading: loginGoogleLoading },
  ] = useLazyQuery(GoogleOAuthDocument, {
    fetchPolicy: "no-cache",
  });
  const [loginApple, { error: loginAppleError, loading: loginAppleLoading }] =
    useLazyQuery(AppleOAuthDocument, {
      fetchPolicy: "no-cache",
    });
  const loading = signupLoading || loginGoogleLoading || loginAppleLoading;
  const error = signupError || loginGoogleError || loginAppleError;

  function onPressSignup() {
    signup({
      variables: { email, password, name },
    }).then(({ data }) => {
      if (!data) return;
      router.push(`/auth/email-verification?email=${data.createAccount.email}`);
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
        setCookie(AUTH_TOKEN_KEY, data.googleOAuth.token, cookieDefaults);
        router.replace("/home");
      });
    },
  });

  useEffect(() => {
    if (!appleOAuthSuccessData) return;

    const { code, user: appleRawUser } = appleOAuthSuccessData;
    loginApple({
      variables: {
        code,
        appleRawUser,
        device: AuthDeviceType.Web,
        ipAddress,
      },
    }).then(({ data }) => {
      if (!data) return;
      setCookie(AUTH_TOKEN_KEY, data.appleOAuth.token, cookieDefaults);
      router.replace("/home");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appleOAuthSuccessData]);

  useEffect(() => {
    if (!loggedIn) return;
    router.replace("/home");
  }, [loggedIn, router]);

  useEffect(() => {
    if (!emailSearchParam) return;
    setEmail(emailSearchParam);
  }, [emailSearchParam]);

  return (
    <AuthContainer
      title="Create your account"
      description="Sign up and start saving today"
      buttonLabel="Sign Up"
      onPressSubmit={onPressSignup}
      error={error?.message}
      onPressApple={launchAppleOAuth}
      onPressGoogle={googleOAuthCallback}
      loading={loading}
      extras={
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href={`/auth/login?email=${email}`}
            className="underline underline-offset-4"
          >
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
        <Label htmlFor="fullname">Full name</Label>
        <Input
          id="fullname"
          type="text"
          placeholder="John Doe"
          required
          value={name}
          onChange={(v) => setName(v.target.value)}
          disabled={loading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
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
