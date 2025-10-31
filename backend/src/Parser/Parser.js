"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var XLSX = require("xlsx");
var CalculatorADT_js_1 = require("./CalculatorADT.js");
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.parseTransportFactors = function () {
        var _this = this;
        var labels = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A8:A22', header: 1 }).flat().map(String);
        var activity_GHG = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B8:B22', header: 1 }).flat().map(Number);
        return labels.map(function (label, i) { return ({
            label: label,
            factor: activity_GHG[i] || 0,
            date: _this.CONV_FACTORS_DATE
        }); });
    };
    Parser.parseWasteFactors = function () {
        var _this = this;
        var labels = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A23:A28', header: 1 }).flat().map(String);
        var activity_GHG = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B23:B28', header: 1 }).flat().map(Number);
        return labels.map(function (label, i) { return ({
            label: label,
            factor: activity_GHG[i] || 0,
            date: _this.CONV_FACTORS_DATE
        }); });
    };
    Parser.parseElectricityFactor = function () {
        var labels = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A3:A4', header: 1 }).flat().map(String);
        var activity_GHG = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B3:B4', header: 1 }).flat().map(Number);
        var totalFactor = activity_GHG.reduce(function (sum, value) { return sum + (value || 0); }, 0);
        return {
            label: "Electrical Intensity Factor",
            factor: totalFactor,
            date: this.CONV_FACTORS_DATE
        };
    };
    Parser.parseGasFactor = function () {
        var labels = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A4:A5', header: 1 }).flat().map(String);
        var activity_GHG = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B4:B5', header: 1 }).flat().map(Number);
        var totalFactor = activity_GHG.reduce(function (sum, value) { return sum + (value || 0); }, 0);
        return {
            label: "Gas Intensity Factor",
            factor: totalFactor,
            date: this.CONV_FACTORS_DATE
        };
    };
    Parser.parseWaterFactor = function () {
        var labels = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'A6:A7', header: 1 }).flat().map(String);
        var activity_GHG = XLSX.utils.sheet_to_json(this.CONV_FACTORS_SHEET, { range: 'B6:B7', header: 1 }).flat().map(Number);
        var totalFactor = activity_GHG.reduce(function (sum, value) { return sum + (value || 0); }, 0);
        return {
            label: "Water Intensity Factor",
            factor: totalFactor,
            date: this.CONV_FACTORS_DATE
        };
    };
    Parser.parseElectricityMultiplier = function () {
        var totalElectricity = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B8', header: 1 })[0]) || 0;
        var averageElectricity = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B12', header: 1 })[0]) || 0;
        var multiplier = { resource: CalculatorADT_js_1.benchmarkMap.resource.ELECTRICITY, multiplier: totalElectricity / averageElectricity };
        return multiplier;
    };
    Parser.parseGasMultiplier = function () {
        var totalGas = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B9', header: 1 })[0]) || 0;
        var averageGas = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B13', header: 1 })[0]) || 0;
        var multiplier = { resource: CalculatorADT_js_1.benchmarkMap.resource.GAS, multiplier: totalGas / averageGas };
        return multiplier;
    };
    Parser.parseProcurementData = function () {
        // Extract procurement codes (A4:A432)
        var procurementCodes = XLSX.utils
            .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "A4:A432", header: 1 })
            .flat()
            .map(String);
        // Extract procurement descriptions (B4:B432)
        var descriptions = XLSX.utils
            .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "B4:B432", header: 1 })
            .flat()
            .map(String);
        // Extract super categories (D4:D432)
        var superCategories = XLSX.utils
            .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "D4:D432", header: 1 })
            .flat()
            .map(String);
        // Extract DEFRA categories (E2:LD2)
        var defraCategories = XLSX.utils
            .sheet_to_json(this.HE311_CONCORD_SHEET, { range: "E2:LD2", header: 1 })
            .flat()
            .map(String);
        // Extract proportion mappings (E4:LD432)
        var rawProportions = XLSX.utils.sheet_to_json(this.HE311_CONCORD_SHEET, { range: "E4:LD432", header: 1 });
        // Transform into the `procurementMap.ProcurementDefra` structure
        var procurementDefra = {};
        var procurementDescriptions = {};
        procurementCodes.forEach(function (code, index) {
            procurementDefra[code] = defraCategories
                .map(function (defra, colIndex) {
                var _b;
                var value = (_b = rawProportions[index]) === null || _b === void 0 ? void 0 : _b[colIndex]; // Get raw cell value
                return {
                    defra: defra,
                    proportion: value !== undefined && value !== "" ? Number(value) : 0, // Ensure number, default to 0
                };
            })
                .filter(function (entry) { return entry.proportion > 0; }); // Keep only meaningful proportions
            procurementDescriptions[code] = descriptions[index];
        });
        // Extract DEFRA emissions
        var defraNames = XLSX.utils
            .sheet_to_json(this.DEFRA_SHEET, { range: "B3:B314", header: 1 })
            .flat()
            .map(String);
        var defraEmissionValues = XLSX.utils
            .sheet_to_json(this.DEFRA_SHEET, { range: "K3:K314", header: 1 })
            .flat()
            .map(Number);
        // Transform into the `procurementMap.DefraEmissions` structure
        var defraEmissions = {};
        defraNames.forEach(function (name, index) {
            defraEmissions[name] = defraEmissionValues[index] || 0; // Default to 0 if missing
        });
        // Transform into the `procurementMap.CategoryMap` structure
        var categoryMap = {};
        procurementCodes.forEach(function (code, index) {
            categoryMap[code] = superCategories[index] || "Unknown"; // Default to "Unknown" if missing
        });
        return { procurementDescriptions: procurementDescriptions, procurementDefra: procurementDefra, categoryMap: categoryMap, defraEmissions: defraEmissions };
    };
    Parser.parseAllBenchmarks = function () {
        var _b, _c, _d, _e;
        // Extract Electricity Benchmarks
        var electricityValues = (_b = {},
            _b[CalculatorADT_js_1.benchmarkMap.benchmarkType.PHYSICAL_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B14', header: 1 })[0]) || 0,
            _b[CalculatorADT_js_1.benchmarkMap.benchmarkType.MEDICAL_LIFE_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B14', header: 1 })[0]) || 0,
            _b[CalculatorADT_js_1.benchmarkMap.benchmarkType.ENGINEERING_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B14', header: 1 })[0]) || 0,
            _b[CalculatorADT_js_1.benchmarkMap.benchmarkType.ACADEMIC_OFFICE] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B16', header: 1 })[0]) || 0,
            _b[CalculatorADT_js_1.benchmarkMap.benchmarkType.ADMIN_OFFICE] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B18', header: 1 })[0]) || 0,
            _b);
        // Extract Gas Benchmarks
        var gasValues = (_c = {},
            _c[CalculatorADT_js_1.benchmarkMap.benchmarkType.PHYSICAL_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B15', header: 1 })[0]) || 0,
            _c[CalculatorADT_js_1.benchmarkMap.benchmarkType.MEDICAL_LIFE_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B15', header: 1 })[0]) || 0,
            _c[CalculatorADT_js_1.benchmarkMap.benchmarkType.ENGINEERING_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B15', header: 1 })[0]) || 0,
            _c[CalculatorADT_js_1.benchmarkMap.benchmarkType.ACADEMIC_OFFICE] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B17', header: 1 })[0]) || 0,
            _c[CalculatorADT_js_1.benchmarkMap.benchmarkType.ADMIN_OFFICE] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B19', header: 1 })[0]) || 0,
            _c);
        // Extract Water Benchmarks
        var waterValues = (_d = {},
            _d[CalculatorADT_js_1.benchmarkMap.benchmarkType.PHYSICAL_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B31', header: 1 })[0]) || 0,
            _d[CalculatorADT_js_1.benchmarkMap.benchmarkType.MEDICAL_LIFE_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B32', header: 1 })[0]) || 0,
            _d[CalculatorADT_js_1.benchmarkMap.benchmarkType.ENGINEERING_LAB] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B33', header: 1 })[0]) || 0,
            _d[CalculatorADT_js_1.benchmarkMap.benchmarkType.ACADEMIC_OFFICE] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B34', header: 1 })[0]) || 0,
            _d[CalculatorADT_js_1.benchmarkMap.benchmarkType.ADMIN_OFFICE] = Number(XLSX.utils.sheet_to_json(this.BENCH_DATA_SHEET, { range: 'B34', header: 1 })[0]) || 0,
            _d);
        // Create benchmark map
        var benchmarkData = {};
        var date = this.BENCH_DATA_DATE;
        // Populate the benchmark map
        for (var _i = 0, _f = Object.values(CalculatorADT_js_1.benchmarkMap.benchmarkType).filter(function (v) { return typeof v === "number"; }); _i < _f.length; _i++) {
            var type = _f[_i];
            benchmarkData[type] = (_e = {},
                _e[CalculatorADT_js_1.benchmarkMap.resource.ELECTRICITY] = { value: electricityValues[type], date: date },
                _e[CalculatorADT_js_1.benchmarkMap.resource.GAS] = { value: gasValues[type], date: date },
                _e[CalculatorADT_js_1.benchmarkMap.resource.WATER] = { value: waterValues[type], date: date },
                _e);
        }
        return benchmarkData;
    };
    Parser.parseAllCalculatorData = function () {
        var gasIntensityFactor = this.parseGasFactor();
        var electricityIntensityFactor = this.parseElectricityFactor();
        var waterIntensityFactor = this.parseWaterFactor();
        var wasteFactors = this.parseWasteFactors();
        var transportFactors = this.parseTransportFactors();
        var benchmarks = this.parseAllBenchmarks();
        var gasMult = this.parseGasMultiplier();
        var electricityMult = this.parseElectricityMultiplier();
        var procurementdata = this.parseProcurementData();
        return {
            gasIntensityFactor: gasIntensityFactor,
            electricityIntensityFactor: electricityIntensityFactor,
            waterIntensityFactor: waterIntensityFactor,
            wasteFactors: wasteFactors,
            transportFactors: transportFactors,
            benchmarks: benchmarks,
            gasMult: gasMult,
            electricityMult: electricityMult,
            procurementData: procurementdata
        };
    };
    var _a;
    _a = Parser;
    // EXCEL Workbook filepath
    Parser.workbook = XLSX.readFile('The_Current_App_2024.xlsx');
    // Procurement factor work sheet
    Parser.DEFRA = 'DEFRA Categories';
    Parser.DEFRA_SHEET = _a.workbook.Sheets[_a.DEFRA];
    Parser.DEFRA_DATA_DATE = new Date("2011-01-01");
    //Conversion Factor work sheet
    Parser.CONV_FACTORS = 'Conversion Factors';
    Parser.CONV_FACTORS_SHEET = _a.workbook.Sheets[_a.CONV_FACTORS];
    Parser.CONV_FACTORS_DATE = new Date("2021-01-01");
    //Benchmark Data work sheet
    Parser.BENCH_DATA = 'Benchmark Data';
    Parser.BENCH_DATA_SHEET = _a.workbook.Sheets[_a.BENCH_DATA];
    Parser.BENCH_DATA_DATE = new Date("2024-01-01");
    //HE 311 Concord work sheet
    Parser.HE311_CONCORD = 'HE 311 Concord';
    Parser.HE311_CONCORD_SHEET = _a.workbook.Sheets[_a.HE311_CONCORD];
    Parser.HE311_CONCORD_DATE = new Date("2024-01-01");
    return Parser;
}());
exports.Parser = Parser;
