import AuthContainer from "@/components/auth/auth-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "@/components/ui/link";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  RequestResetPasswordDocument,
  UpdatePasswordWithResetCodeDocument,
  VerifyPasswordResetCodeDocument,
} from "graphql-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsEnvelopeCheck } from "react-icons/bs";

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

  useEffect(() => {
    if (email && email.length > 1) return;
    router.push("/auth/signup");
  }, [email, router]);

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
          <Link
            href="#"
            className="underline underline-offset-4"
            onClick={() => requestCode({ variables: { email } })}
          >
            Resend reset code
          </Link>
        </div>
      }
    >
      {!error && email && (
        <Alert variant="success">
          <BsEnvelopeCheck />
          <AlertTitle>Verification email sent!</AlertTitle>
          <AlertDescription>
            An email with the verification code was sent to <i>{email}</i>
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