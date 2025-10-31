/**
 * The calculator interface defines the minimum parameters and methods required to produce results for greenhouse gas projections.
 */
export interface calculator{

    setStaff(proprtoion: number): void;

    setDiscipline(discipline: discipline): void;

    setType(type: type): void;
    
}

enum carbonIntensityFactors {
    ELECTRICITY_GRID = 0.212,
    ELECTRICITY_TRANSMISSION = 0.019,
    GAS_SUPPLY = 0.183,
    GAS_DISTRIBUTION = 0.0188,
    WATER_CONSUMPTION = 0.149,
    WATER_TREATMENT = 0.272
}

export interface travel {
    distancekm: number,
    emissions: travelEmissions
}

export interface waste {
    tonnes: number,
    type: wasteType
}

export enum type {
    LABORATORY,
    ACADEMIC,
    ADMIN
}

export enum discipline {
    PHYSICAL,
    MEDICAL_LIFE,
    ENGINEERING,
    ADMIN
}

export interface Iroom {
    area: number,
    type: type,
    discipline: discipline
}

enum electricityBenchmark {
    LABORATORY = 207.99,
    ACADEMIC = 108.47,
    ADMIN = 115.17
}

enum gasBenchmark {
    LABORATORY = 247.39,
    ACADEMIC = 170.85,
    ADMIN = 180.41
}

enum waterBenchmark {
    PHYSICAL = 1.7,
    MEDICAL_LIFE = 1.4,
    ENGINEERING = 1.7,
    ADMIN = 1
}

enum travelEmissions {
    AIR_ECONOMY_SHORT_UK = 0.151,
    AIR_BUSINESS_SHORT_UK = 0.227,
    AIR_ECONOMY_LONG_UK = 0.148,
    AIR_BUSINESS_LONG_UK = 0.429,
    AIR_ECONOMY_INTERNATIONAL = 0.141,
    AIR_BUSINESS_INTERNATIONAL = 0.408,
    SEA_FERRY = 0.113,
    LAND_CAR = 0.168,
    LAND_MOTORBIKE = 0.114,
    LAND_TAXI = 0.149,
    LAND_LOCAL_BUS = 0.102,
    LAND_COACH = 0.027,
    LAND_NATIONAL_RAIL = 0.035,
    LAND_INTERNATIONAL_RAIL = 0.004,
    LAND_LIGHT_RAIL = 0.029
}

enum wasteType {
    MIXED_RECYCLING = 21.294,
    GENERAL = 446.242,
    CLINICAL = 297,
    CHEMICAL = 273,
    BIOLOGICAL = 1000,
    WEEE_MIXED_RECYC = 21.294
}

/**
 * The room class is a class that implements the 2021 excel sheet for greenhouse gas reporting projections.
 */
export class room implements calculator {
    protected staff : number = 0;
    protected area : number;
    protected type : type;
    protected discipline : discipline;
    protected transport: travel[] = [];
    protected waste: waste[] = [];

    constructor(room: Iroom) {
        this.area = room.area;
        this.type = room.type;
        this.discipline = room.discipline;
    }

    public setArea(area: number) {
        this.area = area;
    }

    public setStaff(proportion: number) {
        this.staff = proportion;
    }

    public setType(type: type) {
        this.type = type;
    }

    public setDiscipline (discipline: discipline) {
        this.discipline = discipline;
    }

    public getElectricityConsumption(): number {
        let benchmark = electricityBenchmark[type[this.type]];
        return this.staff*this.area*benchmark;
    }

    public getElectricityEmissions() : number {
        let intensity = carbonIntensityFactors.ELECTRICITY_GRID + carbonIntensityFactors.ELECTRICITY_TRANSMISSION;
        return this.getElectricityConsumption()*intensity;
    }

    public getGasConsumption() : number {
        let benchmark = gasBenchmark[type[this.type]];
        return this.staff*this.area*benchmark;
    }

    public getGasEmissions() : number {
        let intensity = carbonIntensityFactors.GAS_DISTRIBUTION + carbonIntensityFactors.GAS_SUPPLY;
        return this.getGasConsumption()*intensity;
    }

    public getWaterConsumption() : number {
        let benchmark = waterBenchmark[discipline[this.discipline]];
        return this.staff*this.area*benchmark;
    }

    public getWaterEmissions() : number {
        let intensity = carbonIntensityFactors.WATER_CONSUMPTION + carbonIntensityFactors.WATER_TREATMENT;
        return this.getWaterConsumption()*intensity;
    }

    public addTransport(travel : travel) {
        this.transport.push(travel);
    }

    public getTravelEmissions() : number {
        let sum = 0;
        for (let i = 0; i < this.transport.length; i++) {
            sum += this.transport[i].distancekm*this.transport[i].emissions;
        }
        return sum;
    }

    public addWaste(waste: waste) {
        this.waste.push(waste);
    }

    public getWasteEmissions() : number {
        let sum = 0;
        for (let i = 0; i < this.waste.length; i++) {
            sum += this.waste[i].tonnes*this.waste[i].type;
        }
        return sum;
    }

    public getResult() : number{
        let result = 0;
        result += this.getElectricityEmissions();
        result += this.getGasEmissions();
        result += this.getWaterEmissions();
        result += this.getTravelEmissions();
        result += this.getWasteEmissions();
        return result;
    }

}

let engineeringRoom = new room(<Iroom>{area: 20,type: type.LABORATORY, discipline: discipline.ENGINEERING});
engineeringRoom.setStaff(2);
engineeringRoom.addTransport( <travel>{distancekm: 100, emissions: travelEmissions.LAND_MOTORBIKE});
engineeringRoom.addWaste( <waste>{tonnes: 1, type: wasteType.GENERAL});

console.log(engineeringRoom.getElectricityEmissions());
console.log(engineeringRoom.getGasEmissions());
console.log(engineeringRoom.getWaterEmissions());
console.log(engineeringRoom.getTravelEmissions());
console.log(engineeringRoom.getWasteEmissions());
console.log(engineeringRoom.getResult());
