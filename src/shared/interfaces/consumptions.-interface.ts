export interface Consumption {
  consumptionsInKw : {
        data : number[],
        average: number,
        max: number
    },

    consumptionsInMoney: {
        data: number[],
        average: number,
        max: number
    }
}
