import { ReactNode } from "react";

type FeatureProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export default function Feature({
  title,
  description,
  icon: Icon,
}: FeatureProps) {
  return (
    <div
      className="bg-white rounded-xl p-8 border border-slate-200 hover:border-slate-300 transition-colors"
      data-aos="fade-up"
    >
      <div className="text-pricetra-green-dark mb-4">
        {Icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
