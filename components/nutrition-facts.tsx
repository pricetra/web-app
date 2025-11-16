import { ProductNutrition } from "@/graphql/types/graphql";
import { formatNutrient } from "@/lib/strings";

export default function NutritionFacts({
  nutriments,
  servingSize,
}: ProductNutrition) {
  if (!nutriments) return;
  return (
    <div className="mx-auto md:mx-0 w-full max-w-72 border border-black bg-white p-3">
      <h3 className="text-2xl font-extrabold text-black">
        Nutrition Facts
      </h3>
      <div className="mb-1 mt-2 border-t-8 border-black" />
      <h5 className="text-xs text-black">Serving Size {servingSize}</h5>
      <div className="my-1 border-t-2 border-black" />

      {/* Calories */}
      <div className="flex flex-row items-end justify-between w-full">
        <span className="text-lg font-bold text-black">Calories</span>
        <span className="text-2xl font-extrabold text-black">
          {formatNutrient(
            Math.round(
              nutriments.energyKcalServing ?? nutriments.energyKcal100g ?? 0
            )
          )}
        </span>
      </div>

      <div className="my-1 border-t-4 border-black" />

      {/* % Daily Value */}
      <h6 className="text-xs font-bold text-black">% Daily Value*</h6>

      {/* Fat */}
      <Row
        label="Total Fat"
        value={nutriments.fatServing ?? nutriments.fat100g}
        unit={nutriments.fatUnit}
        bold
      />
      <RowSub
        label="Saturated Fat"
        value={nutriments.saturatedFatServing ?? nutriments.saturatedFat100g}
        unit={nutriments.saturatedFatUnit}
      />
      <RowSub
        label="Trans Fat"
        value={nutriments.transFatServing ?? nutriments.transFat100g}
        unit={nutriments.transFatUnit}
      />

      {/* Cholesterol */}
      <Row label="Cholesterol" value={nutriments.cholesterol100g} unit="g" />

      {/* Sodium */}
      <Row
        label="Sodium"
        value={nutriments.sodiumServing ?? nutriments.sodium100g}
        unit={nutriments.sodiumUnit}
      />

      {/* Carbs */}
      <Row
        label="Total Carbohydrate"
        value={nutriments.carbohydratesServing ?? nutriments.carbohydrates100g}
        unit={nutriments.carbohydratesUnit}
        bold
      />
      <RowSub
        label="Dietary Fiber"
        value={nutriments.fiberServing ?? nutriments.fiber100g}
        unit={nutriments.fiberUnit}
      />
      <RowSub
        label="Total Sugars"
        value={nutriments.sugarsServing ?? nutriments.sugars100g}
        unit={nutriments.sugarsUnit}
      />
      {/* If you have added sugars as a separate field, map it here */}

      {/* Protein */}
      <Row
        label="Protein"
        value={nutriments.proteinsServing ?? nutriments.proteins100g}
        unit={nutriments.proteinsUnit}
        bold
      />

      <div className="my-1 border-t-4 border-black" />

      {/* Vitamins & minerals */}
      <Row
        label="Vitamin A"
        value={nutriments.vitaminAServing ?? nutriments.vitaminA100g}
        unit={nutriments.vitaminAUnit}
      />
      <Row
        label="Vitamin C"
        value={nutriments.vitaminCServing ?? nutriments.vitaminC100g}
        unit={nutriments.vitaminCUnit}
      />
      <Row
        label="Calcium"
        value={nutriments.calciumServing ?? nutriments.calcium100g}
        unit={nutriments.calciumUnit}
      />
      <Row
        label="Iron"
        value={nutriments.ironServing ?? nutriments.iron100g}
        unit={nutriments.ironUnit}
      />
      <Row label="Potassium" value={nutriments.potassium100g} unit="g" />

      <div className="my-1 border-t-2 border-black" />

      <p className="text-[10px] text-black">
        *Percent Daily Values are based on a 2,000 calorie diet.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  unit,
  bold = false,
}: {
  label: string;
  value?: number | null;
  unit?: string | null;
  bold?: boolean;
}) {
  if (value == null) return null;
  return (
    <div className="flex flex-row justify-between">
      <span className={`text-xs text-black ${bold ? "font-bold" : ""}`}>
        {label}
      </span>
      <span className={`text-xs text-black ${bold ? "font-bold" : ""}`}>
        {formatNutrient(value)}
        {unit}
      </span>
    </div>
  );
}

function RowSub({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number | null;
  unit?: string | null;
}) {
  if (value == null) return null;
  return (
    <div className="flex flex-row justify-between pl-4">
      <span className="text-xs text-black">{label}</span>
      <span className="text-xs text-black">
        {formatNutrient(value)}
        {unit}
      </span>
    </div>
  );
}
