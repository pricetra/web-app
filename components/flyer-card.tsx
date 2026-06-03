import { createCloudinaryUrl } from "@/lib/files";
import dayjs from "dayjs";
import { StorefrontFlyer, StorefrontFlyerStatus } from "graphql-utils";
import Image from "next/image";

export type FlyerCardProps = {
  flyer: StorefrontFlyer;
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-200 text-gray-800";
    case "SCHEDULED":
      return "bg-yellow-200 text-yellow-800";
    case "PUBLISHED":
      return "bg-green-200 text-green-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function FlyerCard({ flyer }: FlyerCardProps) {
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg border border-gray-200 hover:shadow-xl transition">
      {/* Flyer Image */}
      {flyer.flyerImageId && (
        <Image
          src={createCloudinaryUrl(flyer.flyerImageId)}
          alt={flyer.title}
          width={600}
          height={600}
          className="w-full rounded-t-lg"
        />
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{flyer.title}</h3>

        {flyer.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {flyer.description}
          </p>
        )}

        {/* Status and Dates */}
        <div className="space-y-2 mb-4">
          {flyer.status !== StorefrontFlyerStatus.Published && (
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(
                  flyer.status,
                )}`}
              >
                {flyer.status}
              </span>
            </div>
          )}
          <p className="italic text-xs">
            <span className="bg-yellow-300/50">
              {dayjs(flyer.startsAt).format("MMM D")} -{" "}
              {dayjs(flyer.expiresAt).format("MMM D")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
