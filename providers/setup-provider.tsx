import WelcomeScreen from "@/components/welcome-screen";
import { useAuth } from "@/context/user-context";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetupProvider({ children }: { children: ReactNode }) {
  const { loading, user, lists } = useAuth();
  const noFavoriteBranches = (lists?.favorites?.branchList ?? []).length === 0;
  const showWelcomeScreen = user && (!user?.address || noFavoriteBranches);

  if (!loading && showWelcomeScreen) {
    return (
      <AnimatePresence>
        <motion.div
          key="welcome-screen"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ stiffness: 70 }}
          className="h-screen w-full absolute top-0 left-0 z-50 bg-white overflow-scroll"
        >
          <WelcomeScreen user={user} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return <>{children}</>;
}
