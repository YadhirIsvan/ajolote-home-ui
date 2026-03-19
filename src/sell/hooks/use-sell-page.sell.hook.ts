import { useState } from "react";
import { useAuth } from "@/shared/hooks/use-auth.hook";

export const useSellPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showAuthHint, setShowAuthHint] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  const openForm = () => {
    if (!isAuthenticated) {
      setShowAuthHint(true);
      openAuthModal();
      return;
    }
    setIsFormOpen(true);
  };

  const openVideo = () => setIsVideoOpen(true);

  return {
    isFormOpen,
    setIsFormOpen,
    isVideoOpen,
    setIsVideoOpen,
    openForm,
    openVideo,
    showAuthHint,
  };
};
