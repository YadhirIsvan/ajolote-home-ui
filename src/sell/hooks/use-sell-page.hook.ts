import { useState } from "react";

export const useSellPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const openVideo = () => setIsVideoOpen(true);

  return {
    isFormOpen,
    setIsFormOpen,
    isVideoOpen,
    setIsVideoOpen,
    openForm,
    openVideo,
  };
};
