import { Project } from "./Project";
import { AreaFactory } from "./Spaces";
import { BenchmarkFactory } from "./Benchmark";
import { FactorFactory } from "./CarbonIntensity";

//Intensity Factors
let ELECTRICITY_GRID = FactorFactory.createFactor("Electrical Grid", 0.212);
let ELECTRICITY_TRANSMISSION = FactorFactory.createFactor("Electrical Transmission", 0.019);
let ELECTRICITY = FactorFactory.sumFactors("Electrical Intensity Factor", [ELECTRICITY_GRID, ELECTRICITY_TRANSMISSION]);

let GAS_SUPPLY = FactorFactory.createFactor("Gas Supply", 0.183);
let GAS_DISTRIBUTION = FactorFactory.createFactor("Gas Distribution", 0.0188);
let GAS = FactorFactory.sumFactors("Gas Intensity Factor", [GAS_SUPPLY, GAS_DISTRIBUTION]);

let WATER_CONSUMPTION = FactorFactory.createFactor("Water Supply", 0.149);
let WATER_TREATMENT = FactorFactory.createFactor("Water Treatment", 0.272);
let WATER = FactorFactory.sumFactors("Water Intensity Factor", [WATER_CONSUMPTION, WATER_TREATMENT]);

let CAR = FactorFactory.createFactor("Car Emissions", 0.168);
let MOTORBIKE = FactorFactory.createFactor("Motorbike Emissions", 0.114);
let TAXI = FactorFactory.createFactor("Taxi Emissions", 0.149);
let BUS = FactorFactory.createFactor("Bus Emissions", 0.102);

let GENERAL = FactorFactory.createFactor("Recycled Waste Emissions", 21.294);
let RECYCLING = FactorFactory.createFactor("General Waste Emissions", 446.242);


//Benchmarks
let ENGINEERING_LAB_WATER = BenchmarkFactory.createBenchmark("Engineering laboratory Water Consumption", 1.7);
let ENGINEERING_LAB_GAS = BenchmarkFactory.createBenchmark("Engineering laboratory Gas Consumption", 247.39);
let ENGINEERING_LAB_ELECTRICITY = BenchmarkFactory.createBenchmark("Engineering laboratory Electricity Consumption", 207.99);


let calc = new Project();
calc.setStaff(2);

let engineeringLaboratory = AreaFactory.createArea("Engineering lab", 20,ENGINEERING_LAB_ELECTRICITY, ENGINEERING_LAB_GAS, ENGINEERING_LAB_WATER, ELECTRICITY, GAS, WATER);
calc.setArea(engineeringLaboratory);

console.log(calc);
console.log(calc.getCarbonEmissions());

/* Calculator {
    STAFF_PROPORTION: 2,
    AREA: Map(1) {
      'Engineering lab' => Area {
        label: 'Engineering lab',
        area: 20,
        electricityFactor: [ResourceFactor],
        gasFactor: [ResourceFactor],
        waterFactor: [ResourceFactor],
        electricity: [Benchmark],
        gas: [Benchmark],
        water: [Benchmark]
      }
    },
    TRANSPORT: Map(0) {},
    WASTE: Map(0) {}
  }
  3947.38768 */