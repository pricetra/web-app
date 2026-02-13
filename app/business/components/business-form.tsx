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
import { useMutation } from "@apollo/client/react";
import { Formik } from "formik";
import { BusinessFormInput, BusinessSingUpFormDocument } from "graphql-utils";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";

export default function BusinessForm() {
  const router = useRouter();
  const [businessSignUpForm, { loading, error }] = useMutation(
    BusinessSingUpFormDocument,
  );

  return (
    <div>
      <Formik initialValues={{} as BusinessFormInput} onSubmit={(input) => {
        businessSignUpForm({
          variables: {
            input,
          }
        })
      }}>
        {(formik) => (
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="title" className="font-bold text-xl">
                  Sign up for Pricetra Business
                </FieldLegend>
                <FieldDescription>
                  Leverage our online store platform and grow your store today.
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
                </FieldGroup>

                <FieldGroup className="flex flex-row">
                  <Field className="flex-1">
                    <FieldLabel htmlFor="storeLogo" className="items-end">
                      Logo <small className="text-gray-500">(1:1)</small>
                    </FieldLabel>
                    <Input
                      id="storeLogo"
                      placeholder="https://walmart.com"
                      value={formik.values.storeLogo}
                      onChange={(v) =>
                        formik.setFieldValue("storeLogo", v.target.value)
                      }
                      required
                      type="file"
                    />
                  </Field>

                  <Field className="flex-2">
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
                        formik.setFieldValue("additionalInformation", v.target.value)
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
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </Formik>

      <div style={{ height: "10vh" }} />
    </div>
  );
}
