import LoginSignupButtons from "@/components/login-signup-buttons";

export default function WelcomeHeroBanner() {
  return (
    <div className="px-5 mb-10">
      <div className="text-center bg-gray-50 border border-gray-200 px-7 py-8 sm:py-10 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Beat Inflation. <span>Track Prices.</span>{" "}
            <span className="text-pricetra-green-dark">Save Money.</span>
          </h1>
        </div>
        <p className="mt-5 text-sm md:text-base text-slate-800 max-w-3xl mx-auto">
          Search products, compare prices across stores, discover local retailers, and get notified when prices drop. Start shopping smarter with Pricetra today for free.
        </p>

        <div className="mt-10">
          <LoginSignupButtons />
        </div>
      </div>
    </div>
  );
}
