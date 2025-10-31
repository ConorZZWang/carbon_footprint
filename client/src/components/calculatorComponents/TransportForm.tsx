import React, { useState, useEffect } from "react";
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./CalculatorForm.css";

const TransportForm: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();

    // Options
    const [transportOptions, setTransportOptions] = useState<string[]>([]);
    const [usage, setUsage] = useState<number>(0);
    const [selectedTransport, setSelectedTransport] = useState<string>("");

    // Fetch options from calculator when it loads
    useEffect(() => {
        if (calculator) {
            setTransportOptions(calculator.getTransportOptions());
        }
    }, [calculator]);
  
    // Default selection when calculator has loaded.
    useEffect(() => {
        if (transportOptions.length > 0) {
            setSelectedTransport(transportOptions[0]);
        }
    }, [transportOptions])

    const addTransport = () => {
        if (calculator) {
            let newTransport: calculatorInterface.usage = { label: selectedTransport, usage: usage };
            calculator.addTransport(newTransport);
            notifyChange();
        }
    };

    return (
      <div className="section">
        <label>Transport (km): </label>
        <input type="number" value={usage} onChange={(e) => setUsage(parseFloat(e.target.value) || 0)} />
        <select 
            value={selectedTransport} 
            onChange={(e) => setSelectedTransport(e.target.value)}
        >
        {transportOptions.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
        </select>
        <button onClick={addTransport}>Add Transport</button>
      </div>
  );
};

export default TransportForm;
