"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/user-context";
import { useMutation } from "@apollo/client/react";
import { Formik } from "formik";
import {
  GetAllUsersDocument,
  MeDocument,
  UpdateProfileDocument,
  UpdateUser,
} from "graphql-utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { FiCamera } from "react-icons/fi";
import {
  allowedImageTypes,
  allowedImageTypesString,
} from "@/constants/uploads";
import dayjs from "dayjs";
import { diffObjects } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CgSpinner } from "react-icons/cg";

export default function EditProfileClient() {
  const { loggedIn, user } = useAuth();
  const [updateProfile, { loading, error }] = useMutation(UpdateProfileDocument, {
    refetchQueries: [GetAllUsersDocument, MeDocument],
  });
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>();

  useEffect(() => {
    if (!user?.avatar) return;
    setSelectedImage(createCloudinaryUrl(user.avatar));
  }, [user]);

  if (!loggedIn || !user) return <></>;

  return (
    <div id="edit">
      <h2 className="text-xl font-bold mb-7">Edit Profile</h2>

      <Formik
        initialValues={
          {
            name: user.name,
            address: user.address?.fullAddress,
            birthDate: user.birthDate,
          } as UpdateUser
        }
        onSubmit={(values: UpdateUser) => {
          const filteredInput = diffObjects<UpdateUser>(
            values,
            {
              name: user.name,
              address: user.address?.fullAddress,
              birthDate: user.birthDate ? dayjs.utc(user.birthDate).toDate() : undefined,
            }
          );
          if (Object.keys(filteredInput).length === 0) return;

          updateProfile({
            variables: {
              input: filteredInput,
            },
          }).then(({ data }) => {
            if (!data) return;

            toast.success("Profile updated");
          });
        }}
      >
        {(formik) => (
          <div className="flex flex-col gap-5">
            <div>
              {selectedImage ? (
                <Image
                  src={selectedImage ?? ""}
                  className="size-28 rounded-full object-cover cursor-pointer"
                  width={500}
                  height={500}
                  alt="Product image"
                  onClick={() => imageUploadRef.current?.click()}
                  onError={() => setSelectedImage(undefined)}
                />
              ) : (
                <div
                  className="flex size-28 items-center justify-center rounded-full bg-gray-400 cursor-pointer"
                  onClick={() => imageUploadRef.current?.click()}
                >
                  <FiCamera className="size-[35px] text-white" />
                </div>
              )}

              <div className="hidden">
                <input
                  ref={imageUploadRef}
                  type="file"
                  accept={allowedImageTypesString}
                  onChange={(e) => {
                    const files = e.target.files;
                    const file = files?.item(0);
                    if (!file) return;
                    if (!allowedImageTypes.includes(file.type)) {
                      window.alert("invalid file type");
                      return;
                    }

                    formik.setFieldValue("avatarFile", file);
                    setSelectedImage(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>

            <InputGroup>
              <InputGroupInput
                placeholder="Full name (ex. John Smith)"
                value={formik.values.name ?? ""}
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
                id="name"
              />
              <InputGroupAddon align="block-start">
                <Label className="text-xs" htmlFor="name">
                  Full Name
                </Label>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                placeholder="Zip code, State, or Full address"
                value={formik.values.address ?? ""}
                onChange={(e) =>
                  formik.setFieldValue("address", e.target.value)
                }
                id="address"
              />
              <InputGroupAddon align="block-start">
                <Label className="text-xs" htmlFor="address">
                  Address
                </Label>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                placeholder="Zip code, State, or Full address"
                value={
                  dayjs.utc(formik.values.birthDate).format("YYYY-MM-DD") ?? ""
                }
                onChange={(e) =>
                  formik.setFieldValue("birthDate", dayjs.utc(e.target.value).toDate())
                }
                type="date"
              />
              <InputGroupAddon align="block-start">
                <Label className="text-xs" htmlFor="address">
                  Birth Date
                </Label>
              </InputGroupAddon>
            </InputGroup>

            {error && (<div className="text-red-700">
              <p>{error.message}</p>
            </div>)}

            <div className="flex flex-row-reverse gap-3 items-center">
              <Button variant="pricetra" disabled={loading} onClick={formik.submitForm}>
                {loading && <CgSpinner className="animate-spin" />} Save
              </Button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
