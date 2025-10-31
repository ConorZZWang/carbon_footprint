import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loadAndConstructCalculator } from "../api/CalculatorService";
import { Calculator } from "../Calculator/Calculator";

interface CalculatorContextType {
  calculator: Calculator | null;
  notifyChange: () => void; // Method to notify and trigger re-render
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calculator, setCalculator] = useState<Calculator | null>(null);
  const [, setForceUpdate] = useState(0); // Used to trigger re-renders

  useEffect(() => {
    const initializeCalculator = async () => {
      const instance = await loadAndConstructCalculator();
      setCalculator(instance);
    };
    initializeCalculator();
  }, []);

  // notifyChange method triggers re-render by changing state
  const notifyChange = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  return (
    <CalculatorContext.Provider value={{ calculator, notifyChange }}>
      {children}
    </CalculatorContext.Provider>
  );
};

// Custom hook for accessing the calculator and notifyChange function
export const useCalculator = (): { calculator: Calculator | null; notifyChange: () => void } => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
};
