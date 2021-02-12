import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IbidaasService } from '../ibidaas.service';
//import * as moment from 'moment';

import { ChartType, ChartDataSets, ChartOptions, Tooltip } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective, Color } from 'ng2-charts/ng2-charts';
//import * as pluginDataScheme from 'chartjs-plugin-colorschemes';

import { AppConfigServiceService } from 'app/app-config-service.service';

import { HttpClient } from '@angular/common/http';

declare var Nirvana: any;

export interface MyElement {
    type: string;
    min: number;
    max: number;
    avg: number;
}

export interface FiatCRF {
    Timestamp: String;
    Image: string;
    Classification: number;
    JD: number;
    N: number;
    Stampo: number;
    VA1: number;
    VM1: number;
    Sigma1: number;
    PM1: number;
    VA2: number;
    VM2: number;
    Sigma2: number;
    PM2: number;
    StatisticDataT2: number;
    L2: number;
    StatisticDataT3: number;
    L3: number;
    PM3: number;
    PF: number;
    BH: number;
    RT: number;
    TT: number;
}

export interface FiatCRF2 {
    Timestamp: String;
    Engine: String;
    Classification0: String;
    Classification1: String;
    Classification2: String;
}

export interface FiatCRF3 {
    Timestamp: String;
    Engine: String;
    Classification0: String;
}



@Component({
    selector: 'fiat-crf',
    templateUrl: './fiat-crf.component.html',
    styleUrls: ['./fiat-crf.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FiatCrfComponent implements OnInit, OnDestroy {

    // manual stop
    experimentStatus;

    counter = 0;
    countercl0 = 0;
    count = 0;
    count1 = 0;
    count2 = 0;
    over = 0;
    over1 = 0;
    flag = 1;
    //sum = 0;
    sumBH = 0;
    //sumClassification = 0;
    sumL3 = 0;
    sumPM2 = 0;
    sumSigma1 = 0;
    sumSigma2 = 0;
    sumStatisticDataT3 = 0;
    sumVA1 = 0;
    sumVA2 = 0;
    sumVM2 = 0;
    //sum0ΤΤ = 0;
    sum0BH = 0;
    //sum0Classification = 0;
    sum0L3 = 0;
    sum0PM2 = 0;
    sum0Sigma1 = 0;
    sum0Sigma2 = 0;
    sum0StatisticDataT3 = 0;
    sum0VA1 = 0;
    sum0VA2 = 0;
    sum0VM2 = 0;
    sumJD = 0;
    sumN = 0;
    sumStampo = 0;
    sumVM1 = 0;
    sumPM1 = 0;
    sumStatisticDataT2 = 0;
    sumL2 = 0;
    sumPM3 = 0;
    sumPF = 0;
    sumRT = 0;
    sumTT = 0;
    sum0JD = 0;
    sum0N = 0;
    sum0Stampo = 0;
    sum0VM1 = 0;
    sum0PM1 = 0;
    sum0StatisticDataT2 = 0;
    sum0L2 = 0;
    sum0PM3 = 0;
    sum0PF = 0;
    sum0RT = 0;
    sum0TT = 0;




    colors1 = []; //classification points color
    colors2 = []; //classification 0 
    //colors = [];

    //classification live chart
    public lineChartOptions2: ChartOptions = {

        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                type: 'linear',
                ticks: {
                    maxTicksLimit: 3,
                    max: 2,
                    min: 0

                }
            }
            ]

        },
        plugins: {

            datalabels: {
                display: false
            }
        },

    }

    lineChartColors2: Color[] = [
        {
            borderColor: 'black',
            backgroundColor: 'steelblue',
            pointBackgroundColor: this.colors1


        },
    ];

    public lineChartType2: ChartType = 'line';
    public lineChartLegend2 = true;

    public lineChartDataGl2: ChartDataSets[] = [
        {
            data: [],
            label: 'Classification',
            fill: false,
            type: 'line',
            lineTension: 0,
            borderWidth: 0.1,
            pointStyle: 'rectRounded',
            hitRadius: 2,
            radius: 12

        },
    ];

    public lineChartLabels2 = [];
    //////////////////////////////
    public lineChartDataGlCl2: ChartDataSets[] = [
        {
            data: [],
            label: 'Classification',
            fill: false,
            type: 'line',
            lineTension: 0,
            borderWidth: 0.1,
            pointStyle: 'rectRounded',
            hitRadius: 2,
            radius: 12

        },
    ];
    lineChartColors3: Color[] = [
        {
            borderColor: 'black',
            backgroundColor: 'steelblue',
            pointBackgroundColor: this.colors2


        },
    ];
    public lineChartLabels3 = [];

    //global live chart
    public lineChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            yAxes: [{
                type: 'logarithmic',
                ticks: {
                    callback: function (value) {
                        return value;
                    }
                }
            },
            {
                id: 'b',
                position: 'right',
                ticks: {
                    maxTicksLimit: 3,
                    max: 2,
                    min: 0

                }
            }
            ]

        },
        plugins: {
            colorschemes: {
                scheme: 'tableau.Classic20',
                override: true,

            },
            datalabels: {
                display: false
            }
        }

    }

    public lineChartType: ChartType = 'line';
    public lineChartLegend = true;

    public lineChartDataGl: ChartDataSets[] = [

        { data: [], label: 'JD', fill: false },
        { data: [], label: 'N', fill: false },
        { data: [], label: 'Stampo', fill: false },
        { data: [], label: 'VA1', fill: false },
        { data: [], label: 'VM1', fill: false },
        { data: [], label: 'Sigma1', fill: false },
        { data: [], label: 'PM1', fill: false },
        { data: [], label: 'VA2', fill: false },
        { data: [], label: 'VM2', fill: false },
        { data: [], label: 'Sigma2', fill: false },
        { data: [], label: 'PM2', fill: false },
        { data: [], label: 'StatisticDataT2', fill: false },
        { data: [], label: 'L2', fill: false },
        { data: [], label: 'StatisticDataT3', fill: false },
        { data: [], label: 'L3', fill: false },
        { data: [], label: 'PM3', fill: false },
        { data: [], label: 'PF', fill: false },
        { data: [], label: 'BH', fill: false },
        { data: [], label: 'RT', fill: false },
        { data: [], label: 'TT', fill: false },
        { data: [], label: 'Classification', fill: false, type: 'line', pointRadius: 10, lineTension: 0, borderDash: [2, 10], yAxisID: 'b' },
    ];


    public lineChartLabels = [];


    //chart2
    public lineChartOptions1: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            yAxes: [{
                type: 'logarithmic',
                ticks: {
                    callback: function (value) {
                        return value;
                    }
                }
            },
            ]

        },
        plugins: {
            colorschemes: {
                scheme: 'tableau.Classic20',
                override: true,

            },
            datalabels: {
                display: false
            }
        }

    }




    public lineChartType1: ChartType = 'line';
    public lineChartLegend1 = true;


    public lineChartDataGlCl: ChartDataSets[] = [
        { data: [], label: 'JD', fill: false },
        { data: [], label: 'N', fill: false },
        { data: [], label: 'Stampo', fill: false },
        { data: [], label: 'VA1', fill: false },
        { data: [], label: 'VM1', fill: false },
        { data: [], label: 'Sigma1', fill: false },
        { data: [], label: 'PM1', fill: false },
        { data: [], label: 'VA2', fill: false },
        { data: [], label: 'VM2', fill: false },
        { data: [], label: 'Sigma2', fill: false },
        { data: [], label: 'PM2', fill: false },
        { data: [], label: 'StatisticDataT2', fill: false },
        { data: [], label: 'L2', fill: false },
        { data: [], label: 'StatisticDataT3', fill: false },
        { data: [], label: 'L3', fill: false },
        { data: [], label: 'PM3', fill: false },
        { data: [], label: 'PF', fill: false },
        { data: [], label: 'BH', fill: false },
        { data: [], label: 'RT', fill: false },
        { data: [], label: 'TT', fill: false },

    ];




    public lineChartLabels1 = [];

    //pie chart 
    public pieChartOptions: ChartOptions = {
        responsive: true,

        events: [],
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontSize: 11,
            }
        },
        plugins: {
            datalabels: {
                formatter: function (value) {
                    return Math.round(value * 100) + '%';
                },


            },
        }

    };
    public pieChartLabels = [['Zero'], ['One'], ['Two']];
    public pieChartData: number[] = [0, 0, 0];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [pluginDataLabels];
    public pieChartColors = [
        {
            backgroundColor: ['#f17a7a', '#e9e08d', '#74eba9'],
        },
    ];

    //maintable
    fiatCRFDataSourcet1Gl: FiatCRF[] = [];
    displayedColumns: string[] = ['Timestamp', 'Image', 'Classification', 'JD', 'N', 'Stampo', 'VA1', 'VM1', 'Sigma1', 'PM1', 'VA2', 'VM2', 'Sigma2', 'PM2', 'StatisticDataT2', 'L2', 'StatisticDataT3', 'L3', 'PM3', 'PF', 'BH', 'RT', 'TT'];
    dataSourcet1Gl: MatTableDataSource<FiatCRF>;


    //maintable for Classification 0
    fiatCRFDataSourcet1Cl: FiatCRF[] = [];
    displayedColumnsCl0: string[] = ['Timestamp', 'Image', 'Classification', 'JD', 'N', 'Stampo', 'VA1', 'VM1', 'Sigma1', 'PM1', 'VA2', 'VM2', 'Sigma2', 'PM2', 'StatisticDataT2', 'L2', 'StatisticDataT3', 'L3', 'PM3', 'PF', 'BH', 'RT', 'TT'];
    dataSourcet1Cl: MatTableDataSource<FiatCRF>;


    //table2
    fiatCRFDataSourcet3Gl: FiatCRF2[] = [];
    displayedColumns2: string[] = ['Timestamp', 'Engine', 'Classification0', 'Classification1', 'Classification2'];
    dataSourcet3Gl: MatTableDataSource<FiatCRF2>;

    fiatCRFDataSourcet3Cl: FiatCRF3[] = [];
    displayedColumns3: string[] = ['Timestamp', 'Engine', 'Classification0'];
    dataSourcet3Cl: MatTableDataSource<FiatCRF3>;


    //tableavgminmax
    myColumns: string[] = ['type', 'min', 'max', 'avg'];
    myWidget: MyElement[] =
        [{ type: 'JD', min: 0, max: 0, avg: 0 }, { type: 'N', min: 0, max: 0, avg: 0 },
        { type: 'Stampo', min: 0, max: 0, avg: 0 }, { type: 'VA1', min: 0, max: 0, avg: 0 }, { type: 'VM1', min: 0, max: 0, avg: 0 },
        { type: 'Sigma1', min: 0, max: 0, avg: 0 }, { type: 'PM1', min: 0, max: 0, avg: 0 }, { type: 'VA2', min: 0, max: 0, avg: 0 },
        { type: 'VM2', min: 0, max: 0, avg: 0 }, { type: 'Sigma2', min: 0, max: 0, avg: 0 },
        { type: 'PM2', min: 0, max: 0, avg: 0 }, { type: 'StatisticDataT2', min: 0, max: 0, avg: 0 }, { type: 'L2', min: 0, max: 0, avg: 0 },
        { type: 'StatisticDataT3', min: 0, max: 0, avg: 0 }, { type: 'L3', min: 0, max: 0, avg: 0 }, { type: 'PM3', min: 0, max: 0, avg: 0 },
        { type: 'PF', min: 0, max: 0, avg: 0 }, { type: 'BH', min: 0, max: 0, avg: 0 }, { type: 'RT', min: 0, max: 0, avg: 0 }, { type: 'TT', min: 0, max: 0, avg: 0 }];
    // myWidget: MyElement[] = [];
    dataSourcet2Gl: MatTableDataSource<MyElement>;

    myWidget1: MyElement[] =
        [{ type: 'JD', min: 0, max: 0, avg: 0 }, { type: 'N', min: 0, max: 0, avg: 0 },
        { type: 'Stampo', min: 0, max: 0, avg: 0 }, { type: 'VA1', min: 0, max: 0, avg: 0 }, { type: 'VM1', min: 0, max: 0, avg: 0 },
        { type: 'Sigma1', min: 0, max: 0, avg: 0 }, { type: 'PM1', min: 0, max: 0, avg: 0 }, { type: 'VA2', min: 0, max: 0, avg: 0 },
        { type: 'VM2', min: 0, max: 0, avg: 0 }, { type: 'Sigma2', min: 0, max: 0, avg: 0 },
        { type: 'PM2', min: 0, max: 0, avg: 0 }, { type: 'StatisticDataT2', min: 0, max: 0, avg: 0 }, { type: 'L2', min: 0, max: 0, avg: 0 },
        { type: 'StatisticDataT3', min: 0, max: 0, avg: 0 }, { type: 'L3', min: 0, max: 0, avg: 0 }, { type: 'PM3', min: 0, max: 0, avg: 0 },
        { type: 'PF', min: 0, max: 0, avg: 0 }, { type: 'BH', min: 0, max: 0, avg: 0 }, { type: 'RT', min: 0, max: 0, avg: 0 }, { type: 'TT', min: 0, max: 0, avg: 0 }];

    // myWidget: MyElement[] = [];
    dataSourcet2Cl: MatTableDataSource<MyElement>;

    isExperimentRunning: boolean = false;

    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatPaginator) pag: MatPaginator;

    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('paginator2') pag: MatPaginator;
    @ViewChild('paginator3') pag0: MatPaginator;
    @ViewChild('paginator4') pag3: MatPaginator;
    @ViewChild('paginator5') pagw: MatPaginator;
    @ViewChild('paginator6') pagw0: MatPaginator;


    @ViewChild('matsort1') sort: MatSort;
    @ViewChild('matsort2') sor: MatSort;
    @ViewChild('matsort3') sor0: MatSort;
    @ViewChild('matsort4') sor3: MatSort;
    @ViewChild('matsort5') sortw: MatSort;
    @ViewChild('matsort6') sortw0: MatSort;


    @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;


    projectId: any;
    projectType: any;

    Session: any;
    crfChannel: any;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private _IbidaasService: IbidaasService,
        private appConfigService: AppConfigServiceService
    ) {
        this.fiatCRFDataSourcet1Gl = [];
        this.dataSourcet1Gl = new MatTableDataSource<FiatCRF>([]);

        this.fiatCRFDataSourcet1Cl = [];
        this.dataSourcet1Cl = new MatTableDataSource<FiatCRF>([]);

        this.fiatCRFDataSourcet3Gl = [];
        this.dataSourcet3Gl = new MatTableDataSource<FiatCRF2>([]);

        this.fiatCRFDataSourcet3Cl = [];
        this.dataSourcet3Cl = new MatTableDataSource<FiatCRF3>([]);

        this.dataSourcet2Gl = new MatTableDataSource<MyElement>(this.myWidget);
        this.dataSourcet2Cl = new MatTableDataSource<MyElement>(this.myWidget1);

        // create session
        this.Session = Nirvana.createSession({
            realms: [this.appConfigService.apamaUrl],
            applicationName: "testApp",
            sessionName: "testSession"
        });

        console.log(this.Session);

        // set up channel           

        //this.crfChannel = this.Session.getChannel("/ibidaas/crf/teksid_out");
        this.crfChannel = this.Session.getChannel("/ibidaas/crf/teksid2_out");

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    async ngOnInit() {

        console.log('start')
        const params = await this.route.params;

        this.projectId = params["_value"]["id"];
        this.projectType = params["_value"]["typeId"];
        this.runFiatCRFStreamingExperiment();

        // this.http.get('assets/test.json').subscribe(x =>
        //     this.relationsEventHandler(x[0])
        // )
        // this.http.get('assets/test.json').subscribe(x =>
        //     this.relationsEventHandler(x[1])
        // )

    }

    ngAfterViewInit(): void {
        this.dataSourcet1Gl.sort = this.sort;
        this.dataSourcet1Gl.paginator = this.paginator;

        this.dataSourcet3Gl.sort = this.sor;
        this.dataSourcet3Gl.paginator = this.pag;

        this.dataSourcet3Cl.sort = this.sor3;
        this.dataSourcet3Cl.paginator = this.pag3;

        this.dataSourcet1Cl.sort = this.sor0;
        this.dataSourcet1Cl.paginator = this.pag0;

        this.dataSourcet2Gl.sort = this.sortw;
        this.dataSourcet2Gl.paginator = this.pagw;

        this.dataSourcet2Cl.sort = this.sortw0;
        this.dataSourcet2Cl.paginator = this.pagw0;
    }

    async delay(ms: number) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
    }

    async runFiatCRFStreamingExperiment() {


        /*Empty grid data*/
        this.fiatCRFDataSourcet1Gl = [];
        this.dataSourcet1Gl = new MatTableDataSource<FiatCRF>([]);
        this.dataSourcet1Gl.sort = this.sort;
        this.dataSourcet1Gl.paginator = this.paginator;

        this.fiatCRFDataSourcet3Gl = [];
        this.dataSourcet3Gl = new MatTableDataSource<FiatCRF2>([]);
        this.dataSourcet3Gl.sort = this.sor;
        this.dataSourcet3Gl.paginator = this.pag;

        this.fiatCRFDataSourcet3Cl = [];
        this.dataSourcet3Cl = new MatTableDataSource<FiatCRF3>([]);
        this.dataSourcet3Cl.sort = this.sor3;
        this.dataSourcet3Cl.paginator = this.pag3;

        this.fiatCRFDataSourcet1Cl = [];
        this.dataSourcet1Cl = new MatTableDataSource<FiatCRF>([]);
        this.dataSourcet1Cl.sort = this.sor0;
        this.dataSourcet1Cl.paginator = this.pag0;


        /*Disable button*/
        // this.isExperimentRunning = true;

        // const experimentConfigurations = ""
        //     + "{\"cores_number\":" + 2
        //     + ", \"ram_gb\":" + 1 + "}";

        // const experimentResult = await this._IbidaasService.runNewExperiment(
        //     {
        //         "friendly_name": "Fiat CRF Streaming Test",
        //         "configuration": experimentConfigurations
        //     },
        //     this.projectId
        // );



        // if (experimentResult.id) {
        //     console.log("ended InitialExperiment");
        //     console.log(experimentResult);

        this.subscribeToUM();

        // this.experimentStatus = experimentResult.status;

        // while (this.experimentStatus !== 'stopped') {

        //     await this.delay(10000);

        //     console.log("running MainExperiment");

        //     let experimentMainResult = await this._IbidaasService.runNewMainExperiment(
        //         experimentResult.id
        //     );
        //     console.log(experimentMainResult);

        //     if (this.experimentStatus !== 'stopped') {

        //         if (experimentMainResult.status) {
        //             this.experimentStatus = experimentMainResult.status;
        //         } else {
        //             break;
        //         }

        //     } else {
        //         break;
        //     }

        // }

        // this.isExperimentRunning = false;

        if (this.crfChannel.isSubscribed()) {
            this.crfChannel.unsubscribe();
            this.Session.stop();
        }

        //}

    }

    subscribeToUM() {
        this.Session.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
        this.Session.on(Nirvana.Observe.START, this.onsessionStarted);

        this.Session.start();

        this.crfChannel.on(Nirvana.Observe.SUBSCRIBE, this.subscriptionCompleteHandler);
        this.crfChannel.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
        this.crfChannel.on(Nirvana.Observe.DATA, this.relationsEventHandler.bind(this));
        this.crfChannel.subscribe();

    }

    subscriptionCompleteHandler(resource) {
        console.log("subscription to this resource was successful");
        console.log(resource.getName());
    }

    // callback in order to know when the session was started
    onsessionStarted(s) {
        console.log("Session started with ID " + s.getSessionID());
        console.log(s);
        console.log(s.getResources());
    }


    // Handlers
    onErrorCaptured(resource, ex) {
        console.log("error");
        console.log(resource);
        console.log(ex.message);
    }

    //both line charts pause/start
    pause() {
        if (this.flag == 1) {
            this.flag = 0;
        }
        else {
            let i;
            this.lineChartLabels = []; //global
            //this.lineChartLabels2 = []; //classification live
            this.lineChartLabels1 = []; // class 0 
            //this.lineChartLabels3 = [];

            // this.lineChartDataGl2[0]['data'] = [];
            // this.lineChartDataGlCl2[0]['data'] = [];

            // do {
            //     this.colors1.shift();
            // } while (this.colors1.length != 0)

            // console.log(this.colors1)
            // do {
            //     this.colors2.shift();
            // } while (this.colors2.length != 0)


            for (i = 0; i <= 20; i++) {
                this.lineChartDataGl[i]['data'] = [];
            }

            for (i = 0; i <= 19; i++) {
                this.lineChartDataGlCl[i]['data'] = [];
            }

            this.charts.forEach((child) => {
                child.chart.update()
            });

            this.flag = 1;
            this.over = 0;
            this.over1 = 0;
        }
    }

    // set up subscriber for relations
    async relationsEventHandler(event) {

        console.log('event');
        let data = JSON.parse(event.getData());
        // let data = event;
        console.log(data);
        let classification = data.prediction.indexOf((Math.max(data.prediction[0], data.prediction[1], data.prediction[2])));
        let image = data.image_csv.match(/[^\/\s]*$/);

        this.fiatCRFDataSourcet1Gl.push({

            Image: image,
            Classification: classification,
            JD: data.values.JD,
            N: data.values.N,
            Stampo: data.values.Stampo,
            VA1: data.values.VA1,
            VM1: data.values.VM1,
            Sigma1: data.values.Sigma1,
            PM1: data.values.PM1,
            VA2: data.values.VA2,
            VM2: data.values.VM2,
            Sigma2: data.values.Sigma2,
            PM2: data.values.PM2,
            StatisticDataT2: data.values.StatisticDataT2,
            L2: data.values.L2,
            StatisticDataT3: data.values.StatisticDataT3,
            L3: data.values.L3,
            PM3: data.values.PM3,
            PF: data.values.PF,
            BH: data.values.BH,
            RT: data.values.RT,
            TT: data.values.TT,
            Timestamp: data.timestamp

        })

        //training table datasource for tab 1  
        this.fiatCRFDataSourcet1Cl = this.fiatCRFDataSourcet1Gl.filter(v => v.Classification == 0)

        //global widget

        this.sumJD += data.values.JD,
            this.sumN += data.values.N,
            this.sumStampo += data.values.Stampo,
            this.sumVA1 += data.values.VA1,
            this.sumVM1 += data.values.VM1,
            this.sumSigma1 += data.values.Sigma1,
            this.sumPM1 += data.values.PM1,
            this.sumVA2 += data.values.VA2,
            this.sumVM2 += data.values.VM2,
            this.sumSigma2 += data.values.Sigma2,
            this.sumPM2 += data.values.PM2,
            this.sumStatisticDataT2 += data.values.StatisticDataT2,
            this.sumL2 += data.values.L2,
            this.sumStatisticDataT3 += data.values.StatisticDataT3,
            this.sumL3 += data.values.L3,
            this.sumPM3 += data.values.PM3,
            this.sumPF += data.values.PF,
            this.sumBH += data.values.BH,
            this.sumRT += data.values.RT,
            this.sumTT += data.values.TT
        this.counter++; //global counter



        if (this.counter == 1) {



            this.myWidget[0].type = 'JD'
            this.myWidget[1].type = 'N'
            this.myWidget[2].type = 'Stampo'
            this.myWidget[3].type = 'VA1'
            this.myWidget[4].type = 'VM1'
            this.myWidget[5].type = 'Sigma1'
            this.myWidget[6].type = 'PM1'
            this.myWidget[7].type = 'VA2'
            this.myWidget[8].type = 'VM2'
            this.myWidget[9].type = 'Sigma2'
            this.myWidget[10].type = 'PM2'
            this.myWidget[11].type = 'StatisticDataT2'
            this.myWidget[12].type = 'L2'
            this.myWidget[13].type = 'StatisticDataT3'
            this.myWidget[14].type = 'L3'
            this.myWidget[15].type = 'PM3'
            this.myWidget[16].type = 'PF'
            this.myWidget[17].type = 'BH'
            this.myWidget[18].type = 'RT'
            this.myWidget[19].type = 'TT'

            this.myWidget[0].min = data.values.JD
            this.myWidget[1].min = data.values.N
            this.myWidget[2].min = data.values.Stampo
            this.myWidget[3].min = data.values.VA1
            this.myWidget[4].min = data.values.VM1
            this.myWidget[5].min = data.values.Sigma1
            this.myWidget[6].min = data.values.PM1
            this.myWidget[7].min = data.values.VA2
            this.myWidget[8].min = data.values.VM2
            this.myWidget[9].min = data.values.Sigma2
            this.myWidget[10].min = data.values.PM2
            this.myWidget[11].min = data.values.StatisticDataT2
            this.myWidget[12].min = data.values.L2
            this.myWidget[13].min = data.values.StatisticDataT3
            this.myWidget[14].min = data.values.L3
            this.myWidget[15].min = data.values.PM3
            this.myWidget[16].min = data.values.PF
            this.myWidget[17].min = data.values.BH
            this.myWidget[18].min = data.values.RT
            this.myWidget[19].min = data.values.TT


        }



        if (data.values.JD < this.myWidget[0].min) { this.myWidget[0].min = data.values.JD }
        if (data.values.JD > this.myWidget[0].max) { this.myWidget[0].max = data.values.JD }
        this.myWidget[0].avg = (this.sumJD / this.counter);

        if (data.values.N < this.myWidget[1].min) { this.myWidget[1].min = data.values.N }
        if (data.values.N > this.myWidget[1].max) { this.myWidget[1].max = data.values.N }
        this.myWidget[1].avg = (this.sumN / this.counter);

        if (data.values.Stampo < this.myWidget[2].min) { this.myWidget[2].min = data.values.Stampo }
        if (data.values.Stampo > this.myWidget[2].max) { this.myWidget[2].max = data.values.Stampo }
        this.myWidget[2].avg = (this.sumStampo / this.counter);

        if (data.values.VA1 < this.myWidget[3].min) { this.myWidget[3].min = data.values.VA1 }
        if (data.values.VA1 > this.myWidget[3].max) { this.myWidget[3].max = data.values.VA1 }
        this.myWidget[3].avg = (this.sumVA1 / this.counter);

        if (data.values.VM1 < this.myWidget[4].min) { this.myWidget[4].min = data.values.VM1 }
        if (data.values.VM1 > this.myWidget[5].max) { this.myWidget[4].max = data.values.VM1 }
        this.myWidget[4].avg = (this.sumVM1 / this.counter);

        if (data.values.Sigma1 < this.myWidget[5].min) { this.myWidget[5].min = data.values.Sigma1 }
        if (data.values.Sigma1 > this.myWidget[5].max) { this.myWidget[5].max = data.values.Sigma1 }
        this.myWidget[5].avg = (this.sumSigma1 / this.counter);

        if (data.values.PM1 < this.myWidget[6].min) { this.myWidget[6].min = data.values.PM1 }
        if (data.values.PM1 > this.myWidget[6].max) { this.myWidget[6].max = data.values.PM1 }
        this.myWidget[6].avg = (this.sumPM1 / this.counter);

        if (data.values.VA2 < this.myWidget[7].min) { this.myWidget[7].min = data.values.VA2 }
        if (data.values.VA2 > this.myWidget[7].max) { this.myWidget[7].max = data.values.VA2 }
        this.myWidget[7].avg = (this.sumVA2 / this.counter);

        if (data.values.VM2 < this.myWidget[8].min) { this.myWidget[8].min = data.values.VM2 }
        if (data.values.VM2 > this.myWidget[8].max) { this.myWidget[8].max = data.values.VM2 }
        this.myWidget[8].avg = (this.sumVM2 / this.counter);

        if (data.values.Sigma2 < this.myWidget[9].min) { this.myWidget[9].min = data.values.Sigma2 }
        if (data.values.Sigma2 > this.myWidget[9].max) { this.myWidget[9].max = data.values.Sigma2 }
        this.myWidget[9].avg = (this.sumSigma2 / this.counter);


        if (data.values.PM2 < this.myWidget[10].min) { this.myWidget[10].min = data.values.PM2 }
        if (data.values.PM2 > this.myWidget[10].max) { this.myWidget[10].max = data.values.PM2 }
        this.myWidget[10].avg = (this.sumPM2 / this.counter);

        if (data.values.StatisticDataT2 < this.myWidget[11].min) { this.myWidget[11].min = data.values.StatisticDataT2 }
        if (data.values.StatisticDataT2 > this.myWidget[11].max) { this.myWidget[11].max = data.values.StatisticDataT2 }
        this.myWidget[11].avg = (this.sumStatisticDataT2 / this.counter);

        if (data.values.L2 < this.myWidget[12].min) { this.myWidget[12].min = data.values.L2 }
        if (data.values.L2 > this.myWidget[12].max) { this.myWidget[12].max = data.values.L2 }
        this.myWidget[12].avg = (this.sumL2 / this.counter);

        if (data.values.StatisticDataT3 < this.myWidget[13].min) { this.myWidget[13].min = data.values.StatisticDataT3 }
        if (data.values.StatisticDataT3 > this.myWidget[13].max) { this.myWidget[13].max = data.values.StatisticDataT3 }
        this.myWidget[13].avg = (this.sumStatisticDataT3 / this.counter);

        if (data.values.L3 < this.myWidget[14].min) { this.myWidget[14].min = data.values.L3 }
        if (data.values.L3 > this.myWidget[14].max) { this.myWidget[14].max = data.values.L3 }
        this.myWidget[14].avg = (this.sumL3 / this.counter);

        if (data.values.PM3 < this.myWidget[15].min) { this.myWidget[15].min = data.values.PM3 }
        if (data.values.PM3 > this.myWidget[15].max) { this.myWidget[15].max = data.values.PM3 }
        this.myWidget[15].avg = (this.sumPM3 / this.counter);

        if (data.values.PF < this.myWidget[16].min) { this.myWidget[16].min = data.values.PF }
        if (data.values.PF > this.myWidget[16].max) { this.myWidget[16].max = data.values.PF }
        this.myWidget[16].avg = (this.sumPF / this.counter);

        if (data.values.BH < this.myWidget[17].min) { this.myWidget[17].min = data.values.BH }
        if (data.values.BH > this.myWidget[17].max) { this.myWidget[17].max = data.values.BH }
        this.myWidget[17].avg = (this.sumBH / this.counter);

        if (data.values.RT < this.myWidget[18].min) { this.myWidget[18].min = data.values.RT }
        if (data.values.RT > this.myWidget[18].max) { this.myWidget[18].max = data.values.RT }
        this.myWidget[18].avg = (this.sumRT / this.counter);

        if (data.values.TT < this.myWidget[19].min) { this.myWidget[19].min = data.values.TT }
        if (data.values.TT > this.myWidget[19].max) { this.myWidget[19].max = data.values.TT }
        this.myWidget[19].avg = (this.sumTT / this.counter);


        //Classification 2  
        if (classification == 0) {

            this.sum0JD += data.values.JD,
                this.sum0N += data.values.N,
                this.sum0Stampo += data.values.Stampo,
                this.sum0VA1 += data.values.VA1,
                this.sum0VM1 += data.values.VM1,
                this.sum0Sigma1 += data.values.Sigma1,
                this.sum0PM1 += data.values.PM1,
                this.sum0VA2 += data.values.VA2,
                this.sum0VM2 += data.values.VM2,
                this.sum0Sigma2 += data.values.Sigma2,
                this.sum0PM2 += data.values.PM2,
                this.sum0StatisticDataT2 += data.values.StatisticDataT2,
                this.sum0L2 += data.values.L2,
                this.sum0StatisticDataT3 += data.values.StatisticDataT3,
                this.sum0L3 += data.values.L3,
                this.sum0PM3 += data.values.PM3,
                this.sum0PF += data.values.PF,
                this.sum0BH += data.values.BH,
                this.sum0RT += data.values.RT,
                this.sum0TT += data.values.TT

            this.countercl0++; //counter for classification 0 


            if (this.countercl0 == 1) {

                this.myWidget1[0].type = 'JD'
                this.myWidget1[1].type = 'N'
                this.myWidget1[2].type = 'Stampo'
                this.myWidget1[3].type = 'VA1'
                this.myWidget1[4].type = 'VM1'
                this.myWidget1[5].type = 'Sigma1'
                this.myWidget1[6].type = 'PM1'
                this.myWidget1[7].type = 'VA2'
                this.myWidget1[8].type = 'VM2'
                this.myWidget1[9].type = 'Sigma2'
                this.myWidget1[10].type = 'PM2'
                this.myWidget1[11].type = 'StatisticDataT2'
                this.myWidget1[12].type = 'L2'
                this.myWidget1[13].type = 'StatisticDataT3'
                this.myWidget1[14].type = 'L3'
                this.myWidget1[15].type = 'PM3'
                this.myWidget1[16].type = 'PF'
                this.myWidget1[17].type = 'BH'
                this.myWidget1[18].type = 'RT'
                this.myWidget1[19].type = 'TT'

                this.myWidget1[0].min = data.values.JD
                this.myWidget1[1].min = data.values.N
                this.myWidget1[2].min = data.values.Stampo
                this.myWidget1[3].min = data.values.VA1
                this.myWidget1[4].min = data.values.VM1
                this.myWidget1[5].min = data.values.Sigma1
                this.myWidget1[6].min = data.values.PM1
                this.myWidget1[7].min = data.values.VA2
                this.myWidget1[8].min = data.values.VM2
                this.myWidget1[9].min = data.values.Sigma2
                this.myWidget1[10].min = data.values.PM2
                this.myWidget1[11].min = data.values.StatisticDataT2
                this.myWidget1[12].min = data.values.L2
                this.myWidget1[13].min = data.values.StatisticDataT3
                this.myWidget1[14].min = data.values.L3
                this.myWidget1[15].min = data.values.PM3
                this.myWidget1[16].min = data.values.PF
                this.myWidget1[17].min = data.values.BH
                this.myWidget1[18].min = data.values.RT
                this.myWidget1[19].min = data.values.TT


            }



            if (data.values.JD < this.myWidget1[0].min) { this.myWidget1[0].min = data.values.JD }
            if (data.values.JD > this.myWidget1[0].max) { this.myWidget1[0].max = data.values.JD }
            this.myWidget1[0].avg = (this.sum0JD / this.countercl0);

            if (data.values.N < this.myWidget1[1].min) { this.myWidget1[1].min = data.values.N }
            if (data.values.N > this.myWidget1[1].max) { this.myWidget1[1].max = data.values.N }
            this.myWidget1[1].avg = (this.sum0N / this.countercl0);

            if (data.values.Stampo < this.myWidget1[2].min) { this.myWidget1[2].min = data.values.Stampo }
            if (data.values.Stampo > this.myWidget1[2].max) { this.myWidget1[2].max = data.values.Stampo }
            this.myWidget1[2].avg = (this.sum0Stampo / this.countercl0);

            if (data.values.VA1 < this.myWidget1[3].min) { this.myWidget1[3].min = data.values.VA1 }
            if (data.values.VA1 > this.myWidget1[3].max) { this.myWidget1[3].max = data.values.VA1 }
            this.myWidget1[3].avg = (this.sum0VA1 / this.countercl0);

            if (data.values.VM1 < this.myWidget1[4].min) { this.myWidget1[4].min = data.values.VM1 }
            if (data.values.VM1 > this.myWidget1[5].max) { this.myWidget1[4].max = data.values.VM1 }
            this.myWidget1[4].avg = (this.sum0VM1 / this.countercl0);

            if (data.values.Sigma1 < this.myWidget1[5].min) { this.myWidget1[5].min = data.values.Sigma1 }
            if (data.values.Sigma1 > this.myWidget1[5].max) { this.myWidget1[5].max = data.values.Sigma1 }
            this.myWidget1[5].avg = (this.sum0Sigma1 / this.countercl0);

            if (data.values.PM1 < this.myWidget1[6].min) { this.myWidget1[6].min = data.values.PM1 }
            if (data.values.PM1 > this.myWidget1[6].max) { this.myWidget1[6].max = data.values.PM1 }
            this.myWidget1[6].avg = (this.sum0PM1 / this.countercl0);

            if (data.values.VA2 < this.myWidget1[7].min) { this.myWidget1[7].min = data.values.VA2 }
            if (data.values.VA2 > this.myWidget1[7].max) { this.myWidget1[7].max = data.values.VA2 }
            this.myWidget1[7].avg = (this.sum0VA2 / this.countercl0);

            if (data.values.VM2 < this.myWidget1[8].min) { this.myWidget1[8].min = data.values.VM2 }
            if (data.values.VM2 > this.myWidget1[8].max) { this.myWidget1[8].max = data.values.VM2 }
            this.myWidget1[8].avg = (this.sum0VM2 / this.countercl0);

            if (data.values.Sigma2 < this.myWidget1[9].min) { this.myWidget1[9].min = data.values.Sigma2 }
            if (data.values.Sigma2 > this.myWidget1[9].max) { this.myWidget1[9].max = data.values.Sigma2 }
            this.myWidget1[9].avg = (this.sum0Sigma2 / this.countercl0);


            if (data.values.PM2 < this.myWidget1[10].min) { this.myWidget1[10].min = data.values.PM2 }
            if (data.values.PM2 > this.myWidget1[10].max) { this.myWidget1[10].max = data.values.PM2 }
            this.myWidget1[10].avg = (this.sum0PM2 / this.countercl0);

            if (data.values.StatisticDataT2 < this.myWidget1[11].min) { this.myWidget1[11].min = data.values.StatisticDataT2 }
            if (data.values.StatisticDataT2 > this.myWidget1[11].max) { this.myWidget1[11].max = data.values.StatisticDataT2 }
            this.myWidget1[11].avg = (this.sum0StatisticDataT2 / this.countercl0);

            if (data.values.L2 < this.myWidget1[12].min) { this.myWidget1[12].min = data.values.L2 }
            if (data.values.L2 > this.myWidget1[12].max) { this.myWidget1[12].max = data.values.L2 }
            this.myWidget1[12].avg = (this.sum0L2 / this.countercl0);

            if (data.values.StatisticDataT3 < this.myWidget1[13].min) { this.myWidget1[13].min = data.values.StatisticDataT3 }
            if (data.values.StatisticDataT3 > this.myWidget1[13].max) { this.myWidget1[13].max = data.values.StatisticDataT3 }
            this.myWidget1[13].avg = (this.sum0StatisticDataT3 / this.countercl0);

            if (data.values.L3 < this.myWidget1[14].min) { this.myWidget1[14].min = data.values.L3 }
            if (data.values.L3 > this.myWidget1[14].max) { this.myWidget1[14].max = data.values.L3 }
            this.myWidget1[14].avg = (this.sum0L3 / this.countercl0);

            if (data.values.PM3 < this.myWidget1[15].min) { this.myWidget1[15].min = data.values.PM3 }
            if (data.values.PM3 > this.myWidget1[15].max) { this.myWidget1[15].max = data.values.PM3 }
            this.myWidget1[15].avg = (this.sum0PM3 / this.countercl0);

            if (data.values.PF < this.myWidget1[16].min) { this.myWidget1[16].min = data.values.PF }
            if (data.values.PF > this.myWidget1[16].max) { this.myWidget1[16].max = data.values.PF }
            this.myWidget1[16].avg = (this.sum0PF / this.countercl0);

            if (data.values.BH < this.myWidget1[17].min) { this.myWidget1[17].min = data.values.BH }
            if (data.values.BH > this.myWidget1[17].max) { this.myWidget1[17].max = data.values.BH }
            this.myWidget1[17].avg = (this.sum0BH / this.countercl0);

            if (data.values.RT < this.myWidget1[18].min) { this.myWidget1[18].min = data.values.RT }
            if (data.values.RT > this.myWidget1[18].max) { this.myWidget1[18].max = data.values.RT }
            this.myWidget1[18].avg = (this.sum0RT / this.countercl0);

            if (data.values.TT < this.myWidget1[19].min) { this.myWidget1[19].min = data.values.TT }
            if (data.values.TT > this.myWidget1[19].max) { this.myWidget1[19].max = data.values.TT }
            this.myWidget1[19].avg = (this.sum0TT / this.countercl0);

            this.colors1.push('#f17a7a'); //color for points of class live chart

            this.colors2.push('#f17a7a');


            (this.lineChartDataGlCl2[0]['data'] as number[]).push(classification);
            this.lineChartLabels3.push(data.engine);

            this.fiatCRFDataSourcet3Cl.push({
                Classification0: '  X',
                Engine: data.engine, // replace with the real name
                Timestamp: data.timestamp
            })


            this.fiatCRFDataSourcet3Gl.push({
                Classification0: '  X',
                Classification1: '',
                Classification2: ' ',
                Engine: data.engine, // replace with the real name
                Timestamp: data.timestamp
            })

            this.count++

            if (this.fiatCRFDataSourcet3Cl.length >= 20) {
                this.colors2.shift();
                this.lineChartLabels3.shift();
                this.lineChartDataGlCl2[0]['data'].shift();
                this.charts.forEach((child) => {
                    child.chart.update()
                });
            };


            if (this.flag == 1) {

                this.over1++; //counter to keep 20 values in chart class 0

                //classification 0 zero chart data
                this.lineChartLabels1.push(data.timestamp);
                (this.lineChartDataGlCl[0]['data'] as number[]).push(data.values.JD);
                (this.lineChartDataGlCl[1]['data'] as number[]).push(data.values.N);
                (this.lineChartDataGlCl[2]['data'] as number[]).push(data.values.Stampo);
                (this.lineChartDataGlCl[3]['data'] as number[]).push(data.values.VA1);
                (this.lineChartDataGlCl[4]['data'] as number[]).push(data.values.VM1);
                (this.lineChartDataGlCl[5]['data'] as number[]).push(data.values.Sigma1);
                (this.lineChartDataGlCl[6]['data'] as number[]).push(data.values.PM1);
                (this.lineChartDataGlCl[7]['data'] as number[]).push(data.values.VA2);
                (this.lineChartDataGlCl[8]['data'] as number[]).push(data.values.VM2);
                (this.lineChartDataGlCl[9]['data'] as number[]).push(data.values.Sigma2);
                (this.lineChartDataGlCl[10]['data'] as number[]).push(data.values.PM2);
                (this.lineChartDataGlCl[11]['data'] as number[]).push(data.values.StatisticDataT2);
                (this.lineChartDataGlCl[12]['data'] as number[]).push(data.values.L2);
                (this.lineChartDataGlCl[13]['data'] as number[]).push(data.values.StatisticDataT3);
                (this.lineChartDataGlCl[14]['data'] as number[]).push(data.values.L3);
                (this.lineChartDataGlCl[15]['data'] as number[]).push(data.values.PM3);
                (this.lineChartDataGlCl[16]['data'] as number[]).push(data.values.PF);
                (this.lineChartDataGlCl[17]['data'] as number[]).push(data.values.BH);
                (this.lineChartDataGlCl[18]['data'] as number[]).push(data.values.RT);
                (this.lineChartDataGlCl[19]['data'] as number[]).push(data.values.TT);


                // (this.lineChartDataGlCl2[0]['data'] as number[]).push(classification);
                // this.lineChartLabels3.push('engine' + data.engine);

                if (this.over1 >= 20) {
                    let i;
                    this.lineChartLabels1.shift();
                    // this.colors2.shift();
                    // this.lineChartLabels3.shift();
                    //this.lineChartDataGlCl2[0]['data'].shift();
                    for (i = 0; i <= 19; i++) {
                        this.lineChartDataGlCl[i]['data'].shift();
                    }
                    this.charts.forEach((child) => {
                        child.chart.update()
                    });
                };


            }
        }
        else if (classification == 1) {

            this.colors1.push('#e9e08d')

            this.fiatCRFDataSourcet3Gl.push({
                Classification0: '',
                Classification1: 'X',
                Classification2: '',
                Engine: data.engine,//this.counter,
                Timestamp: data.timestamp
            })


            this.count1++
        } else {

            this.colors1.push('#74eba9');

            this.fiatCRFDataSourcet3Gl.push({
                Classification0: '',
                Classification1: '',
                Classification2: ' X',
                Engine: data.engine,//this.counter,
                Timestamp: data.timestamp
            })


            this.count2++
        }

        (this.lineChartDataGl2[0]['data'] as number[]).push(classification);
        this.lineChartLabels2.push(data.engine);
        if (this.fiatCRFDataSourcet3Gl.length >= 20) {

            this.lineChartLabels2.shift();
            this.lineChartDataGl2[0]['data'].shift();
            this.colors1.shift();

            this.charts.forEach((child) => {
                child.chart.update()
            });
        };

        //pie chart data
        let c0 = (this.count / (this.counter));
        let c1 = (this.count1 / (this.counter));
        let c2 = (this.count2 / (this.counter));

        this.pieChartData = [c0, c1, c2];

        this.dataSourcet3Gl = new MatTableDataSource<FiatCRF2>(this.fiatCRFDataSourcet3Gl);
        this.dataSourcet3Gl.sort = this.sor;
        this.dataSourcet3Gl.paginator = this.pag;


        this.dataSourcet3Cl = new MatTableDataSource<FiatCRF3>(this.fiatCRFDataSourcet3Cl);
        this.dataSourcet3Cl.sort = this.sor3;
        this.dataSourcet3Cl.paginator = this.pag3;

        this.dataSourcet1Gl = new MatTableDataSource<FiatCRF>(this.fiatCRFDataSourcet1Gl);
        this.dataSourcet1Gl.sort = this.sort;
        this.dataSourcet1Gl.paginator = this.paginator;

        this.dataSourcet1Cl = new MatTableDataSource<FiatCRF>(this.fiatCRFDataSourcet1Cl)
        this.dataSourcet1Cl.sort = this.sor0;
        this.dataSourcet1Cl.paginator = this.pag0;




        if (this.flag == 1) {

            this.over++; //counter to keep last 20 values in global charts

            //global line chart (data)

            (this.lineChartDataGl[20]['data'] as number[]).push(classification);
            (this.lineChartDataGl[0]['data'] as number[]).push(data.values.JD);
            (this.lineChartDataGl[1]['data'] as number[]).push(data.values.N);
            (this.lineChartDataGl[2]['data'] as number[]).push(data.values.Stampo);
            (this.lineChartDataGl[3]['data'] as number[]).push(data.values.VA1);
            (this.lineChartDataGl[4]['data'] as number[]).push(data.values.VM1);
            (this.lineChartDataGl[5]['data'] as number[]).push(data.values.Sigma1);
            (this.lineChartDataGl[6]['data'] as number[]).push(data.values.PM1);
            (this.lineChartDataGl[7]['data'] as number[]).push(data.values.VA2);
            (this.lineChartDataGl[8]['data'] as number[]).push(data.values.VM2);
            (this.lineChartDataGl[9]['data'] as number[]).push(data.values.Sigma2);
            (this.lineChartDataGl[10]['data'] as number[]).push(data.values.PM2);
            (this.lineChartDataGl[11]['data'] as number[]).push(data.values.StatisticDataT2);
            (this.lineChartDataGl[12]['data'] as number[]).push(data.values.L2);
            (this.lineChartDataGl[13]['data'] as number[]).push(data.values.StatisticDataT3);
            (this.lineChartDataGl[14]['data'] as number[]).push(data.values.L3);
            (this.lineChartDataGl[15]['data'] as number[]).push(data.values.PM3);
            (this.lineChartDataGl[16]['data'] as number[]).push(data.values.PF);
            (this.lineChartDataGl[17]['data'] as number[]).push(data.values.BH);
            (this.lineChartDataGl[18]['data'] as number[]).push(data.values.RT);
            (this.lineChartDataGl[19]['data'] as number[]).push(data.values.TT);
            this.lineChartLabels.push(data.timestamp);

            //class live chart
            // (this.lineChartDataGl2[0]['data'] as number[]).push(classification);
            // this.lineChartLabels2.push('engine' + data.engine);





            if (this.over >= 20) {
                let i;

                //this.lineChartLabels2.shift();
                // this.lineChartDataGl2[0]['data'].shift();
                //this.colors1.shift();

                this.lineChartLabels.shift();
                for (i = 0; i <= 10; i++) {
                    this.lineChartDataGl[i]['data'].shift();
                }
            };

            this.charts.forEach((child) => {
                child.chart.update()
            });

        }

    }



    /**
     * On destroy
     */
    ngOnDestroy(): void {


        if (this.crfChannel.isSubscribed()) {
            this.crfChannel.unsubscribe();
            this.Session.stop();
        }
        //this.experimentStatus = "stopped";


    }

}
