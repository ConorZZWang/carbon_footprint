import * as XLSX from 'xlsx';
import {procurementMap, benchmarkMap, carbonIntensityFactor, calculatorData} from './CalculatorADT.js';

export abstract class Parser {
    // EXCEL Workbook filepath
    private static workbook = XLSX.readFile('The_Current_App_2024.xlsx');

    // Procurement factor work sheet
    private static DEFRA = 'DEFRA Categories';
    private static DEFRA_SHEET = this.workbook.Sheets[this.DEFRA];
    private static DEFRA_DATA_DATE = new Date("2011-01-01");

    //Conversion Factor work sheet
    private static CONV_FACTORS = 'Conversion Factors';
    private static CONV_FACTORS_SHEET = this.workbook.Sheets[this.CONV_FACTORS];
    private static CONV_FACTORS_DATE = new Date("2021-01-01");

    //Benchmark Data work sheet
    private static BENCH_DATA = 'Benchmark Data';
    private static BENCH_DATA_SHEET = this.workbook.Sheets[this.BENCH_DATA];
    private static BENCH_DATA_DATE = new Date("2024-01-01");

    //HE 311 Concord work sheet
    private static HE311_CONCORD = 'HE 311 Concord';
    private static HE311_CONCORD_SHEET = this.workbook.Sheets[this.HE311_CONCORD];
    private static HE311_CONCORD_DATE = new Date("2024-01-01");

    static parseTransportFactors(): carbonIntensityFactor.factor[] {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A8:A22', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B8:B22', header: 1 }).flat().map(Number);

        return labels.map((label, i) => ({
            label,
            factor: activity_GHG[i] || 0,
            date: this.CONV_FACTORS_DATE
        }));
    }

    static parseWasteFactors(): carbonIntensityFactor.factor[] {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A23:A28', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B23:B28', header: 1 }).flat().map(Number);

        return labels.map((label, i) => ({
            label,
            factor: activity_GHG[i] || 0,
            date: this.CONV_FACTORS_DATE
        }));
    }

    static parseElectricityFactor(): carbonIntensityFactor.factor {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A3:A4', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B3:B4', header: 1 }).flat().map(Number);

        const totalFactor = activity_GHG.reduce((sum, value) => sum + (value || 0), 0);

        return {
            label: "Electrical Intensity Factor",
            factor: totalFactor,
            date: this.CONV_FACTORS_DATE
        };
    }

    static parseGasFactor(): carbonIntensityFactor.factor {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A4:A5', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B4:B5', header: 1 }).flat().map(Number);

        const totalFactor = activity_GHG.reduce((sum, value) => sum + (value || 0), 0);

        return {
            label: "Gas Intensity Factor",
            factor: totalFactor,
            date: this.CONV_FACTORS_DATE
        };
    }

    static parseWaterFactor(): carbonIntensityFactor.factor {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A6:A7', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B6:B7', header: 1 }).flat().map(Number);

        const totalFactor = activity_GHG.reduce((sum, value) => sum + (value || 0), 0);

        return {
            label: "Water Intensity Factor",
            factor: totalFactor,
            date: this.CONV_FACTORS_DATE
        };
    }

    static parseElectricityMultiplier(): benchmarkMap.benchmarkMultiplier {
        const totalElectricity: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B8', header: 1 })[0]) || 0;
        const averageElectricity: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B12', header: 1 })[0]) || 0;
        const multiplier: benchmarkMap.benchmarkMultiplier = {resource: benchmarkMap.resource.ELECTRICITY, multiplier: totalElectricity/averageElectricity};

        return multiplier;
    }

    static parseGasMultiplier(): benchmarkMap.benchmarkMultiplier {
        const totalGas: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B9', header: 1 })[0]) || 0;
        const averageGas: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B13', header: 1 })[0]) || 0;
        const multiplier: benchmarkMap.benchmarkMultiplier = {resource: benchmarkMap.resource.GAS, multiplier: totalGas/averageGas};

        return multiplier;
    }

    static parseProcurementData(): procurementMap.ProcurementData {
        // Extract procurement codes (A4:A432)
        const procurementCodes: string[] = XLSX.utils
        .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "A4:A432", header: 1 })
        .flat()
        .map(String);

        // Extract procurement descriptions (B4:B432)
        const descriptions: string[] = XLSX.utils
        .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "B4:B432", header: 1 })
        .flat()
        .map(String);

        // Extract super categories (D4:D432)
        const superCategories: string[] = XLSX.utils
        .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "D4:D432", header: 1 })
        .flat()
        .map(String);

        // Extract DEFRA categories (E2:LD2)
        const defraCategories: string[] = XLSX.utils
        .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "E2:LD2", header: 1 })
        .flat()
        .map(String);

        // Extract proportion mappings (E4:LD432)
        const rawProportions: any[][] = XLSX.utils.sheet_to_json(this.HE311_CONCORD_SHEET, { range: "E4:LD432", header: 1 });

        // Transform into the `procurementMap.ProcurementDefra` structure
        const procurementDefra: procurementMap.ProcurementDefra = {};
        const procurementDescriptions: procurementMap.ProcurementDescriptions = {};

        procurementCodes.forEach((code, index) => {
        procurementDefra[code] = defraCategories
            .map((defra, colIndex) => {
            const value = rawProportions[index]?.[colIndex]; // Get raw cell value
            return {
                defra,
                proportion: value !== undefined && value !== "" ? Number(value) : 0, // Ensure number, default to 0
            };
            })
            .filter(entry => entry.proportion > 0); // Keep only meaningful proportions

            procurementDescriptions[code] = descriptions[index];
        });


        // Extract DEFRA emissions
        const defraNames: string[] = XLSX.utils
        .sheet_to_json(this.DEFRA_SHEET, { range: "B3:B314", header: 1 })
        .flat()
        .map(String);

        const defraEmissionValues: number[] = XLSX.utils
            .sheet_to_json(this.DEFRA_SHEET, { range: "K3:K314", header: 1 })
            .flat()
            .map(Number);

        // Transform into the `procurementMap.DefraEmissions` structure
        const defraEmissions: procurementMap.DefraEmissions = {};
        defraNames.forEach((name, index) => {
            defraEmissions[name] = defraEmissionValues[index] || 0; // Default to 0 if missing
        });

        // Transform into the `procurementMap.CategoryMap` structure
        const categoryMap: procurementMap.CategoryMap = {};
        procurementCodes.forEach((code, index) => {
        categoryMap[code] = superCategories[index] || "Unknown"; // Default to "Unknown" if missing
        });
        return { procurementDescriptions, procurementDefra, categoryMap, defraEmissions };
    }

    static parseAllBenchmarks(): benchmarkMap.benchmarkData {
        // Extract Electricity Benchmarks
        const electricityValues = {
            [benchmarkMap.benchmarkType.PHYSICAL_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B14', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.MEDICAL_LIFE_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B14', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ENGINEERING_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B14', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ACADEMIC_OFFICE]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B16', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ADMIN_OFFICE]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B18', header: 1 })[0]) || 0
        };
    
        // Extract Gas Benchmarks
        const gasValues = {
            [benchmarkMap.benchmarkType.PHYSICAL_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B15', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.MEDICAL_LIFE_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B15', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ENGINEERING_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B15', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ACADEMIC_OFFICE]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B17', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ADMIN_OFFICE]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B19', header: 1 })[0]) || 0
        };
    
        // Extract Water Benchmarks
        const waterValues = {
            [benchmarkMap.benchmarkType.PHYSICAL_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B31', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.MEDICAL_LIFE_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B32', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ENGINEERING_LAB]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B33', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ACADEMIC_OFFICE]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B34', header: 1 })[0]) || 0,
            [benchmarkMap.benchmarkType.ADMIN_OFFICE]: Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B34', header: 1 })[0]) || 0
        };
    
        // Create benchmark map
        const benchmarkData: benchmarkMap.benchmarkData = {} as benchmarkMap.benchmarkData;
        const date = this.BENCH_DATA_DATE;
    
        // Populate the benchmark map
        for (const type of Object.values(benchmarkMap.benchmarkType).filter(v => typeof v === "number") as benchmarkMap.benchmarkType[]) {
            benchmarkData[type] = {
                [benchmarkMap.resource.ELECTRICITY]: { value: electricityValues[type], date },
                [benchmarkMap.resource.GAS]: { value: gasValues[type], date },
                [benchmarkMap.resource.WATER]: { value: waterValues[type], date }
            };
        }
    
        return benchmarkData;
    }

    static parseAllCalculatorData() : calculatorData {
        let gasIntensityFactor = this.parseGasFactor();
        let electricityIntensityFactor = this.parseElectricityFactor();
        let waterIntensityFactor = this.parseWaterFactor();
        let wasteFactors = this.parseWasteFactors();
        let transportFactors = this.parseTransportFactors();
        let benchmarks = this.parseAllBenchmarks();
        let gasMult = this.parseGasMultiplier();
        let electricityMult = this.parseElectricityMultiplier();
        let procurementdata = this.parseProcurementData();
        return {
            gasIntensityFactor,
            electricityIntensityFactor,
            waterIntensityFactor,
            wasteFactors,
            transportFactors,
            benchmarks,
            gasMult: gasMult,
            electricityMult: electricityMult,
            procurementData: procurementdata
        };
    }
}
