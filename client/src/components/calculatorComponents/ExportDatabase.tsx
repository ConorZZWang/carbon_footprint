import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';

const ExportDatabase: React.FC = () => {
    const { calculator, notifyChange } = useCalculator();
    if (!calculator) return <p>Loading calculator...</p>;

    const handleExportState = async () => {
        console.log("✅ State exported successfully!");
        try {
            await calculator.exportStateToMongoDB();
            console.log("✅ State exported successfully!");
            notifyChange()
        } catch (error) {
            console.error("❌ Error exporting state:", error);
        }
    };

    return (
       <button onClick={handleExportState}>Export</button>
    );
};

export default ExportDatabase;