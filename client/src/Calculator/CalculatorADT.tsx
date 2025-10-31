export namespace procurementMap {
    export type ProcurementDescriptions = {
        [procurementCode: string]: string;
    };

    export type ProcurementDefra = {
        [procurementCode: string]: { defra: string; proportion: number }[];
    };
      
    export type DefraEmissions = {
        [defra: string]: number;
    };
      
    export type CategoryMap = {
        [category: string]: string;
    };
    
    export type ProcurementData = {
        procurementDescriptions: ProcurementDescriptions;
        procurementDefra: ProcurementDefra;
        categoryMap: CategoryMap;
        defraEmissions: DefraEmissions;
    };
}

export namespace benchmarkMap {
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

    export type benchmark = {
        value: number;
        date: Date;
    }

    export type benchmarkData = {
        [type in benchmarkType]: {
            [res in resource]: benchmark;
        };
    };

    export type benchmarkMultiplier = {
        resource : resource;
        multiplier: number;
    }
}

export namespace carbonIntensityFactor {
    export type factor = {
        label: string;
        factor: number;
        date: Date;
    }
}

export type calculatorData = {
    gasIntensityFactor: carbonIntensityFactor.factor;
    electricityIntensityFactor: carbonIntensityFactor.factor;
    waterIntensityFactor: carbonIntensityFactor.factor;
    wasteFactors: carbonIntensityFactor.factor[];
    transportFactors: carbonIntensityFactor.factor[];
    benchmarks: benchmarkMap.benchmarkData;
    gasMult: benchmarkMap.benchmarkMultiplier;
    electricityMult: benchmarkMap.benchmarkMultiplier;
    procurementData: procurementMap.ProcurementData;
}

export type conversionFactors = {
    gasIntensityFactor: carbonIntensityFactor.factor;
    electricityIntensityFactor: carbonIntensityFactor.factor;
    waterIntensityFactor: carbonIntensityFactor.factor;
    wasteFactors: carbonIntensityFactor.factor[];
    transportFactors: carbonIntensityFactor.factor[];
}