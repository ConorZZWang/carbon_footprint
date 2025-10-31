import React, { useState, useEffect } from "react";
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./CalculatorForm.css";

const CalculatorForm: React.FC = () => {
  const { calculator, notifyChange } = useCalculator();

  // Staff Inputs
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [assignedStaff, setAssignedStaff] = useState<number>(0);

  // Options
  const [spaceOptions, setSpaceOptions] = useState<string[]>([]);
  const [wasteOptions, setWasteOptions] = useState<string[]>([]);
  const [transportOptions, setTransportOptions] = useState<string[]>([]);
  const [procurementOptions, setProcurementOptions] = useState<{ code: string; description: string }[]>([]);

  const [procurement, setProcurement] = useState<{ code: string; description: string; usage: number }[]>([]);
  
  const [expenditure, setExpenditure] = useState<number>(0);
  const [selectedWaste, setSelectedWaste] = useState<string>("");
  const [selectedTransport, setSelectedTransport] = useState<string>("");
  const [selectedProcurementCode, setSelectedProcurementCode] = useState<string>("");
  const [selectedProcurementDescription, setSelectedProcurementDescription] = useState<string>("");

  // Fetch options from calculator when it loads
  useEffect(() => {
    if (calculator) {
      setWasteOptions(calculator.getWasteOptions());
      setTransportOptions(calculator.getTransportOptions());
      setProcurementOptions(calculator.getProcurementOptions());
      setSpaceOptions(calculator.getSpaceOptions());

      // Set default selections
      if (wasteOptions.length > 0) setSelectedWaste(wasteOptions[0]);
      if (transportOptions.length > 0) setSelectedTransport(transportOptions[0]);
      if (procurementOptions.length > 0) {
        setSelectedProcurementCode(procurementOptions[0].code);
        setSelectedProcurementDescription(procurementOptions[0].description);
      }
    }
  }, [calculator]);

  const changeStaff = () => {
    if (calculator) {
      calculator.setStaff({ TOTAL_STAFF: totalStaff, ASSIGNED_STAFF: assignedStaff });
      notifyChange();
    }
  };

  const addProcurement = () => {
    if (calculator) {
      let newProcurement: calculatorInterface.procurement = { code: selectedProcurementCode, description: "stop complaining compiler. I don't use this form anymore.", expenditure };
      calculator.addProcurement(newProcurement);
      notifyChange();
    }
  };

  return (
    <div className="calculator-form">
      <h2>Calculator Form</h2>

      {/* Staff Section */}
      <div className="section">
        <label>Total Staff: </label>
        <input type="number" value={totalStaff} onChange={(e) => setTotalStaff(parseInt(e.target.value) || 0)} />
        <label>Assigned Staff: </label>
        <input type="number" value={assignedStaff} onChange={(e) => setAssignedStaff(parseInt(e.target.value) || 0)} />
        <button onClick={changeStaff}>Update Staff</button>
      </div>

      {/* Procurement Section */}
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
    </div>
  );
};

export default CalculatorForm;
