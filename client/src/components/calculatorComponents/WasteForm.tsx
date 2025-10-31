import React, { useState, useEffect } from "react";
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./CalculatorForm.css";

const WasteForm: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();

    // Options
    const [wasteOptions, setWasteOptions] = useState<string[]>([]);
    const [usage, setUsage] = useState<number>(0);
    const [selectedWaste, setSelectedWaste] = useState<string>("");

    // Fetch options from calculator when it loads
    useEffect(() => {
        if (calculator) {
            setWasteOptions(calculator.getWasteOptions());
        }
    }, [calculator]);
  
  // Default selection when calculator has loaded.
  useEffect(() => {
    if (wasteOptions.length > 0) {
      setSelectedWaste(wasteOptions[0]);
    }
  }, [wasteOptions])

  const addWaste = () => {
    if (calculator) {
      let newWaste: calculatorInterface.usage = { label: selectedWaste, usage: usage };
      calculator.addWaste(newWaste);
      console.log(calculator.getWasteEmissions());
      notifyChange();
    }
  };

  return (
      <div className="section">
        <label>Waste (tonne): </label>
        <input type="number" value={usage} onChange={(e) => setUsage(parseFloat(e.target.value) || 0)} />
        <select 
            value={selectedWaste} 
            onChange={(e) => setSelectedWaste(e.target.value)}
        >
        {wasteOptions.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
        </select>
        <button onClick={addWaste}>Add Waste</button>
      </div>
  );
};

export default WasteForm;
