import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./TransportWasteTables.css";

const TransportTable: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;

    const transportEntries = calculator.getTransportEntries() as calculatorInterface.usage[];
    console.log(transportEntries);

    // Handle empty data case
    if (transportEntries.length === 0) {
        return <p>No transport data available.</p>;
    }

    return (
        <div className="tableTransport">
            <table>
                <thead>
                    <tr>
                        <th>Transport</th>
                        <th>Distance (km)</th>
                    </tr>
                </thead>
                <tbody>
                    {transportEntries.map((entry, index) => (
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

export default TransportTable;
