import React, { useState, useEffect } from "react";
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./CalculatorForm.css";

const ProcurementForm: React.FC = () => {
  const { calculator, notifyChange } = useCalculator();

  // Options
  const [procurementOptions, setProcurementOptions] = useState<{ code: string; description: string }[]>([]);
  const [expenditure, setExpenditure] = useState<number>(0);
  const [selectedProcurementCode, setSelectedProcurementCode] = useState<string>("");
  const [selectedDescription, setSelectedProcurementDescription] = useState<string>("");

  // Fetch options from calculator when it loads
  useEffect(() => {
    if (calculator) {
      setProcurementOptions(calculator.getProcurementOptions());
    }
  }, [calculator]);
  
  // Default selection when calculator has loaded.
  useEffect(() => {
    if (procurementOptions.length > 0) {
      setSelectedProcurementCode(procurementOptions[0].code);
      setSelectedProcurementDescription(procurementOptions[0].description);
    }
  }, [procurementOptions])

  const addProcurement = () => {
    if (calculator) {
      let newProcurement: calculatorInterface.procurement = { code: selectedProcurementCode, description: selectedDescription, expenditure };
      calculator.addProcurement(newProcurement);
      notifyChange();
    }
  };

  return (
      <div className="section">
        <label>Expenditure (£): </label>
        <input type="number" value={expenditure} onChange={(e) => setExpenditure(parseFloat(e.target.value) || 0)} />
        <select value={selectedProcurementCode} onChange={(e) => {
          const selected = procurementOptions.find(opt => opt.code === e.target.value);
          setSelectedProcurementCode(selected?.code || "");
          setSelectedProcurementDescription(selected?.description || "");
        }}>
          {procurementOptions.map((option) => (
            <option key={option.code} value={option.code}>{option.description}</option>
          ))}
        </select>
        <button onClick={addProcurement}>Add Procurement</button>
      </div>
  );
};

export default ProcurementForm;
