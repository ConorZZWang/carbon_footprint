import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorInterface } from '../../Calculator/CalculatorInterfaces';

const COLORS = [
    "#0B3D02",
    "#165B07",
    "#1E7D0B",
    "#239E0E",
    "#2DBD12",
    "#52D91D",
    "#76E83B",
    "#9DF35C",
    "#C4FA86",
    "#E6FFD0"
];

const roundToSF = (num: number, sf: number = 4): number => {
    return Number(num.toPrecision(sf));
};


const ProcurementGraph: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;

    const emissionsData = calculator.getProcurementEmissionsByCategory() as calculatorInterface.procurementEmissionsByCategory;

    const chartData = Object.entries(emissionsData)
        .map(([category, { emissions }]) => ({
            name: category,
            value: roundToSF(emissions) // Apply rounding here
        }))
        .filter(({ value }) => value > 0); // Remove categories with zero emissions

    // Handle empty data case
    if (chartData.length === 0) {
        return <p>No procurement emissions data available.</p>;
    }

    return (
        <div className="graph">
            <PieChart width={500} height={500}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100} // donut 
                    outerRadius={150}
                    paddingAngle={5} // space between slices
                    cornerRadius={10} // edges round
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        </div>
    );
};

export default ProcurementGraph;
