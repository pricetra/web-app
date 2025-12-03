import LoginSignupButtons from "@/components/login-signup-buttons";

export default function WelcomeHeroBanner() {
  return (
    <div className="px-5 lg:px-0 mb-10">
      <div className="text-center bg-gray-50 border border-gray-200 px-7 py-8 sm:py-10 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Beat Inflation. <span>Track Prices.</span>{" "}
            <span className="text-pricetra-green-dark">Save Money.</span>
          </h1>
        </div>
        <p className="mt-5 text-sm md:text-base text-slate-800 max-w-3xl mx-auto">
          Pricetra is a community-powered price tracking app that helps shoppers
          discover the best deals nearby. Compare prices, and get notified when
          prices change.
        </p>

        <div className="mt-10">
          <LoginSignupButtons />
        </div>
      </div>
    </div>
  );
}
