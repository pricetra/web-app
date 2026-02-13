"use client"

import LandingHeader from "@/components/ui/landing-header";
import BusinessForm from "../components/business-form";
import Footer from "@/components/ui/footer";

export default function BusinessSignupPageClient() {
  return (
    <main className="bg-white">
      <LandingHeader />

      <section className="max-w-2xl p-5 mx-auto md:mt-5">
        <BusinessForm />
      </section>

      <Footer />
    </main>
  );
}
