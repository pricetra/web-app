"use client";

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ResendVerificationDocument, VerifyEmailDocument } from "graphql-utils";
import AuthContainer from "@/components/auth/auth-container";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BsEnvelopeCheck } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const CELL_COUNT = 6;

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("return");
  const emailSearchParam = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [verify, { error: verifyError, loading: verifyLoading }] = useMutation(
    VerifyEmailDocument,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [resend, { error: resendError, loading: resendLoading }] = useMutation(
    ResendVerificationDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  const loading = verifyLoading || resendLoading;
  const error = verifyError || resendError;

  function onPressVerify() {
    verify({
      variables: { verificationCode },
    }).then(({ data }) => {
      if (!data) return;
      const paramsBuilder = new URLSearchParams();
      paramsBuilder.set("email", data.verifyEmail.email);
      paramsBuilder.set(
        "emailVerificationStatus",
        String(data.verifyEmail.active),
      );
      if (returnPath) {
        paramsBuilder.set("return", returnPath);
      }
      router.push(`/auth/login?${paramsBuilder.toString()}`);
    });
  }

  useEffect(() => {
    if (emailSearchParam && emailSearchParam.length > 1) return;
    router.push("/auth/signup");
  }, [emailSearchParam, router]);

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
          <Button
            variant="link"
            className="underline underline-offset-4 px-1"
            onClick={() =>
              resend({ variables: { email: emailSearchParam ?? "" } })
            }
          >
            Resend code
          </Button>
        </div>
      }
    >
      {!error && emailSearchParam && (
        <Alert variant="success">
          <BsEnvelopeCheck />
          <AlertTitle>Verification email sent!</AlertTitle>
          <AlertDescription>
            An email with the verification code was sent to{" "}
            <i>{emailSearchParam}</i>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <div className="flex flex-row justify-center mt-2">
          <InputOTP
            maxLength={CELL_COUNT}
            value={verificationCode}
            onChange={(value) => setVerificationCode(value)}
            id="code"
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              {Array(CELL_COUNT)
                .fill(0)
                .map((_, i) => (
                  <InputOTPSlot index={i} key={`code-${i}`} />
                ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
    </AuthContainer>
  );
}
