import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ViewChildren, QueryList } from '@angular/core';
//import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
//import { FormBuilder } from '@angular/forms';

//import { Subject, Observable } from 'rxjs';
//import { takeUntil } from 'rxjs/operators';


//import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
//import { BaseChartDirective } from 'ng2-charts';
//import { ActivatedRoute, Router } from '@angular/router';
//import { ActivatedRoute } from '@angular/router';

//import { IbidaasService } from '../ibidaas.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import 'chartjs-plugin-colorschemes';


import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as moment from 'moment';
//import { Title } from '@angular/platform-browser';
//import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AppConfigServiceService } from 'app/app-config-service.service';


declare var Nirvana: any;



export interface CallCenterLiveStats {
    Id: number;
    Status: any;
    CC1: number;
    CC2: number;
    CC3: number;
    All: any;
}


export interface PeriodicElement {
    minute: string;
    hour: string;
    day: string;
    position: number;
}

const wordTableS: PeriodicElement[] = [
    { position: 1, minute: '', hour: '', day: '' },
    { position: 2, minute: '', hour: '', day: '' },
    { position: 3, minute: '', hour: '', day: '' },
    { position: 4, minute: '', hour: '', day: '' },
    { position: 5, minute: '', hour: '', day: '' },
    { position: 6, minute: '', hour: '', day: '' },
    { position: 7, minute: '', hour: '', day: '' },
    { position: 8, minute: '', hour: '', day: '' },
    { position: 9, minute: '', hour: '', day: '' },
    { position: 10, minute: '', hour: '', day: '' },
];
const wordTableM: PeriodicElement[] = [
    { position: 1, minute: '', hour: '', day: '' },
    { position: 2, minute: '', hour: '', day: '' },
    { position: 3, minute: '', hour: '', day: '' },
    { position: 4, minute: '', hour: '', day: '' },
    { position: 5, minute: '', hour: '', day: '' },
    { position: 6, minute: '', hour: '', day: '' },
    { position: 7, minute: '', hour: '', day: '' },
    { position: 8, minute: '', hour: '', day: '' },
    { position: 9, minute: '', hour: '', day: '' },
    { position: 10, minute: '', hour: '', day: '' },
];
const wordTableB: PeriodicElement[] = [
    { position: 1, minute: '', hour: '', day: '' },
    { position: 2, minute: '', hour: '', day: '' },
    { position: 3, minute: '', hour: '', day: '' },
    { position: 4, minute: '', hour: '', day: '' },
    { position: 5, minute: '', hour: '', day: '' },
    { position: 6, minute: '', hour: '', day: '' },
    { position: 7, minute: '', hour: '', day: '' },
    { position: 8, minute: '', hour: '', day: '' },
    { position: 9, minute: '', hour: '', day: '' },
    { position: 10, minute: '', hour: '', day: '' },
];

@Component({
    selector: 'telefonica-live-stats',
    templateUrl: './telefonica-live-stats.component.html',
    styleUrls: ['./telefonica-live-stats.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TelefonicaLiveStatsComponent implements OnInit, OnDestroy {

    selectedTab = 'Seville'
    displayedColumns = ['position', 'minute', 'hour', 'day'];
    dataSourceS = new MatTableDataSource<PeriodicElement>();
    dataSourceM = new MatTableDataSource<PeriodicElement>();
    dataSourceB = new MatTableDataSource<PeriodicElement>();



    //registerForm: FormGroup;

    nvd3CallCenterOneOptions: any;
    nvd3CallCenterOneData: any;

    nvd3CallCenterTwoOptions: any;
    nvd3CallCenterTwoData: any;

    nvd3CallCenterThreeOptions: any;
    nvd3CallCenterThreeData: any;


    image: any = "/assets/telefonica/telefonica_spain_gray.jpg";


    //callCenterSimulationSubject = new Subject<CallCenterLiveStats[]>();

    updateChartsInterval: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    //     @ViewChild("baseChartMain") mainChartOverview: BaseChartDirective;
    //     @ViewChild("baseChartSecondary") secondaryChartOverview: BaseChartDirective;
    //     @ViewChild("baseChartcallCenterOneMain") callCenterOneMainChart: BaseChartDirective;
    //     @ViewChild("baseChartcallCenterOneSecondary") callCenterOneSecondaryChart: BaseChartDirective;
    //     @ViewChild("baseChartcallCenterTwoMain") callCenterTwoMainChart: BaseChartDirective;
    //     @ViewChild("baseChartcallCenterTwoSecondary") callCenterTwoSecondaryChart: BaseChartDirective;
    //     @ViewChild("baseChartcallCenterThreeMain") callCenterThreeMainChart: BaseChartDirective;
    //     @ViewChild("baseChartcallCenterThreeSecondary") callCenterThreeSecondaryChart: BaseChartDirective;

    @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;


    //per60 chart

    public lineChartOptionsMinute: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100,
                    beginAtZero: true
                }
            }]
        },


        plugins: {
            colorschemes: {
                scheme: 'brewer.SetTwo3',
                override: true

            },
            datalabels: {
                display: false,
            }
        }
    }




    public lineChartType: ChartType = 'line';
    public lineChartLegend = true;

    public lineChartLabelsMS = [];

    public lineChartDataMS: ChartDataSets[] = [
        // { data: [], label: 'Negative', fill: false },
        { data: [], label: 'Positive', fill: true, }
    ];
    public lineChartLabelsMM = [];

    public lineChartDataMM: ChartDataSets[] = [
        //{ data: [], label: 'Negative', fill: false },
        { data: [], label: 'Positive', fill: true }
    ];
    public lineChartLabelsMB = [];

    public lineChartDataMB: ChartDataSets[] = [
        // { data: [], label: 'Negative', fill: false },
        { data: [], label: 'Positive', fill: true }
    ];



    //per hour n day

    public lineChartLabelsDS = [];

    public lineChartDataDS: ChartDataSets[] = [
        { data: [0, 60, 40], label: 'Daily Positive Avg', fill: false, borderColor: 'red', backgroundColor: 'red', borderWidth: 5 },
        {
            data: []
            , label: 'Hourly Positive Avg', fill: false, borderColor: 'green', backgroundColor: 'green', xAxisID: 'x-axis-2'
        }
    ];
    public lineChartLabelsDM = [];

    public lineChartDataDM: ChartDataSets[] = [
        { data: [0, 60, 40], label: 'Daily Positive Avg', fill: false, borderColor: 'red', backgroundColor: 'red', borderWidth: 5 },
        {
            data: []
            , label: 'Hourly Positive Avg', fill: false, borderColor: 'green', backgroundColor: 'green', xAxisID: 'x-axis-2'
        }
    ];
    public lineChartLabelsDB = [];

    public lineChartDataDB: ChartDataSets[] = [
        { data: [0, 60, 40], label: 'Daily Positive Avg', fill: false, borderColor: 'red', backgroundColor: 'red', borderWidth: 5 },
        {
            data: []
            , label: 'Hourly Positive Avg', fill: false, borderColor: 'green', backgroundColor: 'green', xAxisID: 'x-axis-2'
        }
    ];

    public lineChartOptionsDay: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                title: function (tooltipItem, data) {


                    return '';
                }

            },
            mode: 'nearest',
            intersect: true,
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100,
                    beginAtZero: true
                }
            }],
            xAxes: [{
                gridLines: {
                    borderDash: [10, 10],
                    color: "#348632"
                }
            }, {
                id: 'x-axis-2',
                position: 'bottom',
                type: 'linear',
                display: false,
                ticks: {
                    min: 0,
                    max: 168,
                    stepSize: 24
                }
            }],
        },


        plugins: {

            colorschemes: {
                scheme: 'brewer.SetTwo3',
                override: true

            },
            datalabels: {
                display: false
            }
        }
    }





    Session: any;
    crfChannel: any;
    projectId: any;
    projectType: any;
    counterS: any = 49;
    counterM: any = 49;
    counterB: any = 49;




    constructor(
        // private _fuseConfigService: FuseConfigService,
        //private _formBuilder: FormBuilder,
        //private route: ActivatedRoute,
        //private _IbidaasService: IbidaasService,
        private appConfigService: AppConfigServiceService


    ) {

        this.Session = Nirvana.createSession({
            realms: [this.appConfigService.telefonicaUrl],
            applicationName: "testApp",
            sessionName: "testSession"

        });

        console.log(this.Session);

        // set up channel           
        this.crfChannel = this.Session.getChannel("mychannel");



        this.nvd3CallCenterOneOptions = {
            title: "",
            chart: {
                type: 'pieChart',
                color: ['#4AC11A', '#FA1F00', '#FD6F00', '#C1C1C1'],
                height: 150,
                showLegend: false,
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                donut: true,
                clipEdge: true,
                cornerRadius: 0,
                labelType: 'percent',
                padAngle: 0.02,
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                tooltip: {
                    gravity: 's',
                    classes: 'gravity-s'
                }
            }
        };

        this.nvd3CallCenterOneData = [
            {
                "label": "Positive",
                "value": 0
            },
            {
                "label": "Negative",
                "value": 0
            }
        ];

        // Call center two

        this.nvd3CallCenterTwoOptions = {
            title: "",
            chart: {
                type: 'pieChart',
                color: ['#4AC11A', '#FA1F00', '#FD6F00', '#C1C1C1'],
                height: 150,
                showLegend: false,
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                donut: true,
                clipEdge: true,
                cornerRadius: 0,
                labelType: 'percent',
                padAngle: 0.02,
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                tooltip: {
                    gravity: 's',
                    classes: 'gravity-s'
                }
            }
        };

        this.nvd3CallCenterTwoData = [
            {
                "label": "Positive",
                "value": 0
            },
            {
                "label": "Negative",
                "value": 0
            },

        ];

        // Call center three

        this.nvd3CallCenterThreeOptions = {
            title: "",
            chart: {
                type: 'pieChart',
                color: ['#4AC11A', '#FA1F00', '#FD6F00', '#C1C1C1'],
                height: 150,
                showLegend: false,
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                donut: true,
                clipEdge: true,
                cornerRadius: 0,
                labelType: 'percent',
                padAngle: 0.02,
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                tooltip: {
                    gravity: 's',
                    classes: 'gravity-s'
                }
            }
        };

        this.nvd3CallCenterThreeData = [
            {
                "label": "Positive",
                "value": 0
            },
            {
                "label": "Negative",
                "value": 0
            },

        ];

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit() {

        for (let i = 1; i <= 48; i++) {
            (this.lineChartDataDS[1]['data'] as any).push({ x: i, y: Math.random() * 100 });
            (this.lineChartDataDM[1]['data'] as any).push({ x: i, y: Math.random() * 100 });
            (this.lineChartDataDB[1]['data'] as any).push({ x: i, y: Math.random() * 100 });

        }

        var date = moment(new Date()).subtract(-24 * 5, "hours").format('ddd h:mA');
        this.lineChartLabelsDS.push(date)
        this.lineChartLabelsDM.push(date)
        this.lineChartLabelsDB.push(date)

        for (let g = -1; g <= 5; g++) {

            var date = moment(new Date()).subtract(-24 * g, "hours").format('ddd h:mA');
            this.lineChartLabelsDS.push(date)
            this.lineChartLabelsDM.push(date)
            this.lineChartLabelsDB.push(date)
        }

        //const params = await this.route.params;

        //this.projectId = 3;
        //this.projectType = 2;

        this.runFiatCRFStreamingExperiment();
    }

    async delay(ms: number) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
    }

    setTab(event) {

        if (event.index == 0) {
            this.selectedTab = 'Seville'
        } else if (event.index == 1) {
            this.selectedTab = 'Madrid'
        } else {
            this.selectedTab = 'Barcelona'
        }

    }

    async runFiatCRFStreamingExperiment() {


        this.subscribeToUM();

        // const experimentConfigurations = ""
        // +"{\"cores_number\":"+ 2 
        // +", \"ram_gb\":"+ 1 +"}";

        // const experimentResult = await this._IbidaasService.runNewExperiment(
        //         {
        //                 "friendly_name": "Fiat CRF Streaming Test",
        //                 "configuration": experimentConfigurations
        //         },
        //         this.projectId
        // );


        // if(experimentResult.id){
        //         console.log("ended InitialExperiment");
        //         console.log(experimentResult);



        //         this.subscribeToUM();

        //         let experimentStatus = experimentResult.status; 

        //         while(experimentStatus !== "stopped"){
        //                 await this.delay(0);
        //                 console.log("running MainExperiment");
        //                 let experimentMainResult = await this._IbidaasService.runNewMainExperiment(
        //                 experimentResult.id
        //                 );
        //                 console.log(experimentMainResult);
        //                 if(experimentMainResult.status){
        //                         experimentStatus = experimentMainResult.status;
        //                 }else{
        //                         break;
        //                 }
        //         }


        if (this.crfChannel.isSubscribed()) {
            this.crfChannel.unsubscribe();
            this.Session.stop();
        }

        //  }

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

    async relationsEventHandler(event) {
        //console.log("event");
        //console.log(event.getData());
        // console.log(event)
        let data = JSON.parse(event.getData());
        // console.log(data)


        if (data.CallCenterID == 'CallCenter1') {

            switch (data.TimeWindow) {
                case 60:

                    this.nvd3CallCenterTwoData = [
                        {
                            "label": "Positive",
                            "value": data.SentimentScore
                        },
                        {
                            "label": "Negative",
                            "value": 100 - data.SentimentScore
                        }

                    ];


                    (this.lineChartDataMS[0]['data'] as number[]).push(data.SentimentScore);
                    //(this.lineChartDataMS[0]['data'] as number[]).push(100-data.SentimentScore);

                    this.lineChartLabelsMS.push(moment(new Date(data.Epoc)).format('DD/MM/YYYY HH:mm:ss'));

                    for (let h = 0; h < wordTableS.length; h++) {
                        wordTableS[h].minute = Object.keys(data.TopKWords[h]) as any;
                    }

                    this.dataSourceS.data = wordTableS;
                    break;

                case 3600:
                    (this.lineChartDataDS[1]['data'] as any).push({ x: this.counterS, y: data.SentimentScore });
                    this.counterS++;
                    for (let h = 0; h < wordTableS.length; h++) {
                        wordTableS[h].hour = Object.keys(data.TopKWords[h]) as any;
                    }
                    this.dataSourceS.data = wordTableS;
                    break;

                case 86400:
                    if (this.counterS % 24 == 0) {
                        (this.lineChartDataDS[0]['data'] as number[]).push(data.SentimentScore)
                        let j = this.lineChartDataDS[0]['data'].length;
                        this.lineChartLabelsDS[j - 1] = moment(new Date(data.Epoc)).format('ddd h:mA');
                        for (let h = 0; h < wordTableS.length; h++) {
                            wordTableS[h].day = Object.keys(data.TopKWords[h]) as any;
                        }
                        this.dataSourceS.data = wordTableS;
                        break;


                    }
            }
        } else if (data.CallCenterID == 'CallCenter2') {

            switch (data.TimeWindow) {
                case 60:

                    this.nvd3CallCenterOneData = [
                        {
                            "label": "Positive",
                            "value": data.SentimentScore
                        },
                        {
                            "label": "Negative",
                            "value": 100 - data.SentimentScore
                        }

                    ];


                    (this.lineChartDataMM[0]['data'] as number[]).push(data.SentimentScore);
                    // (this.lineChartDataMM[0]['data'] as number[]).push(100-data.SentimentScore);
                    this.lineChartLabelsMM.push(moment(new Date(data.Epoc)).format('DD/MM/YYYY HH:mm:ss'));
                    for (let h = 0; h < wordTableM.length; h++) {
                        wordTableM[h].minute = Object.keys(data.TopKWords[h]) as any;
                    }
                    this.dataSourceM.data = wordTableM;
                    break;

                case 3600:
                    (this.lineChartDataDM[1]['data'] as any).push({ x: this.counterM, y: data.SentimentScore });
                    this.counterM++;
                    for (let h = 0; h < wordTableM.length; h++) {
                        wordTableM[h].hour = Object.keys(data.TopKWords[h]) as any;
                    }
                    this.dataSourceM.data = wordTableM;
                    break;

                case 86400:
                    if (this.counterM % 24 == 0) {
                        (this.lineChartDataDM[0]['data'] as number[]).push(data.SentimentScore)
                        let j = this.lineChartDataDM[0]['data'].length;
                        this.lineChartLabelsDM[j - 1] = moment(new Date(data.Epoc)).format('ddd h:mA');
                        for (let h = 0; h < wordTableM.length; h++) {
                            wordTableM[h].day = Object.keys(data.TopKWords[h]) as any;
                        }
                        this.dataSourceM.data = wordTableM;
                        break;


                    }
            }

        } else if (data.CallCenterID == 'CallCenter3') {

            switch (data.TimeWindow) {
                case 60:

                    this.nvd3CallCenterThreeData = [
                        {
                            "label": "Positive",
                            "value": data.SentimentScore
                        },
                        {
                            "label": "Negative",
                            "value": 100 - data.SentimentScore
                        },

                    ];

                    (this.lineChartDataMB[0]['data'] as number[]).push(data.SentimentScore);
                    // (this.lineChartDataMB[0]['data'] as number[]).push(100-data.SentimentScore);
                    this.lineChartLabelsMB.push(moment(new Date(data.Epoc)).format('DD/MM/YYYY HH:mm:ss'));
                    for (let h = 0; h < wordTableB.length; h++) {
                        wordTableB[h].minute = Object.keys(data.TopKWords[h]) as any;
                    }
                    this.dataSourceB.data = wordTableB;
                    break;

                case 3600:
                    (this.lineChartDataDB[1]['data'] as any).push({ x: this.counterB, y: data.SentimentScore });
                    this.counterB++;
                    for (let h = 0; h < wordTableB.length; h++) {
                        wordTableB[h].hour = Object.keys(data.TopKWords[h]) as any;
                    }
                    this.dataSourceB.data = wordTableB;
                    break;

                case 86400:
                    if (this.counterB % 24 == 0) {
                        (this.lineChartDataDB[0]['data'] as number[]).push(data.SentimentScore)
                        let j = this.lineChartDataDB[0]['data'].length;
                        this.lineChartLabelsDB[j - 1] = moment(new Date(data.Epoc)).format('ddd h:mA');
                        for (let h = 0; h < wordTableB.length; h++) {
                            wordTableB[h].day = Object.keys(data.TopKWords[h]) as any;
                        }
                        this.dataSourceB.data = wordTableB;
                        break;


                    }
            }


        }



        if (this.counterS == 168) {

            for (let i = 0; i < 24; i++) {
                this.lineChartDataDS[1]['data'].shift();
            }

            (this.lineChartDataDS[1]['data'] as any).map(v => v.x ? v.x = v.x - 24 : v);

            this.counterS = this.counterS - 24;
            this.lineChartDataDS[0]['data'].shift();
            this.lineChartLabelsDS.shift();
            this.lineChartLabelsDS.push(moment(new Date(data.Epoc)).subtract(-24, "hours").format('ddd h:mA'));
        }
        if (this.counterM == 168) {

            for (let i = 0; i < 24; i++) {
                this.lineChartDataDM[1]['data'].shift();
            }

            (this.lineChartDataDM[1]['data'] as any).map(v => v.x ? v.x = v.x - 24 : v);

            this.counterM = this.counterM - 24;
            this.lineChartDataDM[0]['data'].shift();
            this.lineChartLabelsDM.shift();
            this.lineChartLabelsDM.push(moment(new Date(data.Epoc)).subtract(-24, "hours").format('ddd h:mA'));
        }
        if (this.counterB == 168) {

            for (let i = 0; i < 24; i++) {
                this.lineChartDataDB[1]['data'].shift();
            }

            (this.lineChartDataDB[1]['data'] as any).map(v => v.x ? v.x = v.x - 24 : v);

            this.counterB = this.counterB - 24;
            this.lineChartDataDB[0]['data'].shift();
            this.lineChartLabelsDB.shift();
            this.lineChartLabelsDB.push(moment(new Date(data.Epoc)).subtract(-24, "hours").format('ddd h:mA'));
        }



        if (this.lineChartDataMS[0]['data'].length >= 40) {

            this.lineChartLabelsMS.shift();
            this.lineChartDataMS[0]['data'].shift();
        }

        if (this.lineChartDataMM[0]['data'].length >= 40) {

            this.lineChartLabelsMM.shift();
            this.lineChartDataMM[0]['data'].shift();

        }

        if (this.lineChartDataMB[0]['data'].length >= 40) {

            this.lineChartLabelsMB.shift();
            this.lineChartDataMB[0]['data'].shift();

        }


        this.charts.forEach((child) => {
            child.chart.update()
        });


        if (this.counterB == this.counterS && this.counterS == this.counterM) {


            let sumPositive = this.nvd3CallCenterOneData[0]['value'] + this.nvd3CallCenterTwoData[0]['value'] + this.nvd3CallCenterThreeData[0]['value']

            if (sumPositive >= 150)
                this.image = "/assets/telefonica/telefonica_spain_green.jpg";
            else this.image = "/assets/telefonica/telefonica_spain_red.jpg";

        }

    }

    // this.updateChartsInterval = setInterval(() => { 
    //     this.updateChartsDatasources();  
    // }, 60000);



    /**
     * On destroy
     */
    ngOnDestroy(): void {
        clearInterval(this.updateChartsInterval);
        if (this.crfChannel.isSubscribed()) {
            this.crfChannel.unsubscribe();
            this.Session.stop();
        }
    }




}
