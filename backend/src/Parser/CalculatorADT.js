"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmarkMap = void 0;
var benchmarkMap;
(function (benchmarkMap) {
    var benchmarkType;
    (function (benchmarkType) {
        benchmarkType[benchmarkType["PHYSICAL_LAB"] = 0] = "PHYSICAL_LAB";
        benchmarkType[benchmarkType["MEDICAL_LIFE_LAB"] = 1] = "MEDICAL_LIFE_LAB";
        benchmarkType[benchmarkType["ENGINEERING_LAB"] = 2] = "ENGINEERING_LAB";
        benchmarkType[benchmarkType["ACADEMIC_OFFICE"] = 3] = "ACADEMIC_OFFICE";
        benchmarkType[benchmarkType["ADMIN_OFFICE"] = 4] = "ADMIN_OFFICE";
    })(benchmarkType = benchmarkMap.benchmarkType || (benchmarkMap.benchmarkType = {}));
    ;
    var resource;
    (function (resource) {
        resource[resource["ELECTRICITY"] = 0] = "ELECTRICITY";
        resource[resource["GAS"] = 1] = "GAS";
        resource[resource["WATER"] = 2] = "WATER";
    })(resource = benchmarkMap.resource || (benchmarkMap.resource = {}));
})(benchmarkMap || (exports.benchmarkMap = benchmarkMap = {}));
