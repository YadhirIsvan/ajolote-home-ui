import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const useScrollDirection = () => {
  const [visible, setVisible] = useState(true);
  const { pathname } = useLocation();
  const lastY = useRef(0);

  useEffect(() => {
    setVisible(true);
  }, [pathname]);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= 0) {
        setVisible(true);
      } else if (currentY < lastY.current) {
        setVisible(true);
      } else if (currentY > lastY.current) {
        setVisible(false);
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
};
