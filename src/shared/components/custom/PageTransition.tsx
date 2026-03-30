import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

/** Fade-in on route change */
const PageTransition = ({ children }: PageTransitionProps) => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only fade in — never reset to invisible after first mount.
    // Resetting to 0 on every route change caused a visible flash when the
    // video background on "/" restarted from frame 0 during the opacity transition.
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      className="transition-opacity duration-300 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
