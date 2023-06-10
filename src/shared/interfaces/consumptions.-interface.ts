export interface Consumption {
  consumptionsInKw : {
        data : number[],
        average: number,
        max: number
        total: number
        forecast: number
        standardDeviation: number
    },

    consumptionsInMoney: {
        data: number[],
        average: number,
        max: number,
        total: number
        forecast: number
        standardDeviation: number
    }
}

export interface ConsumptionSokect{
  eletricCurrent: number
  kwmDate: string
  power: number
  money: number
}

export interface Types{
  description: string
  icon: string,
  type: string
}

export interface TypesChartOptions extends Types{
  borderColor: string,
  backgroundColor: string
}
