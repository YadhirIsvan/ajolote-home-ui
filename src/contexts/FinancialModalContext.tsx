import React, { createContext, useState, useContext, ReactNode } from "react";

interface FinancialModalContextType {
  isOpen: boolean;
  showAuthFirst: boolean;
  openFinancialModal: () => void;
  closeFinancialModal: () => void;
  closeAuthModal: () => void;
  onAuthSuccess: () => void;
}

const FinancialModalContext = createContext<FinancialModalContextType | undefined>(undefined);

export const FinancialModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthFirst, setShowAuthFirst] = useState(false);

  const openFinancialModal = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setShowAuthFirst(true);
    } else {
      setIsOpen(true);
    }
  };

  const closeFinancialModal = () => setIsOpen(false);

  const closeAuthModal = () => setShowAuthFirst(false);

  const onAuthSuccess = () => {
    setShowAuthFirst(false);
    setIsOpen(true);
  };

  return (
    <FinancialModalContext.Provider
      value={{
        isOpen,
        showAuthFirst,
        openFinancialModal,
        closeFinancialModal,
        closeAuthModal,
        onAuthSuccess,
      }}
    >
      {children}
    </FinancialModalContext.Provider>
  );
};

export const useFinancialModal = () => {
  const context = useContext(FinancialModalContext);
  if (context === undefined) {
    throw new Error("useFinancialModal must be used within FinancialModalProvider");
  }
  return context;
};
