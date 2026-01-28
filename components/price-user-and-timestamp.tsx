import dayjs from "dayjs";

import { CreatedByUser, UpdatedByUser } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";

import Image from 'next/image'
import { MdVerifiedUser } from "react-icons/md";

export type PriceUserAndTimestampProps = {
  user: CreatedByUser | UpdatedByUser;
  verified?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp?: any;
};

export default function PriceUserAndTimestamp({
  user,
  verified,
  timestamp,
}: PriceUserAndTimestampProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image
        src={
          user.avatar
            ? createCloudinaryUrl(user.avatar, 100, 100)
            : "/no_avatar.jpg"
        }
        alt="Avatar"
        className="size-[30px] rounded-full"
        width={100}
        height={100}
      />

      <div>
        <div className="flex flex-row items-center gap-1">
          <h6 className="text-xs font-bold">{user.name}</h6>
          {verified && <MdVerifiedUser className="text-pricetra-green-dark" />}
        </div>
        {timestamp && (
          <span className="mt-1 text-[10px] italic leading-none block">
            {dayjs(timestamp).fromNow()}
          </span>
        )}
      </div>
    </div>
  );
}
