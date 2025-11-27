"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  ResendVerificationDocument,
  VerifyEmailDocument,
} from "graphql-utils/types/graphql";
import AuthContainer from "@/components/auth/auth-container";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BsEnvelopeCheck } from "react-icons/bs";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailSearchParam = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [verify, { error: verifyError, loading: verifyLoading }] = useMutation(
    VerifyEmailDocument,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [resend, { error: resendError, loading: resendLoading }] = useMutation(
    ResendVerificationDocument,
    {
      fetchPolicy: "no-cache",
    }
  );

  const loading = verifyLoading || resendLoading;
  const error = verifyError || resendError;

  function onPressVerify() {
    verify({
      variables: { verificationCode },
    }).then(({ data }) => {
      if (!data) return;
      router.push(
        `/auth/login?email=${data.verifyEmail.email}&emailVerificationStatus=${data.verifyEmail.active}`
      );
    });
  }

  useEffect(() => {
    if (emailSearchParam && emailSearchParam.length > 1) return;
    router.push('/auth/signup');
  }, [emailSearchParam, router])

  return (
    <AuthContainer
      title="Verify your email"
      description="Almost done, we just need to verify your email"
      buttonLabel="Verify"
      onPressSubmit={onPressVerify}
      error={error?.message}
      loading={loading}
      extras={
        <div className="text-center text-sm">
          Didn&apos;t get an email?{" "}
          <Link href="#" className="underline underline-offset-4" onClick={() => resend({ variables: {email: emailSearchParam ?? ''} })}>
            Resend verification code
          </Link>
        </div>
      }
    >
      {!error && emailSearchParam && (
        <Alert variant="success">
          <BsEnvelopeCheck />
          <AlertTitle>Verification email sent!</AlertTitle>
          <AlertDescription>
            An email with the verification code was sent to <i>{emailSearchParam}</i>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">Code</Label>
        <Input
          id="code"
          type="number"
          placeholder="Verification code"
          required
          value={verificationCode}
          onChange={(v) => setVerificationCode(v.target.value)}
          disabled={verifyLoading}
        />
      </div>
    </AuthContainer>
  );
}
