export interface Consumption {
    consumptionInKw : {
        data : number[],
        averag: number,
        mode: number
    },

    consumptionInMoney: {
        data: number[],
        averag: number,
        mode: number
    }
}
