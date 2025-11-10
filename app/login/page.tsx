import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login - Pricetra",
  };
}

export default function LoginPage() {
  return (
    <>
      <div>Login page</div>
    </>
  );
}
