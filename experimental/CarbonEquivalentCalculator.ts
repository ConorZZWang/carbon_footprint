/**
 * CarbonCalculator is an abstract class to provide static functions for evaluating carbon emissions based
 * on provided parameters.
 * 
 * It includes some utility functions for calculating parameters such as consumption necessary for the carbon emissions calculations.
 */
export abstract class CarbonCalculator {

    /**
    * A utility function for estimating electricity consumption based on proportion of staff,
    * area used and an electricity benchmark.
    *
    * @param {number} staff  - Proportion of staff (total FTE group members / number of FTE staff working on project)
    * @param {number} area  - Area of space of used in metres squred (m^2)
    * @param {number} benchmark  - Benchmark of electricity consumption per annum (kWh/m^2)
    * @returns {number} - Estimated electricity Consumption (kWh)
    */
    public static electricityConsumption(staff: number, area: number, benchmark: number) : number {
        return staff*area*benchmark;
    }

    /**
    * A function for estimating carbon emissions based on electricity consumption and a carbon intensity factor.
    *
    * @param {number} electricityConsumption  - Estimated electricity Consumption (kWh)
    * @param {number} carbonIntensity  - Carbon intensity factor for electric grid, transmission and distribution (kgCO2 / kWh)
    * @returns {number} - Carbon equivalent emissions in kg (kgCO2)
    */
    public static electricityEmissions(electricityConsumption: number, carbonIntensity: number) : number {
        return electricityConsumption * carbonIntensity;
    }

    /**
    * A utility function for estimating gas consumption based on proportion of staff,
    * area used and a gas consumption benchmark.
    *
    * @param {number} staff  - Proportion of staff (total FTE group members / number of FTE staff working on project)
    * @param {number} area  - Area of space of used in metres squred (m^2)
    * @param {number} benchmark  - Benchmark of gas consumption per annum (kWh/m^2)
    * @returns {number} - Estimated gas consumption (kWh)
    */
    public static gasConsumption(staff: number, area: number, benchmark: number) : number {
        return staff*area*benchmark;
    }

    /**
    * A function for estimating carbon emissions based on gas consumptions and a carbon intensity factor.
    *
    * @param {number} gasConsumption  - Estimated gas Consumption (kWh)
    * @param {number} carbonIntensity  - Carbon intensity factor for gas, transmission and distribution (kgCO2 / kWh)
    * @returns {number} - Carbon equivalent emissions in kg (kgCO2)
    */
    public static gasEmissions(gasConsumption: number, carbonIntensity: number) : number {
        return gasConsumption * carbonIntensity;
    }

    /**
    * A utility function for estimating water consumption based on proportion of staff,
    * area used and a water consumption benchmark.
    *
    * @param {number} staff  - Proportion of staff (total FTE group members / number of FTE staff working on project)
    * @param {number} area  - Area of space of used in metres squred (m^2)
    * @param {number} benchmark  - Benchmark of water consumption per annum (m^3/m^2)
    * @returns {number} - carbon equivalent emissions in kg (kgCO2)
    */
    public static waterConsumptions(staff: number, area: number, benchmark: number) : number {
        return staff*area*benchmark;
    }

    /**
    * A function for estimating carbon emissions based on water consumptions and a carbon intensity factor.
    *
    * @param {number} waterConsumption  - Estimated water Consumption (m^3)
    * @param {number} carbonIntensity  - Carbon intensity factor for water consumption and treatment (kgCO2 / m^3)
    * @returns {number} - Carbon equivalent emissions in kg (kgCO2)
    */
    public static waterEmissions(waterConsumption: number, carbonIntensity: number) : number {
        return waterConsumption*carbonIntensity;
    }

    /**
    * A function for estimating carbon emissions based on transports or travel emissions and carbon emissions.
    *
    * @param {number} distance_kilometer  - Estimated distance travelled (km)
    * @param {number} carbonEmissions  - Carbon equivalent emission (kgCO2 / km)
    * @returns {number} - Carbon equivalent emissions in kg (kgCO2)
    */
    public static transportEmissions(distance_kilometer: number, carbonEmissions) : number {
        return distance_kilometer * carbonEmissions;
    }

    /**
    * A function for estimating carbon emissions based on waste.
    *
    * @param {number} tonnage  - Estimated weight of waste produced (tonne)
    * @param {number} carbonIntensity  - Carbon intensity factor for waste disposal (kgCO2 / tonne)
    * @returns {number} - Carbon equivalent emissions in kg (kgCO2)
    */
    public static wasteEmissions(tonnage: number, carbonIntensity: number) : number {
        return tonnage * carbonIntensity;
    }

    /**
    * A function for estimating carbon emissions based on expenditure.
    *
    * @param {number} expenditure  - Estimated expenditure in pounds (£)
    * @param {number} carbonIntensity  - Carbon intensity factor for procurement
    * @returns {number} - Carbon equivalent emissions
    */
    public static procurementEmissions(expenditure: number, carbonIntensity: number): number {
        return expenditure * carbonIntensity;
    }
}