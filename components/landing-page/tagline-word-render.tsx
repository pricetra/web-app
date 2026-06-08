import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  words: string[];
  intervalMs?: number;
};

export default function TaglineWordRender({ words, intervalMs = 2500 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words, intervalMs]);

  if (!words || words.length === 0) return null;

  return (
    <span
      className="relative inline-block overflow-hidden align-bottom"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="block text-pricetra-green-dark font-extrabold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.10 }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
