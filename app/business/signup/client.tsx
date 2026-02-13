"use client";

import LandingHeader from "@/components/ui/landing-header";
import BusinessForm from "../components/business-form";
import Footer from "@/components/ui/footer";
import { useRouter } from "next/navigation";

export default function BusinessSignupPageClient() {
  const router = useRouter();

  return (
    <main className="bg-white">
      <LandingHeader />

      <section className="max-w-2xl p-5 mx-auto md:mt-5">
        <BusinessForm onCancel={() => router.push("/business")} />

        <div style={{ height: "15vh" }} />
      </section>

      <Footer />
    </main>
  );
}
