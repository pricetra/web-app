// Flyer format constants and types
export type FlyerFormat = 'standard' | 'half-sheet' | 'tabloid';

export interface FlyerFormatSpec {
  name: string;
  widthInches: number;
  heightInches: number;
  widthPx: number;
  heightPx: number;
  dpi: number; // dots per inch for conversion
}

// DPI = 96 (standard screen DPI)
const DPI = 96;

export const FLYER_FORMATS: Record<FlyerFormat, FlyerFormatSpec> = {
  'standard': {
    name: '8.5 x 11" Standard',
    widthInches: 8.5,
    heightInches: 11,
    widthPx: Math.round(8.5 * DPI),
    heightPx: Math.round(11 * DPI),
    dpi: DPI,
  },
  'half-sheet': {
    name: '5.5 x 8.5" Half Sheet',
    widthInches: 5.5,
    heightInches: 8.5,
    widthPx: Math.round(5.5 * DPI),
    heightPx: Math.round(8.5 * DPI),
    dpi: DPI,
  },
  'tabloid': {
    name: '11 x 17" Tabloid',
    widthInches: 11,
    heightInches: 17,
    widthPx: Math.round(11 * DPI),
    heightPx: Math.round(17 * DPI),
    dpi: DPI,
  },
};

export const FLYER_FORMAT_OPTIONS = Object.entries(FLYER_FORMATS).map(([key, spec]) => ({
  value: key as FlyerFormat,
  label: spec.name,
}));

export const flyerFormats = ["A4", "Letter", "Legal"];
export const flyerFormatToFlyerSpec: Record<string, FlyerFormatSpec> = {
  'A4': FLYER_FORMATS.standard,
  'Letter': FLYER_FORMATS.standard,
  'Legal': FLYER_FORMATS.tabloid,
}
