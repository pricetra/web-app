export type StepProps = {
  number: string;
  title: string;
  description: string;
};

export default function Step({
  number,
  title,
  description,
}: StepProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pricetra-green-dark text-white font-bold">
        {number}
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
