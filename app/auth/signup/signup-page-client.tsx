"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  AppleOAuthDocument,
  Auth,
  AuthDeviceType,
  CreateAccountDocument,
  GoogleOAuthDocument,
  YahooOAuthDocument,
} from "graphql-utils";
import AuthContainer from "@/components/auth/auth-container";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { cookieDefaults, SITE_COOKIES } from "@/lib/cookies";
import { useAuth } from "@/context/user-context";
import useAppleLogin from "@/hooks/useAppleLogin";
import { STORE_INVITE } from "../store-invite/accept/client";
import { MdError } from "react-icons/md";
import dayjs from "dayjs";
import useYahooLogin from "@/hooks/useYahooLogin";

export default function SignupPage({ ipAddress }: { ipAddress: string }) {
  const { loggedIn, loading: authLoading } = useAuth();
  const [, setCookie] = useCookies(SITE_COOKIES);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("return");
  const emailSearchParam = searchParams.get("email");
  const reasonSearchParam = searchParams.get("reason");

  const { launchAppleOAuth, data: appleOAuthSuccessData } = useAppleLogin();
  const { launchYahooOAuth, data: yahooOAuthSuccessData } = useYahooLogin();

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
  const [loginYahoo, { error: loginYahooError, loading: loginYahooLoading }] =
    useLazyQuery(YahooOAuthDocument, {
      fetchPolicy: "no-cache",
    });
  const loading = signupLoading || loginGoogleLoading || loginAppleLoading || loginYahooLoading || authLoading;
  const error = signupError || loginGoogleError || loginAppleError || loginYahooError;

  function onPressSignup() {
    signup({
      variables: { email, password, name },
    }).then(({ data }) => {
      if (!data) return;

      const paramsBuilder = new URLSearchParams();
      paramsBuilder.set("email", data.createAccount.email);
      if (returnPath) {
        paramsBuilder.set("return", returnPath);
      }
      router.push(`/auth/email-verification?${paramsBuilder.toString()}`);
    });
  }

  function setAuthCookie(token: string) {
    setCookie("auth_token", token, {
      ...cookieDefaults,
      expires: dayjs().add(30, "days").toDate(),
    });
  }

  function handleAuth(auth?: Auth) {
    if (!auth) return;
    if (!auth.user.active) return;

    setAuthCookie(auth.token);
  }

  const googleOAuthCallback = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginGoogle({
        variables: {
          accessToken: tokenResponse.access_token,
          device: AuthDeviceType.Web,
          ipAddress,
        },
      }).then(({ data }) => handleAuth(data?.googleOAuth as Auth));
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
    }).then(({ data }) => handleAuth(data?.appleOAuth as Auth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appleOAuthSuccessData, returnPath]);

  useEffect(() => {
    if (!yahooOAuthSuccessData) return;

    const { code } = yahooOAuthSuccessData;
    loginYahoo({
      variables: {
        code,
        device: AuthDeviceType.Web,
        ipAddress,
      },
    }).then(({ data }) => handleAuth(data?.yahooOAuth as Auth));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yahooOAuthSuccessData]);

  useEffect(() => {
    if (!loggedIn) return;

    router.replace(returnPath ?? "/home");
  }, [loggedIn, router, returnPath]);

  useEffect(() => {
    if (!emailSearchParam) return;
    setEmail(emailSearchParam);
  }, [emailSearchParam]);

  return (
    <AuthContainer
      title="Create your account"
      description="Sign up and start saving today"
      buttonLabel="Sign up"
      onPressSubmit={onPressSignup}
      error={error?.message}
      onPressApple={launchAppleOAuth}
      onPressGoogle={googleOAuthCallback}
      onPressYahoo={launchYahooOAuth}
      loading={loading}
      extras={
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href={`/auth/login?email=${encodeURIComponent(email)}${
              returnPath ? `&return=${returnPath}` : ""
            }`}
            className="underline underline-offset-4"
          >
            Login
          </Link>
        </div>
      }
    >
      {reasonSearchParam && reasonSearchParam === STORE_INVITE && (
        <div className="bg-orange-700 text-white p-3 flex flex-row items-center gap-2 rounded-md">
          <MdError className="size-5" />
          <span className="text-sm">Login or Signup to accept this invite</span>
        </div>
      )}

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
