import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./TransportWasteTables.css";

const WasteTable: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;

    const wasteEntries = calculator.getWasteEntries() as calculatorInterface.usage[];

    // Handle empty data case
    if (wasteEntries.length === 0) {
        return <p>No waste data available.</p>;
    }

    return (
        <div className="tableWaste">
            <table>
                <thead>
                    <tr>
                        <th>Waste</th>
                        <th>Tonnes ()</th>
                    </tr>
                </thead>
                <tbody>
                    {wasteEntries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.label}</td>
                            <td>{entry.usage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WasteTable;
