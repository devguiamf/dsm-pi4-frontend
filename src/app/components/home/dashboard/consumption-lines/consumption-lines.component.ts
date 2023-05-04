import { AfterContentInit, AfterViewChecked, Component, ElementRef, OnInit, ViewChild, destroyPlatform } from '@angular/core';
import { DashboardComponent } from '../dashboard.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-consumption-lines',
  templateUrl: './consumption-lines.component.html',
  styleUrls: ['./consumption-lines.component.scss']
})
export class ConsumptionLinesComponent implements OnInit {
  @ViewChild('canva', { static: true }) element!: ElementRef
  private chart!: Chart
  date!: Date
  typeConsumption!: string
  arrayGasto = [13, 33, 22, 11, 14, 42, 64, 60, 10, 55, 23, 12, 13, 33, 22, 11, 14, 42, 64, 60, 10, 55, 23, 12]
  arrayGasto2 = [1, 5, 4, 5, 5, 3, 1, 3, 8, 7, 8, 12, 11, 10, 15, 7, 5, 8, 9, 5, 5, 5, 1, 5]
  labelHours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
  chartJS!: Chart
  constructor(
    private dashComponent: DashboardComponent,
  ) {
    dashComponent.datetime.subscribe(res => {
      this.date = res
    })

    dashComponent.typeConsumption.subscribe(res => {
      this.typeConsumption = res
      this.addData([])
    })
  }

  ngOnInit(): void {
    this.initChart()
  }

  addData(newData: any[]){
    const sizeData = this.chartJS.data.datasets[0].data.length
    this.chartJS.data.datasets[0].data.splice(0, sizeData , ...newData)
    this.chartJS.update();
  }

  initChart(){
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: this.labelHours,
        datasets: [
          {
            label: `${this.typeConsumption}`,
            data: this.arrayGasto,
            borderWidth: 4,
            borderColor: 'rgb(58, 148, 74)',
            backgroundColor: 'white',
            borderCapStyle	: 'round',
            fill: false,
          },
          {
            label: `Gasto em Energia`,
            data: this.arrayGasto2,
            borderWidth: 4,
            borderColor: 'rgb(63, 81, 181)',
            backgroundColor: 'white',
            fill: false,
          }
        ]
      },
      options: {
        animation: {
            duration: 1000,
            easing: 'linear',
            loop: false
          
        },
        scales: {
          y: { // defining min and max so hiding the dataset does not change scale range
            min: 0,
            max: 100,
          },
        },
        layout: {
          padding: {
            left: 20,
            bottom: 20,
            right: 20,
            top: 20,
          }
        }
      }
    })
  }
}
