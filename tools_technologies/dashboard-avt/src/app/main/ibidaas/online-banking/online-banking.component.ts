import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
//import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { AppConfigServiceService } from 'app/app-config-service.service';


declare var Nirvana: any;


export interface TAB {
  label: string;
  previous: number;
  current: number;
  percentagechange: number;
  rule: string;

}



@Component({
  selector: 'app-online-banking',
  templateUrl: './online-banking.component.html',
  styleUrls: ['./online-banking.component.scss']
})
export class OnlineBankingComponent implements OnInit {

  obj;
  totalCount = 0;
  timecount = 0;
  tabledata = [];
  child = [];
  countfor1 = 0;
  displayedColumns = ['label', 'current', 'previous', 'percentagechange', 'rule'];

  tableDatas: TAB[] = [];
  start;

  dataSource = new MatTableDataSource<TAB>([]);


  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
    },

    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = (ctx.chart.data.labels[ctx.dataIndex]);
          //console.log(value)
          //console.log(this.totalCount)
          let final = (value / this.totalCount) * 100;
          let final2 = String(Math.floor(final)) + '%'

          return final2;
        },
        font: {
          size: 14,
        },
        color: 'white',
      },
    }
  };
  // public pieChartLabels = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartColors = [
  //   {
  //     backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
  //   },
  // ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        //barThickness: 6,  // number (pixels) or 'flex'
        //maxBarThickness: 8 // number (pixels)


      }], yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    plugins: {
      datalabels: {
        font: {
          size: 14,
        },
        color: 'white',
      }
    }
  };
  public barChartLabels = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  //public barChartPlugins = [pluginDataLabels];

  public barChartColors: Color[] = [
    {
      backgroundColor: [
        '#039be5', '#43AA8B', '#90BE6D', '#F9C74F', '#F8961E', '#C8553D', '#EAAC8B', '#E56B6F', '#B56576', '#6D597A'
      ]
    },

  ]

  public barChartData: ChartDataSets[] = [
    {
      data: [],
      label: '',
      // barThickness: 0,
      // barPercentage: 1,
      // maxBarThickness: 0,
      // minBarLength: 1,

    },

  ];

  Session: any;
  caixaChannel: any;


  //@ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private appConfigService: AppConfigServiceService

  ) {


    // create session
    this.Session = Nirvana.createSession({
      realms: [this.appConfigService.apamaUrl],
      applicationName: "testApp",
      sessionName: "testSession"
    });

    console.log(this.Session);

    // set up channel           
    this.caixaChannel = this.Session.getChannel("/ibidaas/caixa/bizum_out");

  }

  ngOnInit() {

    //this.start = new Date(Date.now())

    this.subscribeToUM();

  }

  subscribeToUM() {
    this.Session.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
    this.Session.on(Nirvana.Observe.START, this.onsessionStarted);

    this.Session.start();

    this.caixaChannel.on(Nirvana.Observe.SUBSCRIBE, this.subscriptionCompleteHandler);
    this.caixaChannel.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
    this.caixaChannel.on(Nirvana.Observe.DATA, this.relationsEventHandler.bind(this));
    this.caixaChannel.subscribe();

  }

  // Handlers
  onErrorCaptured(resource, ex) {
    console.log("error");
    console.log(resource);
    console.log(ex.message);
  }

  // callback in order to know when the session was started
  onsessionStarted(s) {
    console.log("Session started with ID " + s.getSessionID());
    console.log(s);
    console.log(s.getResources());
  }

  subscriptionCompleteHandler(resource) {
    console.log("subscription to this resource was successful");
    console.log(resource.getName());
  }

  // set up subscriber for relations
  async relationsEventHandler(event) {
    console.log("event");
    // console.log(event.getData());
    let data = JSON.parse(event.getData());
    // console.log(data);

    data.centroids.forEach(v => {

      if (!this.barChartLabels.includes(v.label)) {
        // console.log('sub', v)
        this.newLabel(v, data.id);

      } else {

        this.existLabel(v, data.id);
      }


    })
    // data.centroids.forEach(v => {

    //   if (!this.barChartLabels.includes(v.label)) {

    //     this.newLabel(data);

    //   } else {

    //     this.existLabel(data);
    //   }


    // })





    this.dataSource.data = this.tableDatas;
    this.dataSource.sort = this.sort;

    this.totalCount = (this.barChartData[0]['data'] as number[]).reduce((a, b) => a + b, 0);

    this.charts.forEach((child) => {
      child.chart.update()
    });

  }

  existLabel(data, id) {
    let percentage;

    let i = this.barChartLabels.indexOf(data.label);
    this.barChartData[0]['data'][i] = data.count;
    this.pieChartData[i] = data.count;


    this.tabledata[i][0]['count'].push(data.count);

    if (this.tabledata[i][0]['count'].length > 2) { this.tabledata[i][0]['count'].shift() };

    let previous = this.tabledata[i][0]['count'][0];

    if (previous === 0 && data.count === 0) {
      percentage = 0;
    } else {
      percentage = parseFloat((((data.count - previous) / previous) * 100).toFixed(2));
    }


    this.tableDatas[i] = {
      label: data.label,
      previous: previous,
      current: data.count,
      percentagechange: percentage,
      rule: id
    }

  }

  newLabel(v, id) {

    this.barChartLabels.push(v.label);
    (this.barChartData[0]['data'] as number[]).push(v.count);
    this.pieChartData.push(v.count);

    this.child = [];
    this.child.push({
      label: v.label,
      count: [v.count],
      rule: id
    });
    this.tabledata.push(this.child)

    this.tableDatas.push({
      label: v.label,
      previous: 0,
      current: v.count,
      percentagechange: 0,
      rule: id
    })





  }

  //buttons

  // addSame() {

  //   let count = Math.floor(Math.random() * (100 - 1) + 1);
  //   this.obj = { label: 'random1', count: count }


  //   if (this.barChartLabels.includes(this.obj.label)) {

  //     let i = this.barChartLabels.indexOf(this.obj.label);

  //     this.barChartData[0]['data'][i] = this.obj.count;
  //     this.pieChartData[i] = this.obj.count;

  //     this.totalCount = (this.barChartData[0]['data'] as number[]).reduce((a, b) => a + b, 0);

  //     this.tabledata[i][0]['count'].push(this.obj.count);
  //     if (this.tabledata[i][0]['count'].length > 2) { this.tabledata[i][0]['count'].shift() } //keeping the last 5 inputs for this labels

  //     let previous = this.tabledata[i][0]['count'][0]
  //     let percentage = Math.floor((this.obj.count - previous) / previous * 100);

  //     this.tableDatas[i] = {
  //       label: this.obj.label,
  //       previous: previous,
  //       current: this.obj.count,
  //       percentagechange: percentage

  //     }

  //   } else {

  //     this.child = [];
  //     this.child.push({
  //       label: this.obj.label,
  //       count: [this.obj.count]
  //     });

  //     this.tabledata.push(this.child)

  //     this.tableDatas.push({
  //       label: this.obj.label,
  //       previous: 0,
  //       current: this.obj.count,
  //       percentagechange: 0

  //     })

  //     //let color = "#" + ((1 << 24) * Math.random() | 0).toString(16)
  //     this.barChartLabels.push(this.obj.label);
  //     (this.barChartData[0]['data'] as number[]).push(this.obj.count);
  //     // (this.barChartColors[0]['backgroundColor'] as any).push(color)

  //     this.totalCount = (this.barChartData[0]['data'] as number[]).reduce((a, b) => a + b, 0);

  //   }

  //   this.charts.forEach((child) => {
  //     child.chart.update()
  //   });

  //   this.dataSource.sort = this.sort;
  //   this.dataSource.data = this.tableDatas;

  // }



  // addLabel() {


  //   //let color = "#" + ((1 << 24) * Math.random() | 0).toString(16)

  //   let string = Math.random().toString(36).substring(7);
  //   let count = Math.floor(Math.random() * (100 - 1) + 1);
  //   let obj = { label: string, count: count };

  //   this.barChartLabels.push(obj.label);
  //   (this.barChartData[0]['data'] as number[]).push(obj.count);
  //   this.pieChartData.push(obj.count)

  //   //(this.barChartColors[0]['backgroundColor'] as string[]).push(color)
  //   this.totalCount = (this.barChartData[0]['data'] as number[]).reduce((a, b) => a + b, 0);

  //   this.child = [];
  //   this.child.push({
  //     label: obj.label,
  //     count: [obj.count]
  //   });
  //   this.tabledata.push(this.child)

  //   this.charts.forEach((child) => {
  //     child.chart.update()
  //   });


  //   this.tableDatas.push({
  //     label: obj.label,
  //     previous: 0,
  //     current: obj.count,
  //     percentagechange: 0
  //   })


  //   this.dataSource.data = this.tableDatas;
  //   this.dataSource.sort = this.sort;

  // }

  /**
    * On destroy
    */
  ngOnDestroy(): void {

    if (this.caixaChannel.isSubscribed()) {
      this.caixaChannel.unsubscribe();
      this.Session.stop();


    }

  }




}
