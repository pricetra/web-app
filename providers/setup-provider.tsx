import WelcomeScreen from "@/components/welcome-screen";
import { useAuth } from "@/context/user-context";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useStoreUser from "@/hooks/useStoreUser";
import StorefrontSetupTasksBanner from "@/components/storefront-setup-tasks";

export default function SetupProvider({ children }: { children: ReactNode }) {
  const { loading, user, showWelcomeScreen } = useAuth();
  const storeUserBranches = useStoreUser();

  if (!loading && user && showWelcomeScreen) {
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

  return (
    <>
      {children}
      {storeUserBranches && storeUserBranches.length > 0 && (
        <div className="fixed left-0 bottom-0 z-10 w-full">
          <div className="relative xs:p-5 flex flex-col gap-3">
            {storeUserBranches.map((b, i) => (
              <div className="max-w-xl shadow-lg rounded-lg" key={`my-branch-task-${b.id}-${i}`}>
                <StorefrontSetupTasksBanner
                  storeId={b.storeId}
                  branchId={b.id}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
