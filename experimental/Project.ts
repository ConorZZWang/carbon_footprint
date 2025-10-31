import {CarbonCalculator} from './CarbonEquivalentCalculator';
import { IArea, ITransport, IWaste, IProcurement } from './CalculatorInterfaces';

export class Project {
    //User provided information
    protected STAFF: number;
    protected AREA: Map<string, IArea>;
    protected TRANSPORT: Map<string, ITransport>;
    protected WASTE: Map<string, IWaste>;
    protected PROCUREMENT: Map<string, Map<string,IProcurement>>;

    constructor() {
        this.STAFF = 0;
        this.AREA = new Map<string, IArea>();
        this.TRANSPORT = new Map<string, ITransport>();
        this.WASTE = new Map<string, IWaste>();
        this.PROCUREMENT = new Map<string, Map<string,IProcurement>>();
    }

    public setStaff(proportoion: number) {
        this.STAFF = proportoion;
    }
    
    public setArea(area: IArea) {
        this.AREA.set(area.getLabel(), area);
    }

    public setTransport(transport: ITransport) {
        this.TRANSPORT.set(transport.getLabel(), transport);
    }

    public setWaste(waste: IWaste) {
        this.WASTE.set(waste.getLabel(), waste);
    }

    public setProcurement(procurement: IProcurement) {
        let map = this.PROCUREMENT.get(procurement.getLabel());
        if(!map)    map = new Map<string,IProcurement>();
        map.set(procurement.getCode(),procurement);
        this.PROCUREMENT.set(procurement.getLabel(),map);
    }

    public getElectricityEmissions(): number {
        let emissions: number = 0;
        let consumption: number = 0;

        this.AREA.forEach((space) => {
            consumption = CarbonCalculator.electricityConsumption(this.STAFF, space.getArea(), space.getElectricityBenchmark());
            emissions += CarbonCalculator.electricityEmissions(consumption, space.getElectricalIntensityFactor());
        });

        return emissions;
    }

    public getGasEmissions(): number {
        let emissions: number = 0;
        let consumption: number = 0;

        this.AREA.forEach((space) => {
            consumption = CarbonCalculator.gasConsumption(this.STAFF, space.getArea(), space.getGasBenchmark());
            emissions += CarbonCalculator.gasEmissions(consumption, space.getGasIntensityFactor());
        });

        return emissions;
    }

    public getWaterEmissions(): number {
        let emissions: number = 0;
        let consumption: number = 0;

        this.AREA.forEach((space) => {
            consumption = CarbonCalculator.waterConsumptions(this.STAFF, space.getArea(), space.getWaterBenchmark());
            emissions += CarbonCalculator.waterEmissions(consumption, space.getWaterIntensityFactor());
        });

        return emissions;
    }

    public getTransportEmissions(): number {
        let emissions: number = 0;

        this.TRANSPORT.forEach((transport) => {
            emissions += CarbonCalculator.transportEmissions(transport.getDistanceKM(), transport.getEmissions());
        });

        return emissions;
    }

    public getWasteEmissions(): number {
        let emissions: number = 0;

        this.WASTE.forEach((waste) => {
            emissions += CarbonCalculator.wasteEmissions(waste.getTonnage(), waste.getEmissions());
        });

        return emissions;
    }

    public getProcurementEmissions(): number {
        let emissions: number = 0;

        this.PROCUREMENT.forEach((label) => {
            label.forEach((expenditure) => {
                emissions += CarbonCalculator.procurementEmissions(expenditure.getExpenditure(), expenditure.getFactor());
            });
        });

        return emissions;
    }

    public getCarbonEmissions(): number {
        let emissions: number = 0;
        emissions += this.getElectricityEmissions();
        emissions += this.getGasEmissions();
        emissions += this.getWaterEmissions();
        emissions += this.getTransportEmissions();
        emissions += this.getWasteEmissions();
        emissions += this.getProcurementEmissions();

        return emissions;
    }

}