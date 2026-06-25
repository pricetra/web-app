import { Address, User } from "graphql-utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/user-context";
import { WelcomePageType } from "./setup-screens/types";
import StartSection from "./setup-screens/start-section";
import AddressSection from "./setup-screens/address-section";
import SelectStoreSection from "./setup-screens/select-stores-section";

export type WelcomeScreenProps = {
  user: User;
};

export default function WelcomeScreen({ user }: WelcomeScreenProps) {
  const { lists, setShowWelcomeScreen } = useAuth();
  const [page, setPage] = useState<WelcomePageType>(WelcomePageType.WELCOME);
  const [newAddress, setNewAddress] = useState<Address>();

  useEffect(() => {
    if (user.address && (lists?.favorites.branchList ?? []).length > 0) {
      setShowWelcomeScreen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.address, lists?.favorites?.branchList]);

  return (
    <div className="flex p-5 flex-col justify-center gap-5 w-full mx-auto min-h-screen">
      {page === WelcomePageType.WELCOME && (
        <StartSection next={() => setPage(WelcomePageType.ADDRESS)} />
      )}

      {page === WelcomePageType.ADDRESS && (
        <AddressSection
          user={user}
          next={(address) => {
            setNewAddress(address);
            setPage(WelcomePageType.BRANCHES);
          }}
        />
      )}

      {page === WelcomePageType.BRANCHES && newAddress && (
        <SelectStoreSection
          newAddress={newAddress}
          back={() => setPage(WelcomePageType.ADDRESS)}
          lists={lists}
        />
      )}
    </div>
  );
}
