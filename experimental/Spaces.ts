import { IBenchmark, ICarbonIntensityFactor, IArea } from "./CalculatorInterfaces";

class Area implements IArea {
    protected label = "";
    protected area: number = 0;
    protected staff: number = 0;

    //Consumption
    protected electricity: IBenchmark;
    protected gas: IBenchmark;
    protected water: IBenchmark;

    //Intensity
    protected electricityFactor: ICarbonIntensityFactor;
    protected gasFactor: ICarbonIntensityFactor;
    protected waterFactor: ICarbonIntensityFactor;

    constructor(label: string, area: number, electricityBenchmark: IBenchmark, gasBenchmark: IBenchmark, 
    waterBenchmark: IBenchmark, electricityFactor: ICarbonIntensityFactor, 
    gasFactor: ICarbonIntensityFactor, waterFactor: ICarbonIntensityFactor) {

        this.label = label;
        this.area = area;
        this.electricity = electricityBenchmark;
        this.gas = gasBenchmark;
        this.water = waterBenchmark;
        this.electricityFactor = electricityFactor;
        this.gasFactor = gasFactor;
        this.waterFactor = waterFactor;
    }

    public getLabel(): string {
        return this.label;
    }

    public setArea(area: number) {
        this.area = area;
    }

    public getArea(): number {
        return this.area;
    }

    public setStaff(staff: number) {
        this.staff = staff;
    }

    public getStaff(): number {
        return this.staff;
    }

    public getElectricityBenchmark(): number {
        return this.electricity.getBenchmark();
    }

    public getGasBenchmark(): number {
        return this.gas.getBenchmark();
    }

    public getWaterBenchmark(): number {
        return this.water.getBenchmark();
    }

    public getElectricalIntensityFactor(): number {
        return this.electricityFactor.getFactor();
    }

    public getGasIntensityFactor(): number {
        return this.gasFactor.getFactor();
    }

    public getWaterIntensityFactor(): number {
        return this.waterFactor.getFactor();
    }
}

export abstract class AreaFactory {

    static createArea(label: string, area: number, electricityBenchmark: IBenchmark, gasBenchmark: IBenchmark, 
        waterBenchmark: IBenchmark, electricityFactor: ICarbonIntensityFactor, 
        gasFactor: ICarbonIntensityFactor, waterFactor: ICarbonIntensityFactor): IArea {

        return new Area(label, area, electricityBenchmark, gasBenchmark, waterBenchmark, electricityFactor, gasFactor, waterFactor) as IArea;
    }
}