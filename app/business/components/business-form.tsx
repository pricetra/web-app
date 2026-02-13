import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  Field,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { allowedImageTypes } from "@/constants/uploads";
import { useMutation } from "@apollo/client/react";
import { Formik } from "formik";
import { BusinessFormInput, BusinessSingUpFormDocument } from "graphql-utils";
import { useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { RiImageCircleFill } from "react-icons/ri";
import Image from "next/image";
import { convertFileToBase64 } from "@/lib/files";
import { toast } from "sonner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TbLocationCheck } from "react-icons/tb";
import Link from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";

export type BusinessFormProps = {
  onCancel: () => void;
};

export default function BusinessForm({ onCancel }: BusinessFormProps) {
  const logoUploadInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [businessSignUpForm, { data, loading, error }] = useMutation(
    BusinessSingUpFormDocument,
  );

  if (data) {
    return (
      <div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TbLocationCheck className="text-pricetra-green-heavy-dark" />
            </EmptyMedia>
            <EmptyTitle>Information Submitted</EmptyTitle>
            <EmptyDescription className="text-gray-700">
              Almost done. You will hear back from us regarding next steps
              within 1-3 business days
            </EmptyDescription>
            <Separator className="my-5" />
            <EmptyDescription className="text-gray-700">
              In the meantime, if you haven&apos;t already, please{" "}
              <Link href="/auth/signup" className="text-blue-500">
                click here
              </Link>{" "}
              to create an account.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <Formik
        initialValues={{} as BusinessFormInput}
        onSubmit={(input) => {
          businessSignUpForm({
            variables: {
              input,
            },
          }).then(({ data }) => {
            if (!data) return;
            toast("Your information was submitted successfully!");
          });
        }}
      >
        {(formik) => (
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="title" className="font-bold">
                  Sign up for Pricetra Business
                </FieldLegend>
                <FieldDescription>
                  Leverage our online store platform and grow your store today.
                </FieldDescription>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldLegend className="font-bold">
                  Contact Information
                </FieldLegend>
                <FieldDescription>
                  Fill in your contact information. This information is{" "}
                  <i>not</i> shared
                </FieldDescription>

                <FieldGroup className="flex flex-row">
                  <Field>
                    <FieldLabel htmlFor="firstName">First name</FieldLabel>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formik.values.firstName}
                      onChange={(v) =>
                        formik.setFieldValue("firstName", v.target.value)
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formik.values.lastName}
                      onChange={(v) =>
                        formik.setFieldValue("lastName", v.target.value)
                      }
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup className="flex sm:flex-row">
                  <Field className="flex-2">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      placeholder="email@your-business.com"
                      value={formik.values.email}
                      onChange={(v) =>
                        formik.setFieldValue("email", v.target.value)
                      }
                      required
                      type="email"
                    />
                  </Field>

                  <Field className="flex-1">
                    <FieldLabel htmlFor="phoneNumber" className="items-end">
                      Phone number{" "}
                      <small className="text-gray-500">(optional)</small>
                    </FieldLabel>
                    <Input
                      id="phoneNumber"
                      placeholder="Phone number"
                      value={formik.values.phoneNumber ?? ""}
                      onChange={(v) =>
                        formik.setFieldValue("phoneNumber", v.target.value)
                      }
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldLegend className="font-bold">
                  Store Information
                </FieldLegend>
                <FieldDescription>
                  Fill out information regarding the store that will be added to
                  Pricetra
                </FieldDescription>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="storeName">Store Name</FieldLabel>
                    <Input
                      id="storeName"
                      placeholder="Walmart"
                      value={formik.values.storeName}
                      onChange={(v) =>
                        formik.setFieldValue("storeName", v.target.value)
                      }
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="storeAddress">Address</FieldLabel>
                    <Input
                      id="storeAddress"
                      placeholder="150 Smith Rd, St. Charles, IL 60174"
                      value={formik.values.storeAddress}
                      onChange={(v) =>
                        formik.setFieldValue("storeAddress", v.target.value)
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="storeLogo" className="items-end">
                      Logo <small className="text-gray-500">(1:1)</small>
                    </FieldLabel>

                    <div>
                      {selectedImage ? (
                        <Image
                          src={selectedImage ?? ""}
                          className="size-20 rounded-xl object-cover cursor-pointer"
                          width={500}
                          height={500}
                          alt="Product image"
                          onClick={() => logoUploadInputRef.current?.click()}
                          onError={() => setSelectedImage(undefined)}
                        />
                      ) : (
                        <div
                          className="flex size-20 items-center justify-center rounded-xl bg-blue-100/50 hover:bg-blue-100 cursor-pointer border border-blue-200/50"
                          onClick={() => logoUploadInputRef.current?.click()}
                        >
                          <RiImageCircleFill className="size-14 text-blue-500 hover:text-blue-600" />
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      name="storeLogo"
                      ref={logoUploadInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        const file = files?.item(0);
                        if (!file) return;
                        if (!allowedImageTypes.includes(file.type)) {
                          window.alert("invalid file type");
                          return;
                        }

                        setSelectedImage(URL.createObjectURL(file));
                        convertFileToBase64(file).then((base64File) => {
                          if (!base64File) return;
                          formik.setFieldValue(
                            "storeLogo",
                            base64File.toString(),
                          );
                        });
                      }}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="storeUrl">Website URL</FieldLabel>
                    <Input
                      id="storeUrl"
                      placeholder="https://walmart.com"
                      value={formik.values.storeUrl}
                      onChange={(v) =>
                        formik.setFieldValue("storeUrl", v.target.value)
                      }
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="additionalInformation">
                      Additional Information
                    </FieldLabel>
                    <Textarea
                      id="additionalInformation"
                      placeholder="Any additional information or comments"
                      value={formik.values.additionalInformation ?? ""}
                      onChange={(v) =>
                        formik.setFieldValue(
                          "additionalInformation",
                          v.target.value,
                        )
                      }
                      className="resize-y"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                {error && (
                  <p className="text-red-700">
                    {error.name}: {error.message}
                  </p>
                )}

                {formik.errors && (
                  <ul>
                    {Object.entries(formik.errors).map(([key, val], i) => (
                      <li className="text-red-700" key={`error-${key}-${i}`}>
                        {key}: {val}
                      </li>
                    ))}
                  </ul>
                )}
              </FieldSet>

              <Field orientation="horizontal" className="gap-5">
                <Button
                  onClick={() => formik.handleSubmit()}
                  variant="pricetra"
                  size="lg"
                  className="font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CgSpinner className="animate-spin" /> Submitting
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  size="lg"
                  disabled={loading}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </Formik>
    </div>
  );
}
