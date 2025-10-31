export namespace calculatorInterface {
    export type AREA = {
        label: string;
        area: number;
        type: benchmarkType;
    }
    
    export type usage = {
        label: string;
        usage: number;
    }
    
    export type procurement = {
        code: string;
        description: string;
        expenditure: number;
    }

    export type STAFF = {
        TOTAL_STAFF: number;
        ASSIGNED_STAFF: number;
    }

    export enum benchmarkType {
        PHYSICAL_LAB,
        MEDICAL_LIFE_LAB,
        ENGINEERING_LAB,
        ACADEMIC_OFFICE,
        ADMIN_OFFICE
    };

    export enum resource {
        ELECTRICITY,
        GAS,
        WATER
    }

    export type procurementEmissionsByCategory = {
        [category: string]: { expenditure: number; emissions: number};
    }   

    export type RESULTS =  {
        electricityEmissions: number;
        gasEmissions: number;
        waterEmissions: number;
        transportEmissions: number;
        wasteEmissions: number;
        totalProcurementEmissions: number;
        totalEmissions: number;
    }

    export type areaConsumption = {
        electricity: number;
        gas: number;
        water: number;
    }

    export type areaEmissions = {
        electricity: number;
        gas: number;
        water: number;
    }

    export function stringToBenchmarkType(value: string): calculatorInterface.benchmarkType | undefined {
        const entries = Object.entries(calculatorInterface.benchmarkType) as [string, string][];
        
        for (const [key, val] of entries) {
            if (val === value) {
                return calculatorInterface.benchmarkType[key as keyof typeof calculatorInterface.benchmarkType];
            }
        }
        return undefined;
    }

    export const benchmarkTypeToString = (value: benchmarkType): string => {
        return benchmarkType[value];
    };

    export type calculatorState = {
        totalStaff: number;
        assignedStaff: number;
        areas: calculatorInterface.AREA[];
        transport: calculatorInterface.usage[];
        waste: calculatorInterface.usage[];
        procurements: calculatorInterface.procurement[];
        categoryResults: { [category: string]: { expenditure: number; emissions: number } }
        electricityEmissions: number;
        gasEmissions: number;
        waterEmissions: number;
        transportEmissions: number;
        wasteEmissions: number;
        totalProcurementEmissions: number;
        totalEmissions: number;
    }
}