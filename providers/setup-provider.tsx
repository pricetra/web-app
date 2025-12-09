import WelcomeScreen from "@/components/welcome-screen";
import { useAuth } from "@/context/user-context";
import { ReactNode } from "react";

export default function SetupProvider({ children }: { children: ReactNode }) {
  const { user, lists } = useAuth();
  const noFavoriteBranches = (lists?.favorites?.branchList ?? []).length === 0

  if (user && (!user?.address || noFavoriteBranches)) {
    return (
      <div className="h-screen w-full absolute top-0 left-0 z-50 bg-white overflow-scroll">
        <WelcomeScreen user={user} />
      </div>
    );
  }

  return <>{children}</>;
}
