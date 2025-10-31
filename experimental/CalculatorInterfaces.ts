export namespace IBenchmark {

    export enum type {
        PHYSICAL_LAB,
        MEDICAL_LIFE_LAB,
        ENGINEERING_LAB,
        ACADEMIC_OFFICE,
        ADMIN_OFFICE
    }
    
    /**
     * IBenchmark is an interface for defining the required outputs of the benchmark class.
     */
    export interface benchmark {
        getBenchmark(): number;
        getLabel(): string;
        getType(): type;
        getDate(): Date;
    }
}

/**
 * ICarbonIntensity is an interface for defining the required outputs of the CarbonIntensityFactor class.
 */
export interface ICarbonIntensityFactor {
    getFactor(): number;
    getLabel(): string;
    getDate(): Date;
}

/**
 * IProcurementFactor is an interface that extends the ICarbonIntensityFactor interface to give additional methods or variables for
 * dealing with procurement codes.
 */
export interface IProcurementFactor extends ICarbonIntensityFactor {
    getIndex(): number;
}

export interface IProcurementCode {
    getCode() : string;
    getDescription() : string;
}

export interface IArea {
    getLabel(): string;
    getArea(): number;
    getStaff(): number;
    getElectricityBenchmark(): number;
    getGasBenchmark(): number;
    getWaterBenchmark(): number;
    getElectricalIntensityFactor(): number;
    getGasIntensityFactor(): number;
    getWaterIntensityFactor(): number;
}

export interface IConsumption {
    getLabel(): string;
    getConsumption(): number;
    getEmissions(): number;
}

export interface ITransport extends IConsumption {
    getDistanceKM(): number;
}

export interface IWaste extends IConsumption {
    getTonnage(): number;
}

export interface IProcurement {
    getCode(): string;
    getLabel(): string;
    getFactor(): number;
    getExpenditure(): number;
}