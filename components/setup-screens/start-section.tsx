import Image from "next/image";
import { Button } from "../ui/button";
import { GoLocation } from "react-icons/go";

type StartSectionProps = {
  next: () => void;
}

export default function StartSection({ next }: StartSectionProps) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="w-full flex flex-row justify-start items-center mb-5">
        <Image
          src="/logo_black_color_dark_leaf.svg"
          className="w-[60px]"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
      </div>

      <h1 className="text-4xl font-extrabold text-pricetra-green-dark">
        Welcome to Pricetra.
      </h1>

      <h1 className="text-4xl font-extrabold text-pricetra-green-heavy-dark mb-5">
        {`Let's Setup Your Account...`}
      </h1>

      <p className="mb-10 text-lg text-gray-800">
        {`In order to help you shop efficiently, we will need just a little
            more information from you. This won't take long.`}
      </p>

      <Button onClick={next} size="lg" variant="pricetra" className="font-bold">
        <GoLocation />
        Add Your Address
      </Button>
    </div>
  );
}
