import { RefObject, useEffect, useState } from "react";

export default function useAdSense(adRef: RefObject<HTMLDivElement | null>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!adRef.current) return;

    const el = adRef.current;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense error", e);
    }

    const observer = new MutationObserver(() => {
      if (el.offsetHeight > 50) {
        observer.disconnect();
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
    });

    const timeout = setTimeout(() => {
      if (el.offsetHeight < 50) {
        setVisible(false);
        observer.disconnect();
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [adRef]);

  return visible;
}
