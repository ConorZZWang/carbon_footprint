import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 200 },
];

const COLORS = ['#2ECC71', '#27AE60', '#229954', '#1E8449']; // Different green shades

const Graph = () => {
    return (
        <div className="graph-container">
            <PieChart width={250} height={250}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}  // Donut effect
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default Graph;
