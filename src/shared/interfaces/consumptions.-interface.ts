export interface Consumption {

  consumptionsInKw: {
    average: number
    data : number[]
    max: number
    mode: number[]
  }

  consumptionsInMoney: {
      average: number
      data : number[]
      max: number
      mode: number[]
    }
}
