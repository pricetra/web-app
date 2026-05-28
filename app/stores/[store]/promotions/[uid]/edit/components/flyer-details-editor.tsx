import { useFlyerEditor } from "@/context/flyer-editor-context";
import {
  StorefrontFlyer,
  StorefrontFlyerFormat,
  UpdateStorefrontFlyerDocument,
} from "graphql-utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { flyerFormats } from "@/lib/constants/flyer-formats";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";

export default function FlyerDetailsEditor() {
  const { flyer, flyerStyles, setFlyer } = useFlyerEditor();
  const [updateStorefrontFlyer, { data: storefrontFlyerUpdatedData, loading }] =
    useMutation(UpdateStorefrontFlyerDocument);
  const [title, setTitle] = useState(flyer.title);
  const [description, setDescription] = useState(flyer.description ?? "");
  const [format, setFormat] = useState(
    flyerStyles["format"] as StorefrontFlyerFormat,
  );
  const parsedFlyerFormat = flyerStyles["format"] as StorefrontFlyerFormat;
  const isChanged =
    title !== flyer.title ||
    description !== flyer.description ||
    format !== parsedFlyerFormat;

  useEffect(() => {
    if (!storefrontFlyerUpdatedData?.updateStorefrontFlyer) return;

    setFlyer(
      storefrontFlyerUpdatedData.updateStorefrontFlyer as StorefrontFlyer,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storefrontFlyerUpdatedData]);

  return (
    <div className="flex flex-col gap-2 px-2 text-sm text-gray-700">
      <div className="flex flex-row gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-transparent hover:border-input font-bold focus:bg-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-transparent hover:border-input focus:bg-white shadow-none"
        />
      </div>

      <FieldGroup className="flex-1">
        <Field>
          <FieldLabel htmlFor="format" className="px-3">
            Format
          </FieldLabel>

          <NativeSelect
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value as StorefrontFlyerFormat)}
            className="w-full border-transparent hover:border-input focus:bg-white shadow-none"
          >
            {flyerFormats.map((format) => (
              <NativeSelectOption key={format} value={format}>
                {format}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </FieldGroup>

      <div className="mt-3 flex flex-row justify-end">
        <Button
          size="xs"
          variant="pricetra"
          disabled={!isChanged || loading}
          onClick={() => {
            const newFlyerStyles = { ...flyerStyles };
            newFlyerStyles["format"] = format;
            updateStorefrontFlyer({
              variables: {
                input: {
                  storefrontFlyerId: flyer.id,
                  title,
                  description,
                  flyerStyles: JSON.stringify(newFlyerStyles),
                },
              },
            });
          }}
        >
          {loading ? "Updating" : "Update Flyer"}
        </Button>
      </div>
    </div>
  );
}
