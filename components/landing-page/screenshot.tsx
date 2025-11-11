export default function StepsPanel(props: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
      <div className="text-sm font-semibold text-pricetra-green-dark">
        Step {props.step}
      </div>
      <h3 className="mt-2 font-semibold text-slate-900">{props.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{props.description}</p>
    </div>
  );
}

export const steps = [
  {
    title: "Find products and stores",
    description:
      "Search products near you and browse branches to see current prices and trends.",
  },
  {
    title: "Scan and Search prices",
    description:
      "Finding prices for a product is as simple as scanning the barcode. Scan and find prices and sales in nearby stores.",
  },
  {
    title: "Report accurate prices",
    description:
      "Visit a store and submit a price within ~500 meters. Unit counts help normalize costs.",
  },
  {
    title: "Watch and get alerts",
    description:
      "Add items or branches to your watchlist and get notified when prices change.",
  },
];
