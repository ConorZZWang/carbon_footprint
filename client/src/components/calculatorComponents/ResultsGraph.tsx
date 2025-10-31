import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculator } from '../../context/CalculatorContext';

const COLORS = [
    "#165B07",
    "#239E0E",
    "#2DBD12",
    "#52D91D",
    "#76E83B",
    "#9DF35C",
    "#E6FFD0",

];

const roundToSF = (num: number, sf: number = 4): number => {
    return Number(num.toPrecision(sf));
};

const ResultsGraph: React.FC = () => {
    const { calculator } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;

    const results = calculator.getResults();

    // Prepare chart data
    const chartData = [
        { name: 'Electricity', value: roundToSF(results.electricityEmissions) },
        { name: 'Gas', value: roundToSF(results.gasEmissions) },
        { name: 'Water', value: roundToSF(results.waterEmissions) },
        { name: 'Waste', value: roundToSF(results.wasteEmissions) },
        { name: 'Transport', value: roundToSF(results.transportEmissions) },
        { name: 'Procurement', value: roundToSF(results.totalProcurementEmissions) }
    ].filter(entry => entry.value > 0); // Remove zero values

    if (chartData.length === 0) {
        return <p>No emissions data available.</p>;
    }

    return (
        <div className="graph">
            <PieChart width={500} height={500}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}  // Donut effect
                    outerRadius={150}
                    paddingAngle={5} // space between slices
                    cornerRadius={10} // edges round
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        </div>
    );
};

export default ResultsGraph;
