import { ICarbonIntensityFactor, IConsumption, ITransport, IWaste } from "./CalculatorInterfaces";

abstract class Consumption implements IConsumption {
    protected label = "";
    protected consumption: number = 0;
    protected emissions: ICarbonIntensityFactor;

    constructor(label: string) {
        this.label = label;
    }

    getLabel(): string {
        return this.label;
    }

    setConsumption(consumption: number) {
        this.consumption = consumption;
    }

    getConsumption(): number {
        return this.consumption;
    }

    setEmissions(emissions: ICarbonIntensityFactor) {
        this.emissions = emissions;
    }

    getEmissions(): number {
        return this.emissions.getFactor();
    }
} 

export class Transport extends Consumption implements ITransport {

    constructor(label: string) {
        super(label);
    }

    setDistanceKM(distance: number) {
        super.setConsumption(distance);
    }

    getDistanceKM(): number {
        return super.getConsumption();
    }
    
}

export class Waste extends Consumption implements IWaste {

    constructor(label: string) {
        super(label);
    }

    setTonnage(tonnage: number) {
        super.setConsumption(tonnage);
    }

    getTonnage(): number {
        return super.getConsumption();
    }

}