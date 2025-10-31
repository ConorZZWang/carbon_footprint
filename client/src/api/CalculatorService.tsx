import { calculatorData } from '../Calculator/CalculatorADT';
import { Calculator } from '../Calculator/Calculator';

const fetchCalculatorData = async (): Promise<any> => {
  try {
    const response = await fetch("http://localhost:3001/api/calculator-data");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching calculator data:", err);
    throw new Error("Failed to load calculator data");
  }
};

// Function to transform the JSON data into the calculatorData type
const transformCalculatorData = (jsonData: any): calculatorData => {
  return {
    gasIntensityFactor: jsonData.gasIntensityFactor,
    electricityIntensityFactor: jsonData.electricityIntensityFactor,
    waterIntensityFactor: jsonData.waterIntensityFactor,
    wasteFactors: jsonData.wasteFactors,
    transportFactors: jsonData.transportFactors,
    benchmarks: jsonData.benchmarks,
    gasMult: jsonData.gasMult,
    electricityMult: jsonData.electricityMult,
    procurementData: jsonData.procurementData,
  };
};

// Use the data to construct the Calculator class and return the instance
export const loadAndConstructCalculator = async (): Promise<Calculator> => {
  try {
    // Fetch and transform the data
    const jsonData = await fetchCalculatorData();
    const transformedData = transformCalculatorData(jsonData);

    // Pass the transformed data to the Calculator class constructor
    const calculatorInstance = new Calculator(transformedData);

    // Return the calculator instance
    return calculatorInstance;
  } catch (error) {
    console.error("Failed to load and construct calculator:", error);
    throw error; // Rethrow error to be handled by the caller
  }
};