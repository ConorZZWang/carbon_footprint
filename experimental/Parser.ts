import * as XLSX from 'xlsx';
import {FactorFactory, BenchmarkFactory, procurementCode} from './CalculatorADT';
import {IProcurementCode, IBenchmark, ICarbonIntensityFactor, IProcurementFactor } from './CalculatorInterfaces';

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

    static parseProcurementFactors(): IProcurementFactor[] {
        const index: number[] = XLSX.utils.sheet_to_json(this.DEFRA_SHEET, { range: 'A3:A314', header: 1 }).flat().map(Number);
        const product: string[] = XLSX.utils.sheet_to_json(this.DEFRA_SHEET, { range: 'B3:B314', header: 1 }).flat().map(String);
        const procurement_GHG: number[] = XLSX.utils.sheet_to_json(this.DEFRA_SHEET, { range: 'C3:C314', header: 1 }).flat().map(Number);
       
        let procurementFactors: IProcurementFactor[] = [];
        for (let i = 0; i < index.length; i++) {
            procurementFactors.push(FactorFactory.procurementFactor(product[i], index[i], procurement_GHG[i], this.DEFRA_DATA_DATE));
        }

        return procurementFactors;
    }

    static parseTransportFactors(): ICarbonIntensityFactor[] {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A8:A22', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B8:B22', header: 1 }).flat().map(Number);
        
        let conversionFactors: ICarbonIntensityFactor[] = [];
        for (let i = 0; i < labels.length; i++) {
            conversionFactors.push(FactorFactory.createFactor(labels[i], activity_GHG[i], this.CONV_FACTORS_DATE));
        }

        return conversionFactors;
    }

    static parseWasteFactors(): ICarbonIntensityFactor[] {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A23:A28', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B23:B28', header: 1 }).flat().map(Number);
        
        let conversionFactors: ICarbonIntensityFactor[] = [];
        for (let i = 0; i < labels.length; i++) {
            conversionFactors.push(FactorFactory.createFactor(labels[i], activity_GHG[i], this.CONV_FACTORS_DATE));
        }

        return conversionFactors;
    }

    static parseElectricityFactor(): ICarbonIntensityFactor {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A3:A4', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B3:B4', header: 1 }).flat().map(Number);

        let factors: ICarbonIntensityFactor[] = [];
        factors.push(FactorFactory.createFactor(labels[0], activity_GHG[0], this.CONV_FACTORS_DATE));
        factors.push(FactorFactory.createFactor(labels[1], activity_GHG[1], this.CONV_FACTORS_DATE));

        const electricityFactor: ICarbonIntensityFactor = FactorFactory.sumFactors("Electrical Intensity Factor", factors, this.CONV_FACTORS_DATE);

        return electricityFactor;
    }

    static parseGasFactor(): ICarbonIntensityFactor {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A4:A5', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B4:B5', header: 1 }).flat().map(Number);

        let factors: ICarbonIntensityFactor[] = [];
        factors.push(FactorFactory.createFactor(labels[0], activity_GHG[0], this.CONV_FACTORS_DATE));
        factors.push(FactorFactory.createFactor(labels[1], activity_GHG[1], this.CONV_FACTORS_DATE));

        const gasFactor: ICarbonIntensityFactor = FactorFactory.sumFactors("Gas Intensity Factor", factors, this.CONV_FACTORS_DATE);

        return gasFactor;
    }

    static parseWaterFactor(): ICarbonIntensityFactor {
        const labels: string[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A6:A7', header: 1 }).flat().map(String);
        const activity_GHG: number[] = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B6:B7', header: 1 }).flat().map(Number);

        let factors: ICarbonIntensityFactor[] = [];
        factors.push(FactorFactory.createFactor(labels[0], activity_GHG[0], this.CONV_FACTORS_DATE));
        factors.push(FactorFactory.createFactor(labels[1], activity_GHG[1], this.CONV_FACTORS_DATE));

        const waterFactor: ICarbonIntensityFactor = FactorFactory.sumFactors("Water Intensity Factor", factors, this.CONV_FACTORS_DATE);

        return waterFactor;
    }

    static parseElectricityBenchmarks(): IBenchmark.benchmark[] {
        const laboratory: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B14', header: 1 })[0]) || 0;
        const academic_office: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B16', header: 1 })[0]) || 0;
        const admin_office: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B18', header: 1 })[0]) || 0;

        let benchmarks: IBenchmark.benchmark[] = [];
        benchmarks.push(BenchmarkFactory.createBenchmark("Physical sciences laboratory electricity benchmark", laboratory, IBenchmark.type.PHYSICAL_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Medical/Life sciences laboratory electricity benchmark", laboratory, IBenchmark.type.MEDICAL_LIFE_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Engineering sciences laboratory electricity benchmark", laboratory, IBenchmark.type.ENGINEERING_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Academic office electricity benchmark", academic_office, IBenchmark.type.ACADEMIC_OFFICE, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Admin office electricity benchmark", admin_office, IBenchmark.type.ADMIN_OFFICE, this.BENCH_DATA_DATE));

        return benchmarks;
    }

    static parseGasBenchmarks(): IBenchmark.benchmark[] {
        const laboratory: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B15', header: 1 })[0]) || 0;
        const academic_office: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B17', header: 1 })[0]) || 0;
        const admin_office: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B19', header: 1 })[0]) || 0;

        let benchmarks: IBenchmark.benchmark[] = [];
        benchmarks.push(BenchmarkFactory.createBenchmark("Physical sciences laboratory gas benchmark", laboratory, IBenchmark.type.PHYSICAL_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Medical/Life sciences laboratory gas benchmark", laboratory, IBenchmark.type.MEDICAL_LIFE_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Engineering sciences laboratory gas benchmark", laboratory, IBenchmark.type.ENGINEERING_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Academic office gas benchmark", academic_office, IBenchmark.type.ACADEMIC_OFFICE, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Admin office gas benchmark", admin_office, IBenchmark.type.ADMIN_OFFICE, this.BENCH_DATA_DATE));

        return benchmarks;
    }

    static parseWaterBenchmarks(): IBenchmark.benchmark[] {
        const physical_lab: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B31', header: 1 })[0]) || 0;
        const medical_lab: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B32', header: 1 })[0]) || 0;
        const engineering_lab: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B33', header: 1 })[0]) || 0;
        const office_admin: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B34', header: 1 })[0]) || 0;

        let benchmarks: IBenchmark.benchmark[] = [];
        benchmarks.push(BenchmarkFactory.createBenchmark("Physical sciences laboratory water benchmark", physical_lab, IBenchmark.type.PHYSICAL_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Medical/Life sciences laboratory water benchmark", medical_lab, IBenchmark.type.MEDICAL_LIFE_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Engineering sciences laboratory water benchmark", engineering_lab, IBenchmark.type.ENGINEERING_LAB, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Academic office water benchmark", office_admin, IBenchmark.type.ACADEMIC_OFFICE, this.BENCH_DATA_DATE));
        benchmarks.push(BenchmarkFactory.createBenchmark("Admin office water benchmark", office_admin, IBenchmark.type.ADMIN_OFFICE, this.BENCH_DATA_DATE));

        return benchmarks;
    }

    static parseElectricityMultiplier(): number {
        const totalElectricity: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B8', header: 1 })[0]) || 0;
        const averageElectricity: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B12', header: 1 })[0]) || 0;

        return (totalElectricity/averageElectricity);
    }

    static parseGasMultiplier(): number {
        const totalGas: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B9', header: 1 })[0]) || 0;
        const averageGas: number = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B13', header: 1 })[0]) || 0;

        return (totalGas/averageGas);
    }

    static parseProcurementCodes() : IProcurementCode[]  {
        const code: string[] = XLSX.utils.sheet_to_json(this.HE311_CONCORD_SHEET, { range: 'A4:A432', header: 1 }).flat().map(String);
        const description: string[] = XLSX.utils.sheet_to_json(this.HE311_CONCORD_SHEET, { range: 'B4:B432', header: 1 }).flat().map(String);

        let procurementCodes: IProcurementCode[] = [];
        for (let i = 0; i < code.length; i++) {
            procurementCodes.push(new procurementCode(code[i], description[i]));
        }

        return procurementCodes;
    }
}

console.log(Parser.parseProcurementFactors());
console.log(Parser.parseTransportFactors());
console.log(Parser.parseWasteFactors());
console.log(Parser.parseElectricityFactor());
console.log(Parser.parseGasFactor());
console.log(Parser.parseWaterFactor());
console.log(Parser.parseElectricityBenchmarks());
console.log(Parser.parseGasBenchmarks());
console.log(Parser.parseWaterBenchmarks());
console.log(Parser.parseGasMultiplier());
console.log(Parser.parseElectricityMultiplier());
console.log(Parser.parseProcurementCodes());