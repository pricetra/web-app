export const measurementUnits = [
  'fl oz',
  'oz',
  'lb',
  'gal',
  'qt',
  'pt',
  'cup',
  'g',
  'l',
  'ml',
  'kg',
];

export const measurementUnitsToConvertUnits = new Map<string, convert.Unit>([
  ['fl oz', 'fl-oz'],
  ['oz', 'oz'],
  ['lb', 'lb'],
  ['gal', 'gal'],
  ['qt', 'qt'],
  ['pt', 'pnt'],
  ['cup', 'cup'],
  ['g', 'g'],
  ['l', 'l'],
  ['ml', 'ml'],
  ['kg', 'kg'],
]);

export const defaultMeasurementUnit = measurementUnits[1];
