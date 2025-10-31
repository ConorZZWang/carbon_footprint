import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';

const Results: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;

    const results = calculator.getResults();

    return (
        <div className="chart">
            <ul>
                <li><strong>Electricity Emissions:</strong> {results.electricityEmissions} kg CO₂</li>
                <li><strong>Gas Emissions:</strong> {results.gasEmissions} kg CO₂</li>
                <li><strong>Water Emissions:</strong> {results.waterEmissions} kg CO₂</li>
                <li><strong>Waste Emissions:</strong> {results.wasteEmissions} kg CO₂</li>
                <li><strong>Transport Emissions:</strong> {results.transportEmissions} kg CO₂</li>
                <li><strong>Procurement Emissions:</strong> {results.totalProcurementEmissions} kg CO₂</li>
                <li><strong>Total Emissions:</strong> {results.totalEmissions} kg CO₂</li>
            </ul>
        </div>
    );
};

export default Results;
