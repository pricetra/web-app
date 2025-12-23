export type FeatureProps = {
  title: string;
  description: string;
};

export default function Feature({
  title,
  description,
}: FeatureProps) {
  return (
    <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
}