/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocationInputWithFullAddress } from "@/context/location-context";
import convert from "convert-units";

export interface GoogleMapsAutocompleteResponse {
  suggestions: GoogleMapsAutocompleteSuggestion[];
}

export interface GoogleMapsAutocompleteSuggestion {
  placePrediction: GoogleMapsAutocompletePlacePrediction;
}

export interface GoogleMapsAutocompletePlacePrediction {
  place: string;
  placeId: string;
  text: GoogleMapsAutocompletePlacePredictionText;
  structuredFormat: GoogleMapsAutocompletePlacePredictionStructuredFormat;
  types: string[];
}

export interface GoogleMapsAutocompletePlacePredictionText {
  text: string;
  matches: Match[];
}

export interface Match {
  endOffset: number;
  startOffset?: number;
}

export interface GoogleMapsAutocompletePlacePredictionStructuredFormat {
  mainText: GoogleMapsAutocompletePlacePredictionStructuredFormatMainText;
  secondaryText: {
    text: string;
  };
}

export interface GoogleMapsAutocompletePlacePredictionStructuredFormatMainText {
  text: string;
  matches: {
    endOffset: number;
    startOffset?: number;
  }[];
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getGoogleMapsPredictions(
  input: string,
  locationBias?: LocationInputWithFullAddress,
  radiusBiasMiles?: number,
): Promise<GoogleMapsAutocompleteSuggestion[]> {
  if (!API_KEY) return [];
  if (input.length <= 3) return [];

  try {
    const body: any = { input };

    if (
      locationBias?.locationInput?.latitude &&
      locationBias?.locationInput?.longitude
    ) {
      body.locationBias = {
        circle: {
          center: {
            latitude: locationBias.locationInput.latitude,
            longitude: locationBias.locationInput.longitude,
          },
          radius: convert(radiusBiasMiles ?? 20).from("mi").to("m"),
        },
      };
    }

    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json() as GoogleMapsAutocompleteResponse;
    return data.suggestions ?? [];
  } catch {
    return [];
  }
}
