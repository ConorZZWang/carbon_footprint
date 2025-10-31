import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./AreaTable.css";

const roundToSF = (num: number, sf: number = 4): number => {
    return Number(num.toPrecision(sf));
};

const ProcurementTable: React.FC = () => {
    const { calculator } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;


    const procurementEntries = calculator.getAreaEntries();

    // Handle empty data case
    if (procurementEntries.length === 0) {
        return <p>No area data available.</p>;
    }

    return (
        <div className="tableArea">
            <table>
                <thead>
                    <tr>
                        <th>Area (m2)</th>
                        <th>Name</th>
                        <th>Room Type</th>
                        <th>Electricity consumption</th>
                        <th>Gas consumption</th>
                        <th>Water consumption</th>
                        <th>Electricity emissions</th>
                        <th>Gas emissions</th>
                        <th>Water emissions</th>
                    </tr>
                </thead>
                <tbody>
                    {procurementEntries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.area}</td>
                            <td>{entry.label}</td>
                            <td>{entry.type}</td>
                            <td>{roundToSF(calculator.getAreaConsumption(entry.label).electricity)}</td>
                            <td>{roundToSF(calculator.getAreaConsumption(entry.label).gas)}</td>
                            <td>{roundToSF(calculator.getAreaConsumption(entry.label).water)}</td>
                            <td>{roundToSF(calculator.getAreaEmissions(entry.label).electricity)}</td>
                            <td>{roundToSF(calculator.getAreaEmissions(entry.label).gas)}</td>
                            <td>{roundToSF(calculator.getAreaEmissions(entry.label).water)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProcurementTable;
