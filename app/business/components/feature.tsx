export type FeatureProps = {
  title: string;
  description: string;
};

export default function Feature({
  title,
  description,
}: FeatureProps) {
  return (
    <div className="py-7 px-6 md:px-14 border-r-0 md:border-r last:border-r-0 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
}