import { calculatorData, benchmarkMap, conversionFactors } from './CalculatorADT';
import { ProcurementCalculator } from './ProcurementCalculator';
import {calculatorInterface} from   './CalculatorInterfaces';
import { CarbonCalculator } from './CarbonEquivalentCalculator'; 

export class Calculator {
    protected STAFF: calculatorInterface.STAFF = { TOTAL_STAFF: 0, ASSIGNED_STAFF: 0 } as calculatorInterface.STAFF;
    protected calculatorData: calculatorData;
    protected procurementCalculator: ProcurementCalculator;
    protected AREA: Map<string, calculatorInterface.AREA>;
    protected TRANSPORT: Map<string, calculatorInterface.usage>;
    protected WASTE: Map<string, calculatorInterface.usage>;

    // Internal State variables to reduce complexity from O(N) to O(1).
    protected electricityConsumption: number = 0;
    protected gasConsumption: number = 0;
    protected waterConsumption: number = 0;
    protected electricityEmissions: number = 0;
    protected gasEmissions: number = 0;
    protected waterEmissions: number = 0;
    protected transportEmissions: number = 0;
    protected wasteEmissions: number = 0;
    // Procurement Emissions inside ProcurementCalculator

    constructor(calculatorData: calculatorData) {
        this.calculatorData = calculatorData;
        this.procurementCalculator = new ProcurementCalculator(calculatorData.procurementData);
        this.AREA = new Map<string, calculatorInterface.AREA>();
        this.TRANSPORT = new Map<string, calculatorInterface.usage>();
        this.WASTE = new Map<string, calculatorInterface.usage>();
    }

    // AREA CALCULATIONS //

    public setStaff(staff: calculatorInterface.STAFF) {
        this.STAFF = staff;
        this.updateAreas();
    }

    public getStaff(): calculatorInterface.STAFF {
        return this.STAFF;
    }

    protected updateAreas() {
        this.clearAreaStats();
        this.AREA.forEach((value) => {
            this.addAreaStats(value);
        });
    }

    public setArea(newArea: calculatorInterface.AREA) {
        let current = this.AREA.get(newArea.label);
        if (current) {
            this.removeAreaStats(newArea);
        }
        this.AREA.set(newArea.label, newArea);
        this.addAreaStats(newArea);
    }

    public removeArea(area: calculatorInterface.AREA) {
        this.AREA.delete(area.label);
    }

    protected clearAreaStats() {
        this.electricityConsumption = 0;
        this.gasConsumption = 0;
        this.waterConsumption = 0;
        this.electricityEmissions = 0;
        this.gasEmissions = 0;
        this.waterEmissions = 0;
    }
    
    protected removeAreaStats(subtract: calculatorInterface.AREA) {
        let consumptions = this.getAreaConsumption(subtract.label);
        let emissions = this.getAreaEmissions(subtract.label);  // Calculating consumptions twice here. Should try to find the invariant and optimise.
        
        this.electricityConsumption -= consumptions.electricity;
        this.gasConsumption -= consumptions.gas;
        this.waterConsumption -= consumptions.water;

        this.electricityEmissions -= emissions.electricity;
        this.gasEmissions -= emissions.gas;
        this.waterEmissions -= emissions.water;
    }

    protected addAreaStats(add: calculatorInterface.AREA) {
        let consumptions = this.getAreaConsumption(add.label);
        let emissions = this.getAreaEmissions(add.label);
        
        this.electricityConsumption += consumptions.electricity;
        this.gasConsumption += consumptions.gas;
        this.waterConsumption += consumptions.water;

        this.electricityEmissions += emissions.electricity;
        this.gasEmissions += emissions.gas;
        this.waterEmissions += emissions.water;
    }

    public getAreaConsumption(name: string): calculatorInterface.areaConsumption {
        let area = this.AREA.get(name);
        if (!area)  return {electricity: 0 , gas: 0, water: 0 } as unknown as calculatorInterface.areaConsumption;

        let staff_proportion = this.STAFF.ASSIGNED_STAFF / this.STAFF.TOTAL_STAFF;
        let ordinalValue = calculatorInterface.benchmarkType[area.type as unknown as keyof typeof calculatorInterface.benchmarkType];

        let electricityBenchmark: number = this.calculatorData.benchmarks[ordinalValue][calculatorInterface.resource.ELECTRICITY].value;
        let electricityConsumption: number = CarbonCalculator.electricityConsumption(staff_proportion, area.area, electricityBenchmark) * this.calculatorData.electricityMult.multiplier;

        let gasBenchmark: number = this.calculatorData.benchmarks[ordinalValue][calculatorInterface.resource.GAS].value;
        let gasConsumption: number = CarbonCalculator.gasConsumption(staff_proportion, area.area, gasBenchmark) * this.calculatorData.gasMult.multiplier;

        let waterBenchmark: number = this.calculatorData.benchmarks[ordinalValue][calculatorInterface.resource.WATER].value;
        let waterConsumption: number = CarbonCalculator.waterConsumptions(staff_proportion, area.area, waterBenchmark);

        return {electricity: electricityConsumption, gas: gasConsumption, water: waterConsumption} as calculatorInterface.areaConsumption;
    }

    public getAreaEmissions(name: string): calculatorInterface.areaEmissions {
        let consumptions = this.getAreaConsumption(name);

        let electricityEmissions = CarbonCalculator.electricityEmissions(consumptions.electricity, this.calculatorData.electricityIntensityFactor.factor);
        let gasEmissions = CarbonCalculator.gasEmissions(consumptions.gas, this.calculatorData.gasIntensityFactor.factor);
        let waterEmissions = CarbonCalculator.waterEmissions(consumptions.water, this.calculatorData.waterIntensityFactor.factor);

        return {electricity: electricityEmissions, gas: gasEmissions, water: waterEmissions} as calculatorInterface.areaEmissions;
    }

    public getElectricityConsumption(): number {
        return this.electricityConsumption;
    }

    public getGasConsumption(): number {
        return this.gasConsumption;
    }

    public getWaterConsumption(): number {
        return this.waterConsumption;
    }

    public getElectricityEmissions(): number {
        return this.electricityEmissions;
    }

    public getGasEmissions(): number {
        return this.gasEmissions;
    }

    public getWaterEmissions(): number {
        return this.waterEmissions;
    }

    // TRANSPORT CALCULATIONS

    public setTransport(newTransport: calculatorInterface.usage) {
        let current = this.TRANSPORT.get(newTransport.label);
    
        if (current) {
            this.removeTransportEmissions(current);
        }
    
        if (newTransport.usage <= 0) {
            this.TRANSPORT.delete(newTransport.label);
        } else {
            this.TRANSPORT.set(newTransport.label, newTransport);
            this.addTransportEmissions(newTransport);
        }
    }

    protected removeTransportEmissions(removedTransport: calculatorInterface.usage) {
        this.transportEmissions -= CarbonCalculator.transportEmissions(removedTransport.usage, this.calculatorData.transportFactors.find(f => f.label === removedTransport.label)!.factor);
    }

    protected addTransportEmissions(newTransport: calculatorInterface.usage) {
        this.transportEmissions += CarbonCalculator.transportEmissions(newTransport.usage, this.calculatorData.transportFactors.find(f => f.label === newTransport.label)!.factor);
    }

    public addTransport(newTransport: calculatorInterface.usage) {
        let current = this.TRANSPORT.get(newTransport.label);
        this.addTransportEmissions(newTransport);
        if (current) {
            newTransport.usage += current.usage;
        }
        this.TRANSPORT.set(newTransport.label, newTransport);
    }

    public getTransportEmissions(): number {
        return this.transportEmissions;
    }

    // WASTE CALCULATIONS

    public setWaste(newWaste: calculatorInterface.usage) {
        let current = this.WASTE.get(newWaste.label);
    
        if (current) {
            this.removeWasteEmissions(current);
        }
    
        if (newWaste.usage <= 0) {
            this.WASTE.delete(newWaste.label);
        } else {
            this.WASTE.set(newWaste.label, newWaste);
            this.addWasteEmissions(newWaste);
        }
    }
    
    public addWaste(newWaste: calculatorInterface.usage) {
        let current = this.WASTE.get(newWaste.label);
        this.addWasteEmissions(newWaste);
        if (current) {
            newWaste.usage += current.usage;
        }
        this.WASTE.set(newWaste.label, newWaste);
    }

    protected removeWasteEmissions(waste: calculatorInterface.usage) {
        this.wasteEmissions -= CarbonCalculator.wasteEmissions(waste.usage, this.calculatorData.wasteFactors.find(f => f.label === waste.label)!.factor);
    }

    protected addWasteEmissions(waste: calculatorInterface.usage) {
        this.wasteEmissions += CarbonCalculator.wasteEmissions(waste.usage, this.calculatorData.wasteFactors.find(f => f.label === waste.label)!.factor);
    }

    public getWasteEmissions(): number {
        return this.wasteEmissions;
    }

    // PROCUREMENT CALCULATIONS

    public setProcurement(newProcurement: calculatorInterface.procurement) {
        this.procurementCalculator.setExpenditure(newProcurement);
    }

    public addProcurement(newProcurement: calculatorInterface.procurement) {
        this.procurementCalculator.addExpenditure(newProcurement);
    }

    public addProcurements(newProcurements: calculatorInterface.procurement[]) {
        this.procurementCalculator.addExpenditures(newProcurements);
    }

    public getTotalProcurementEmissions(): number {
        return this.procurementCalculator.getTotalProcurementEmissions();
    }

    public getProcurementEmissionsByCategory(): calculatorInterface.procurementEmissionsByCategory {
        return this.procurementCalculator.getCategoryExpendituresAndEmissions();
    }

    // CALCULATOR DATA GETTERS

    public getSpaceOptions(): string[] {
        const spaces = Object.values(calculatorInterface.benchmarkType).filter(value => typeof value === 'string') as string[];
        return spaces;
    }

    public getWasteOptions(): string[] {
        return this.calculatorData.wasteFactors.map(factor => factor.label);
    }

    public getTransportOptions(): string[] {
        return this.calculatorData.transportFactors.map(factor => factor.label);
    }

    public getProcurementOptions(): { code: string; description: string }[] {
        return Object.entries(this.calculatorData.procurementData.procurementDescriptions)
        .map(([code, description]) => ({ code, description }));
    }

    public getExpenditures(): calculatorInterface.procurement[] {
        return this.procurementCalculator.getExpenditures();
    }

    public getResults(): calculatorInterface.RESULTS {
        let totalProcurementEmissions = this.getTotalProcurementEmissions();
        let totalEmissions = this.electricityEmissions + this.gasEmissions + 
                             this.waterEmissions + this.transportEmissions + 
                             this.wasteEmissions + totalProcurementEmissions;
    
        return {
            electricityEmissions: this.electricityEmissions,
            gasEmissions: this.gasEmissions,
            waterEmissions: this.waterEmissions,
            transportEmissions: this.transportEmissions,
            wasteEmissions: this.wasteEmissions,
            totalProcurementEmissions,
            totalEmissions
        } as calculatorInterface.RESULTS;
    }

    public getTransportEntries(): calculatorInterface.usage[] {
        return Array.from(this.TRANSPORT.values());
    }

    public getWasteEntries(): calculatorInterface.usage[] {
        return Array.from(this.WASTE.values());
    }

    public getAreaEntries(): calculatorInterface.AREA[] {
        return Array.from(this.AREA.values());
    }

    public exportState(): calculatorInterface.calculatorState {
        let procurementState = this.procurementCalculator.exportState();
        let totalProcurementEmissions = this.getTotalProcurementEmissions();
        let totalEmissions = this.electricityEmissions + this.gasEmissions + 
                             this.waterEmissions + this.transportEmissions + 
                             this.wasteEmissions + totalProcurementEmissions;
        
        return {
            totalStaff: this.STAFF.TOTAL_STAFF,
            assignedStaff: this.STAFF.ASSIGNED_STAFF,
            areas: Array.from(this.AREA.values()),
            transport: Array.from(this.TRANSPORT.values()),
            waste: Array.from(this.WASTE.values()),
            procurements: procurementState.procurement,
            categoryResults: procurementState.emissionsData,
            electricityEmissions: this.electricityEmissions,
            gasEmissions: this.gasEmissions,
            waterEmissions: this.waterEmissions,
            transportEmissions: this.transportEmissions,
            wasteEmissions: this.wasteEmissions,
            totalProcurementEmissions: totalProcurementEmissions,
            totalEmissions: totalEmissions
        };
    }
    
    // Function to export the state toMongoDB
    public async exportStateToMongoDB() {
        const state = this.exportState(); // Get the exported state from the `cal` object

        try {
            const response = await fetch("http://localhost:3001/api/saveState", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(state)
            });
    
            const data = await response.json();
            console.log("✅ State saved successfully:", data);
        } catch (error) {
            console.error("❌ Error exporting state to MongoDB:", error);
        }
    
    }


    // CALCULATOR DATA SETTERS - Procurement map is assumed to be immutable and thus no setter or getter is defined.

    public setBenchmarkData(benchmarks: benchmarkMap.benchmarkData) {
        this.calculatorData.benchmarks = benchmarks;
    }

    public setBenchmarkMultipliers(electricityMultiplier: benchmarkMap.benchmarkMultiplier, gasMultiplier: benchmarkMap.benchmarkMultiplier) {
        this.calculatorData.electricityMult = electricityMultiplier;
        this.calculatorData.gasMult = gasMultiplier;
    }

    public setConversionFactors(factors: conversionFactors) {
        this.loadConversionFactors(factors);
    }

    public load(state: calculatorInterface.calculatorState): void {
        // Load staff
        this.STAFF.TOTAL_STAFF = state.totalStaff;
        this.STAFF.ASSIGNED_STAFF = state.assignedStaff;
    
        // Load areas, transport, and waste entries
        this.AREA = new Map(state.areas.map(area => [area.label, area]));
        this.TRANSPORT = new Map(state.transport.map(usage => [usage.label, usage]));
        this.WASTE = new Map(state.waste.map(usage => [usage.label, usage]));
    
        // Load procurement entries
        this.procurementCalculator.loadState(state);
    
        // Load emissions results
        this.electricityEmissions = state.electricityEmissions;
        this.gasEmissions = state.gasEmissions;
        this.waterEmissions = state.waterEmissions;
        this.transportEmissions = state.transportEmissions;
        this.wasteEmissions = state.wasteEmissions;
    }

    // UTILTIY FUNCTIONS

    protected loadConversionFactors( factors: conversionFactors ): calculatorData {
        return { ...this.calculatorData, ...factors };
    }

}