import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';
import "./ProcurementTable.css";

const ProcurementTable: React.FC = () => {
    const { calculator } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;

    const procurementEntries = calculator.getExpenditures() as calculatorInterface.procurement[];

    // Handle empty data case
    if (procurementEntries.length === 0) {
        return <p>No procurement data available.</p>;
    }

    return (
        <div className="tableProcurement">
            <table>
                <thead>
                    <tr>
                        <th>Procurement Code</th>
                        <th>Description</th>
                        <th>Expenditure</th>
                    </tr>
                </thead>
                <tbody>
                    {procurementEntries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.code}</td>
                            <td>{entry.description}</td>
                            <td>{entry.expenditure}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProcurementTable;
