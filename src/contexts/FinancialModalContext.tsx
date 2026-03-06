import React, { createContext, useState, useContext, ReactNode } from "react";

interface FinancialModalContextType {
  isOpen: boolean;
  openFinancialModal: () => void;
  closeFinancialModal: () => void;
}

const FinancialModalContext = createContext<FinancialModalContextType | undefined>(undefined);

export const FinancialModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openFinancialModal = () => setIsOpen(true);
  const closeFinancialModal = () => setIsOpen(false);

  return (
    <FinancialModalContext.Provider
      value={{
        isOpen,
        openFinancialModal,
        closeFinancialModal,
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
