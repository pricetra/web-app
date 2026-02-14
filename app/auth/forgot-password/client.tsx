"use client";
import AuthContainer from "@/components/auth/auth-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  RequestResetPasswordDocument,
  UpdatePasswordWithResetCodeDocument,
  VerifyPasswordResetCodeDocument,
} from "graphql-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BsEnvelopeCheck } from "react-icons/bs";
import { toast } from "sonner";
import NProgress from "nprogress";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const CELL_COUNT = 6;

export default function ForgotPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("return");
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [
    requestCode,
    {
      data: requestCodeData,
      error: requestCodeError,
      loading: requestCodeLoading,
    },
  ] = useMutation(RequestResetPasswordDocument);
  const [
    verifyResetCode,
    {
      data: verificationData,
      error: verificationError,
      loading: verificationLoading,
    },
  ] = useLazyQuery(VerifyPasswordResetCodeDocument);
  const [
    resetPassword,
    { data: resetData, error: resetError, loading: resetting },
  ] = useMutation(UpdatePasswordWithResetCodeDocument);

  const loading = requestCodeLoading || verificationLoading || resetting;
  const error = requestCodeError || verificationError || resetError;

  const paramsBuilder = useMemo(() => {
    const paramsBuilder = new URLSearchParams();
    if (email) {
      paramsBuilder.set("email", email);
    }
    if (returnPath) {
      paramsBuilder.set("return", returnPath);
    }
    return paramsBuilder;
  }, [email, returnPath]);

  useEffect(() => {
    if (email && email.length > 1) return;
    router.push(`/auth/login?${paramsBuilder.toString()}`);
  }, [email, router, paramsBuilder]);

  useEffect(() => {
    if (!requestCodeError) return;

    toast.error(
      "Could not send reset email. Perhaps the email you entered was incorrect?",
    );
    router.push(`/auth/login?${paramsBuilder.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestCodeError, paramsBuilder]);

  useEffect(() => {
    if (!email) return;

    NProgress.start();
    requestCode({ variables: { email } }).finally(() => NProgress.done());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (!resetData?.updatePasswordWithResetCode) return;

    toast.success("Password updated! Please use the new password to login");
    router.push(`/auth/login?${paramsBuilder.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetData, paramsBuilder]);

  if (!email) return <></>;

  return (
    <AuthContainer
      title="Reset Password"
      buttonLabel={!verificationData ? "Verify Reset Code" : "Update Password"}
      onPressSubmit={
        !verificationData
          ? () => verifyResetCode({ variables: { email, code } })
          : () =>
              resetPassword({
                variables: { email, code, newPassword },
              })
      }
      error={error?.message}
      loading={loading}
      extras={
        <div className="text-center text-sm">
          Didn&apos;t get an email?{" "}
          <Button
            variant="link"
            className="underline underline-offset-4 px-1"
            onClick={() => requestCode({ variables: { email } })}
          >
            Resend reset code
          </Button>
        </div>
      }
    >
      {!requestCodeError && requestCodeData?.requestPasswordReset && (
        <Alert variant="success">
          <BsEnvelopeCheck />
          <AlertTitle>Password reset email sent!</AlertTitle>
          <AlertDescription>
            Your password reset code was sent to <i>{email}</i>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        {!verificationData ? (
          <>
            <Label htmlFor="code">Code</Label>

            <div className="flex flex-row items-center justify-center">
              <InputOTP
                maxLength={CELL_COUNT}
                value={code}
                onChange={(value) => setCode(value)}
                id="code"
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
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
          </>
        ) : (
          <>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(v) => setNewPassword(v.target.value)}
              disabled={resetting}
            />
          </>
        )}
      </div>
    </AuthContainer>
  );
}
