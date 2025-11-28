"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  Auth,
  AuthDeviceType,
  GoogleOAuthDocument,
  LoginInternalDocument,
  ResendVerificationDocument,
} from "graphql-utils";
import AuthContainer from "@/components/auth/auth-container";
import { useGoogleLogin } from "@react-oauth/google";
import { useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { cookieDefaults, SITE_COOKIES } from "@/lib/cookies";
import dayjs from "dayjs";
import { toBoolean } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BsEnvelopeCheck } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/user-context";

export default function LoginPage({ ipAddress }: { ipAddress: string }) {
  const { loggedIn } = useAuth();
  const [, setCookie] = useCookies(SITE_COOKIES);

  const router = useRouter();
  const searchParams = useSearchParams();
  const emailSearchParam = searchParams.get("email");
  const emailVerificationStatus = toBoolean(
    searchParams.get("emailVerificationStatus") ?? undefined
  );

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
  const [resend, { error: resendError, loading: resendLoading }] = useMutation(
    ResendVerificationDocument,
    {
      fetchPolicy: "no-cache",
    }
  );
  const loading = loginInternalLoading || loginGoogleLoading || resendLoading;
  const error = loginInternalError || loginGoogleError || resendError;

  function setAuthCookie(token: string) {
    setCookie("auth_token", token, {
      ...cookieDefaults,
      expires: dayjs().add(30, "days").toDate(),
    });
  }

  function handleAuthSuccess(auth?: Auth) {
    if (!auth) return;
    if (!auth.user.active) {
      resend({
        variables: { email: auth.user.email },
      }).then(({ data }) => {
        if (!data) return;
        router.push(
          `/auth/email-verification?email=${encodeURIComponent(
            auth.user.email
          )}`
        );
      });
      return;
    }

    setAuthCookie(auth.token);
    router.replace(searchParams.get("return") ?? "/home");
  }

  function onPressLoginInternal() {
    login({
      variables: { email, password, device: AuthDeviceType.Web, ipAddress },
    }).then(({ data }) => handleAuthSuccess(data?.login as Auth));
  }

  const googleOAuthCallback = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginGoogle({
        variables: {
          accessToken: tokenResponse.access_token,
          device: AuthDeviceType.Web,
          ipAddress,
        },
      }).then(({ data }) => handleAuthSuccess(data?.googleOAuth as Auth));
    },
    onError: (err) => {
      alert(err.error);
    },
  });

  useEffect(() => {
    if (!loggedIn) return;

    router.replace("/");
  }, [loggedIn, router]);

  useEffect(() => {
    if (!emailSearchParam) return;
    setEmail(emailSearchParam);
  }, [emailSearchParam]);

  return (
    <AuthContainer
      title="Welcome back"
      buttonLabel="Login"
      description="Login to your Pricetra account"
      onPressSubmit={onPressLoginInternal}
      error={error?.message}
      onPressApple={() => {}}
      onPressGoogle={googleOAuthCallback}
      loading={loading}
      extras={
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/signup?email=${email}`}
            className="underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      }
    >
      {!error && emailVerificationStatus && (
        <Alert variant="success">
          <BsEnvelopeCheck />
          <AlertTitle>Email verified!</AlertTitle>
          <AlertDescription>
            Your email address was successfully verified
          </AlertDescription>
        </Alert>
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
