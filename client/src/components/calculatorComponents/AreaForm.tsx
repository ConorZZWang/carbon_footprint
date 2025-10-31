import React, { useState, useEffect } from "react";
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./CalculatorForm.css";

const AreaForm: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();

    // Options
    const [areaOptions, setAreaOptions] = useState<string[]>([]);
    const [area, setArea] = useState<number>(0);
    const [areaName, setAreaName] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");

    // Fetch options from calculator when it loads
    useEffect(() => {
        if (calculator) {
            setAreaOptions(calculator.getSpaceOptions());
        }
    }, [calculator]);
  
    // Default selection when calculator has loaded.
    useEffect(() => {
        if (areaOptions.length > 0) {
            setSelectedType(areaOptions[0]);
        }
    }, [areaOptions])

    const addArea = () => {
        if (calculator && (areaName != "")) {
            let areaType = calculatorInterface.stringToBenchmarkType(selectedType);
            if (areaType) {
                let newArea: calculatorInterface.AREA = { label: areaName, area: area, type: areaType };
                calculator.setArea(newArea);
            }
            notifyChange();
        }
    };

    return (
      <div className="section">
        <label>Area Name: </label>
        <input type="text" value={areaName} onChange={(e) => setAreaName(e.target.value)} />
        <label>Area: (m2) </label>
        <input type="number" value={area} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} />
        <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
        >
        {areaOptions.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
        </select>
        <button onClick={addArea}>Add Area</button>
      </div>
  );
};

export default AreaForm;
