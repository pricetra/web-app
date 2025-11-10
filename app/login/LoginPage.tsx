"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { LoginInternalDocument } from "@/graphql/types/graphql";
import AuthContainer from "@/components/auth/auth-container";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, error, loading }] = useLazyQuery(
    LoginInternalDocument,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (!data) return;
    console.log(data.login);
  }, [data]);

  return (
    <AuthContainer
      title="Welcome back"
      description="Login to your Pricetra account"
      onPressSubmit={() => login({ variables: { email, password } })}
      error={error?.message}
      onPressApple={() => {}}
      onPressGoogle={() => {}}
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
