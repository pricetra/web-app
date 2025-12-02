import convert from "convert-units";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  defaultMeasurementUnit,
  measurementUnits,
  measurementUnitsToConvertUnits,
} from "@/constants/measurements";
import { Label } from "@radix-ui/react-label";
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export type WeightType = {
  weightValue?: string;
  weightType?: string;
};

export type WeightSelectorProps = {
  value?: string;
  onChangeText: (value: WeightType) => void;
};

function getMeasurement(value?: string): WeightType {
  if (!value) return {};
  const parsedValue = value.split(" ");
  if (parsedValue.length < 2) return {};

  const measurement = parsedValue.at(0) ?? "";
  const unit = parsedValue.slice(1).join(" ").toLowerCase();

  return { weightType: unit, weightValue: measurement };
}

export default function WeightSelector({
  value,
  onChangeText,
}: WeightSelectorProps) {
  const [measurement, setMeasurement] = useState<string>("");
  const [unit, setUnit] = useState<string>(defaultMeasurementUnit);

  const parsedValue = useMemo(() => getMeasurement(value), [value]);

  const lastEmittedValue = useRef<WeightType>({});

  useEffect(() => {
    // shallow-equality check by fields (avoid object identity compare)
    const sameAsLast =
      lastEmittedValue.current.weightValue === parsedValue.weightValue &&
      lastEmittedValue.current.weightType === parsedValue.weightType;

    if (sameAsLast) return;

    setMeasurement(parsedValue.weightValue ?? "");
    setUnit(parsedValue.weightType ?? defaultMeasurementUnit);
  }, [parsedValue]);

  // emit changes upstream when local inputs change
  useEffect(() => {
    if (
      measurement === undefined ||
      measurement === null ||
      measurement === "" ||
      !unit
    ) {
      return;
    }

    const newValue: WeightType = {
      weightValue: measurement,
      weightType: unit,
    };

    // avoid re-emitting identical shape repeatedly
    const sameAsLast =
      lastEmittedValue.current.weightValue === newValue.weightValue &&
      lastEmittedValue.current.weightType === newValue.weightType;

    if (sameAsLast) return;

    lastEmittedValue.current = newValue;
    onChangeText(newValue);
  }, [measurement, unit, onChangeText]);

  return (
    <div className="flex flex-1 flex-row items-center justify-center gap-2">
      <div className="flex-1">
        <Label className="mb-2 block">Weight</Label>
        <Input
          onChange={(e) => setMeasurement(e.target.value)}
          value={measurement ?? ""}
          className="flex-1"
          placeholder="Weight"
          type="number"
        />
      </div>

      <div className="relative">
        <Label className="mb-2 block">Unit</Label>
        <div>
          <NativeSelect
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="min-w-[85px]"
          >
            {measurementUnits.map((unit) => (
              <NativeSelectOption value={unit} key={`weight-unit-${unit}`}>
                {unit}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="relative">
        <Label className="mb-2 block">Convert</Label>
        <div>
          <NativeSelect
            value={unit}
            onChange={(e) => {
              const convUnit = e.target.value;
              let convertedValue = measurement;
              try {
                convertedValue = Math.round(
                  convert(parseFloat(measurement))
                    .from(measurementUnitsToConvertUnits.get(unit)!)
                    .to(measurementUnitsToConvertUnits.get(convUnit)!)
                ).toString();
              } catch (err) {
                window.alert(err);
                return;
              }
              setMeasurement(convertedValue);
              setUnit(convUnit);
            }}
            className="min-w-[85px]"
          >
            {measurementUnits.map((unit) => (
              <NativeSelectOption value={unit} key={`weight-unit-${unit}`}>
                {unit}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
    </div>
  );
}
