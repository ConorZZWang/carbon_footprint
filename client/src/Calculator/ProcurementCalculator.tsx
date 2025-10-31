import { procurementMap } from './CalculatorADT';
import { CarbonCalculator } from './CarbonEquivalentCalculator';
import { calculatorInterface } from './CalculatorInterfaces';

export class ProcurementCalculator {
    protected expenditures: calculatorInterface.procurement[] = [];
    protected procurementData: procurementMap.ProcurementData;
    protected categoryResults: { [category: string]: { expenditure: number; emissions: number } } = {};

    constructor(procurementData: procurementMap.ProcurementData) {
        this.procurementData = procurementData;
    }

    public setExpenditure(newExpenditure: calculatorInterface.procurement): void {
        if (!this.procurementData.procurementDefra[newExpenditure.code]) {
            console.warn(`Warning: Procurement code "${newExpenditure.code}" not found in mapping.`);
            return;
        }

        const existingIndex = this.expenditures.findIndex(e => e.code === newExpenditure.code);
        let previousExpenditure = 0;

        if (existingIndex !== -1) {
            previousExpenditure = this.expenditures[existingIndex].expenditure;
            this.expenditures[existingIndex] = newExpenditure;
        } else {
            this.expenditures.push(newExpenditure);
        }

        const delta = newExpenditure.expenditure - previousExpenditure;
        this.updateCategoryResults(newExpenditure.code, delta);
    }

    public addExpenditure(newExpenditure: calculatorInterface.procurement): void {
        if (!this.procurementData.procurementDefra[newExpenditure.code]) {
            console.warn(`Warning: Procurement code "${newExpenditure.code}" not found in mapping.`);
            return;
        }

        const existingEntry = this.expenditures.find(e => e.code === newExpenditure.code);
        if (existingEntry) {
            existingEntry.expenditure += newExpenditure.expenditure;
            this.updateCategoryResults(newExpenditure.code, newExpenditure.expenditure);
        } else {
            this.expenditures.push(newExpenditure);
            this.updateCategoryResults(newExpenditure.code, newExpenditure.expenditure);
        }
    }

    protected updateCategoryResults(procurementCode: string, delta: number): void {
        const category = this.procurementData.categoryMap[procurementCode] || "Unknown";
        if (!this.categoryResults[category]) {
            this.categoryResults[category] = { expenditure: 0, emissions: 0 };
        }

        const defraMappings = this.procurementData.procurementDefra[procurementCode] || [];
        defraMappings.forEach(({ defra, proportion }) => {
            const defraEmissionFactor = this.procurementData.defraEmissions[defra] || 0;
            const allocatedExpenditure = delta * proportion;

            this.categoryResults[category].expenditure += allocatedExpenditure;
            this.categoryResults[category].emissions += CarbonCalculator.procurementEmissions(allocatedExpenditure, defraEmissionFactor);
        });
    }

    public getExpenditures(): calculatorInterface.procurement[] {
        return this.expenditures.filter(e => e.expenditure > 0);
    }

    public addExpenditures(transactions: calculatorInterface.procurement[]): void {
        transactions.forEach(transaction => this.addExpenditure(transaction));
    }

    public resetExpenditures(): void {
        this.expenditures = [];
        this.categoryResults = {};
    }

    public getCategoryExpendituresAndEmissions(): { [category: string]: { expenditure: number; emissions: number } } {
        return this.categoryResults;
    }

    public getTotalProcurementEmissions(): number {
        return Object.values(this.categoryResults).reduce((sum, { emissions }) => sum + emissions, 0);
    }

    public exportState(): { procurement: calculatorInterface.procurement[]; emissionsData: { [category: string]: { expenditure: number; emissions: number } }; } {
        return { procurement: this.expenditures, emissionsData: this.categoryResults};

    }   
    
    public loadState(state: calculatorInterface.calculatorState): void {
        this.expenditures = state.procurements;
        this.categoryResults = state.categoryResults;
    }
    
}