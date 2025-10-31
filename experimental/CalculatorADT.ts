import { ICarbonIntensityFactor, IProcurementFactor } from "./CalculatorInterfaces";
import {IBenchmark } from "./CalculatorInterfaces";
import { IProcurementCode } from "./CalculatorInterfaces";

/**
 * CarbonIntensityFactor is an abstract class to implement a factory design pattern for instantiating objects representing carbon intensity factors
 * and accessing relevant attributes.
 * 
 * It's an immutable class with protected variables to prevent other classes except child classes from modifying its internal logic or variables.
 */
abstract class CarbonIntensityFactor implements ICarbonIntensityFactor {
    protected factor: number = 0;
    protected label: string = "";
    protected date: Date;

    constructor(label: string, factor: number);
    constructor(label: string, factor: number, date: Date);
    constructor(label: string, factor: number, date?: Date) {
        this.factor = factor;
        this.label = label;
        this.date = date ?? new Date();
    }

    public getFactor(): number {
        return this.factor;
    }

    public getLabel(): string {
        return this.label;
    }
    
    public getDate() : Date {
        return this.date;
    }

}

/**
 * The Factor class is the most basic form of the CarbonIntensityFactor implementation. It stores a label, factor and optional date.
 */
class Factor extends CarbonIntensityFactor {

    constructor(label: string, factor: number);
    constructor(label: string, factor: number, date: Date);
    constructor(label: string, factor: number, date?: Date) {
        if(date==undefined) {
            super(label, factor);
        } else {
            super(label, factor, date);
        }
    }

}

/**
 * The ResourceFactor class is based on intensity factors that are composites of multiple factors.
 * 
 * For example, electricity grid transmission and production are separate factors but must be combined for a single factor for electricity.
 */
class ResourceFactor extends CarbonIntensityFactor {

    constructor(label: string, factors: ICarbonIntensityFactor[]);
    constructor(label: string, factors: ICarbonIntensityFactor[], date: Date);
    constructor(label: string, factors: ICarbonIntensityFactor[], date?: Date) {
        let sum = 0;
        factors.forEach((element) => {
            sum+=element.getFactor();
        });

        if(date==undefined) {
            super(label, sum);
        } else {
            super(label, sum, date);
        }
    }

}

/**
 * The ProcurementFactor class is based on intensity factors that are based on monetary expenditure differentiated by procurement codes.
 * 
 * These factors can be aggregated based on user defined pools. For example "IT Equipment" may be composed of multiple codes. This is
 * different from the ResourceFactor class which is cumulative.
 */
class ProcurementFactor extends CarbonIntensityFactor implements IProcurementFactor {
    protected index: number;

    constructor(label: string, index: number, factor: number);
    constructor(label: string, index: number, factor: number, date: Date);
    constructor(label: string, index: number, factor: number, date?: Date)  {
        if(date==undefined) {
            super(label, factor);
        } else {
            super(label, factor, date);
        }
         this.index = index;
    }

    public getIndex(): number {
        return this.index;
    }

}

/**
 * The FactorFactory class is an abstract class to provide static methodology for creating CarbonIntensityFactor objects.
 * 
 * These objects are returned as interfaces so that the internal logic is never exposed to the classes that utilise them.
 */
export abstract class FactorFactory {

    static createFactor(label: string, factor: number, date: Date = new Date()): ICarbonIntensityFactor {
        return new Factor(label, factor, date) as ICarbonIntensityFactor;
    }

    static sumFactors(label: string, factors: ICarbonIntensityFactor[], date: Date = new Date()): ICarbonIntensityFactor {
        return new ResourceFactor(label, factors, date) as ICarbonIntensityFactor;
    }

    static procurementFactor(label: string, index: number, factor: number, date: Date = new Date()): IProcurementFactor {
        return new ProcurementFactor(label, index, factor, date) as IProcurementFactor;
    }
}

class Benchmark implements IBenchmark.benchmark {
    protected benchmark: number = 0;
    protected label: string = "";
    protected date: Date;
    protected type: IBenchmark.type;

    constructor(label: string, benchmark: number, type: IBenchmark.type);
    constructor(label: string, benchmark: number, type: IBenchmark.type, date: Date);
    constructor(label: string, benchmark: number, type: IBenchmark.type, date?: Date) {
        this.benchmark = benchmark;
        this.label = label;
        this.type = type;
        this.date = date ?? new Date();
    }

    public getBenchmark(): number {
        return this.benchmark;
    }

    public getLabel(): string {
        return this.label;
    }
    
    public getDate() : Date {
        return this.date;
    }

    public getType() : IBenchmark.type {
        return this.type;
    }

}

export abstract class BenchmarkFactory {

    static createBenchmark(label: string, benchmark: number, type: IBenchmark.type, date: Date = new Date()): IBenchmark.benchmark {
        return new Benchmark(label, benchmark, type, date) as IBenchmark.benchmark;
    }
}

export class procurementCode implements IProcurementCode {
    protected code: string;
    protected description: string;

    constructor(code: string, description: string) {
        this.code = code;
        this.description = description;
    }

    public getCode() : string {
        return this.code;
    }

    public getDescription(): string {
        return this.description;
    }
    
}