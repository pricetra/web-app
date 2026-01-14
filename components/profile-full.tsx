import dayjs from "dayjs";
import { User } from "graphql-utils";
import { GoLocation } from "react-icons/go";
import { MdCake } from "react-icons/md";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";

export type ProfileFullProps = {
  user: User;
};

export default function ProfileFull({ user }: ProfileFullProps) {
  return (
    <div className="border border-gray-100 bg-gray-50 rounded-lg p-5 flex flex-col gap-5 w-full">
      <div className="flex flex-row gap-3 items-center justify-start">
        <Image
          src={createCloudinaryUrl(
            user.avatar ?? "f89a1553-b74e-426c-a82a-359787168a53",
            200,
            200
          )}
          alt="Avatar"
          className="rounded-full size-10 lg:size-14"
          width={56}
          height={56}
          quality={100}
        />

        <div className="flex-2 flex flex-col gap-2 w-full">
          <h4 className="leading-none font-bold text-base lg:text-lg">
            {user.name}
          </h4>
          <p className="leading-none text-xs lg:text-sm break-all">
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2 items-center">
          <GoLocation className="size-4 lg:size-5" />
          <span className="text-xs lg:text-sm">
            {user.address?.fullAddress}
          </span>
        </div>

        {user.birthDate && (
          <div className="flex flex-row gap-2 items-center">
            <MdCake className="size-4 lg:size-5" />
            <span className="text-xs lg:text-sm">
              {dayjs.utc(user.birthDate).format("LL")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
