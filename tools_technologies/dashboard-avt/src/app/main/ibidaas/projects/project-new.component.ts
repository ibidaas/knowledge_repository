import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource, MatDialogRef } from "@angular/material";

import { MatStepper } from '@angular/material/stepper';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CustomDialogUploaderComponent } from '../dialogs/custom-dialog-uploader.component';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../i18n/en';
import { locale as greek } from '../../../i18n/el';

import { fuseAnimations } from '@fuse/animations';
import { IbidaasService } from '../ibidaas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { XGridComponent } from "@fuse/xModule/xGrid/xGrid.component";

import * as d3 from "d3";
import { BaseChartDirective } from 'ng2-charts';

import { HttpClient } from '@angular/common/http';
//import { Papa } from 'ngx-papaparse';
const { convertCSVToArray } = require('convert-csv-to-array');

import 'rxjs/Rx';

import { AppConfigServiceService } from 'app/app-config-service.service';

//import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


export interface Element {
    friendly_name: string;
    id: number;
    type: number;
    updated_at: string;
    data: any[];
    projectID: number;
    status: string;
    duration: string;

}

export interface ProjectTypes {
    value: number;
    viewValue: string;
}

export interface ProcessingTypes {
    value: number;
    viewValue: string;
}

export interface InputSelectionTypes {
    value: number;
    viewValue: string;
}

export interface DataSelectionTypes {
    value: number;
    viewValue: string;
}

export interface ExperimentDatasourceTypes {
    value: number;
    viewValue: string;
}

export interface AnalysisAlgorithmTypes {
    value: number;
    viewValue: string;
}

export interface ExperimentComputationalTypes {
    value: number;
    viewValue: string;
}

export interface ConfusionMatrix {
    cluster1: number;
    cluster2: number;
    cluster3: number;
    cluster4: number;
    cluster5: number;
    cluster6: number;
    cluster7: number;
    cluster8: number;
    cluster9: number;
}

@Component({
    selector: 'project',
    templateUrl: './project-new.component.html',
    styleUrls: ['../ibidaas.scss'],
    animations: fuseAnimations
})
export class ProjectNewComponent implements OnInit {

    //url: string = "https://toolbox.ibidaas.eu/qviz/";
    //urlSafe: SafeResourceUrl;


    selected: string;
    headerRow: any[] = [];
    csvData = false;
    tab: any[] = [];
    head: any[] = [];
    fileURL = "src/assets/random_forest.zip";
    BasicUrl = this.appConfigService.apiBaseUrl;

    @ViewChild('stepper') stepper: MatStepper;

    @ViewChild(XGridComponent) grid: XGridComponent;

    @ViewChild("lassoADMPriresChart") ADMPriresChart: BaseChartDirective;

    @ViewChild("lassoADMdualresChart") ADMDualresChart: BaseChartDirective;

    @ViewChild("baseChactkMeansBar") kMeansBarChart: BaseChartDirective;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    confusionMatrixDataSource: ConfusionMatrix[] = [];

    displayedColumns: string[] = ['cluster1', 'cluster2', 'cluster3', 'cluster4', 'cluster5', 'cluster6', 'cluster7', 'cluster8', 'cluster9'];

    dataSource: MatTableDataSource<ConfusionMatrix>;

    data: Element[] = [
        // {Id: 1, Name: 'Algorith name 1', Date: '2017-12-02'},
        // {Id: 2, Name: 'Algorith name 2', Date: '2017-05-01'},
        // {Id: 3, Name: 'Algorith name 3', Date: '2016-10-06'},
        // {Id: 4, Name: 'Algorith name 4', Date: '2019-10-08'},
        // {Id: 5, Name: 'Algorith name 5', Date: '2016-10-02'},
        // {Id: 6, Name: 'Algorith name 6', Date: '2018-10-03'},
        // {Id: 7, Name: 'Algorith name 7', Date: '2018-10-03'},
        // {Id: 8, Name: 'Algorith name 8', Date: '2016-10-02'},
        // {Id: 9, Name: 'Algorith name 9', Date: '2018-10-07'}
    ];

    projectTypes: ProjectTypes[] = [
        { value: 1, viewValue: 'Preconfigured' },
        { value: 2, viewValue: 'Custom' }
    ];

    processingTypes: ProcessingTypes[] = [
        { value: 1, viewValue: 'Batch Processing' },
        { value: 2, viewValue: 'Stream Processing' }
    ]

    inputSelection: InputSelectionTypes[] = [
        { value: 0, viewValue: 'No datasource' },
        { value: 1, viewValue: 'File Input' },
        { value: 2, viewValue: 'Cassandra Keyspace' },
        { value: 3, viewValue: 'Directory Datasource' }
    ]
    DataSelection: DataSelectionTypes[] = [
        { value: 1, viewValue: 'Fabricated' },
        { value: 4, viewValue: 'Tokenized' },
    ]

    experimentDatasourceTypes: ExperimentDatasourceTypes[] = [
        { value: 1, viewValue: 'File on ~/ibidaas/data server' },
        { value: 2, viewValue: 'Namespace on Cassandra DB' }
    ]

    experimentCoresTypes: ExperimentComputationalTypes[] = [
        { value: 2, viewValue: '2' },
        { value: 4, viewValue: '4' }
    ]

    experimentRamTypes: ExperimentComputationalTypes[] = [
        { value: 1, viewValue: '1 GB' },
        { value: 2, viewValue: '2 GB' },
        { value: 4, viewValue: '4 GB' },
        { value: 8, viewValue: '8 GB' }
    ]

    analysisAlgorithmTypes: AnalysisAlgorithmTypes[] = [
        { value: 1, viewValue: 'Relation Detection from IPs' }
    ]

    experimentDatasourceNames: any = [];

    columns = [
        { columnDef: 'id', header: 'A/A', cell: (element: Element) => `${element.id}` },
        { columnDef: 'friendly_name', header: 'Name', cell: (element: Element) => `${element.friendly_name}` },
        { columnDef: 'updated_at', header: 'Date', cell: (element: Element) => `${element.updated_at}` },
        { columnDef: 'duration', header: 'Duration', cell: (element: Element) => `${element.duration}` },
        { columnDef: 'status', header: 'Status', cell: (element: Element) => `${element.status}` }
    ];

    isLinear = true;
    projectId: number;
    projectType: number;
    projectTypeId: number;
    projectFile: any[];

    selectedExperiment: any = null;

    selectedDay = 'today';
    widgets: any = {};

    jupiters: any;

    fabricationGeneratedId: number = 3705;
    analysisGeneratedId: number = 1111;

    isReadOnly: boolean = true;

    fabricationCompleted: boolean = false;
    analysisCompleted: boolean = false;

    loadingSpinner: boolean = false;

    formGroupProject: FormGroup;
    formGroupExperiment: FormGroup;

    experimentCustomFullCommand: string = "";

    analysisAlgorithm: any[] = [];

    Histogram: any[] = [];

    uploadedProjectFileName: string = "";

    showExperimentDatasourceName: boolean = true;

    createdCustomProjectID: number;

    showStartAnalysis: boolean = true;

    nvd3KmeansChartData: any[] = [];

    nvd3KmeansChartOutData: any[] = [];

    nvd3KmeansChartOutDataEvaluationGroundTruth: any[] = [];

    nvd3KmeansChartOutDataEvaluationPredictions: any[] = [];

    nvd3KmeansChartOutDataEvaluationTestDataGroundTruth: any[] = [];

    nvd3KmeansChartOutDataEvaluationTestPredictions: any[] = [];

    nvd3KmeansChartOptions: any;

    nvd3KmeansChartOptions2: any;

    kMeansBarOutChartOptions: any;

    showClusterBarChart: boolean = true;

    experimentDownloadDetails: any = {
        description: "",
        referall: ""
    };

    lassoADMChartData: any = {
        final_objective: null,
        has_converged: null,
        total_time: null
    };


    csvUrl = 'assets/test1.csv';
    field;
    displayedColumns2: string[] = [];
    columnsToDisplay: string[] = this.displayedColumns2.slice();


    @ViewChild('nvd3KmeansChart') nvd3KmeansChart;
    @ViewChild('nvd3KmeansChartPredictions') nvd3KmeansChartPredictions;
    @ViewChild('nvd3KmeansChartTestDataGroundTruth') nvd3KmeansChartTestDataGroundTruth;
    @ViewChild('nvd3KmeansChartTestPredictions') nvd3KmeansChartTestPredictions;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _IbidaasService: IbidaasService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private http: HttpClient,
        private appConfigService: AppConfigServiceService
        //public sanitizer: DomSanitizer
        //private papa: Papa,
    ) {
        // if (!sessionStorage.getItem('user')) {
        //     this.router.navigateByUrl('/auth');
        // }


        this._fuseTranslationLoaderService.loadTranslations(english, greek);
        //this._registerCustomChartJSPlugin();

        this.confusionMatrixDataSource = [];

        this.dataSource = new MatTableDataSource<ConfusionMatrix>([]);

        this.formGroupProject = this._formBuilder.group({
            Name: ['', Validators.required],
            ProjectType: [2, Validators.required],
            DataProcessingType: [1, Validators.required],
            UseDefaultDockerImg: [true],
            DockerImage: [],
            Description: ['', Validators.required],
            InputSelection: [Validators.required],
            DataSelection: [Validators.required],

        })

        this.formGroupExperiment = this._formBuilder.group({
            Name: ['', Validators.required],
            DatasourceName: ['', Validators.required],
            AnalysisAlgorithm: [{
                value: '',
                disabled: false
            }],
            Command: ['myscript.py -parameter', Validators.required],
            FullCommand: [{
                value: 'runcompass --projects ../conf/project.xml --resources=../conf/resources.xml --lang=python myscript.py -parameter',
                disabled: true
            }],
            Jupiters: ['-'],
            Cores: [2, Validators.required],
            Ram: [1, Validators.required],
        })


        this._IbidaasService.getAllJupiters().then(data => {
            this.jupiters = data;
        });

        this.widgets = this._IbidaasService.getAllWidgets();



        this.nvd3KmeansChartOptions = {
            title: "Kmeans Chart",
            chart: {
                type: 'scatterChart',
                height: 650,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltipContent: function (key) {
                    return '<h3>' + key + '</h3>';
                },
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: false,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        this.nvd3KmeansChartOptions2 = {
            title: "Kmeans Chart",
            chart: {
                type: 'scatterChart',
                height: 650,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltipContent: function (key) {
                    return '<h3>' + key + '</h3>';
                },
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: false,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        this.kMeansBarOutChartOptions = this._IbidaasService.getKmeansJsonOutBarChartOpt();

        //refresh page when params changed after navigation
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    async ngOnInit() {

        //this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);



        this.formGroupExperiment.controls['FullCommand'].disable();


        const params = await this.route.params;

        this.isReadOnly = (+params["_value"]["id"] > 0 ? true : false);

        this.projectId = params["_value"]["id"];
        this.projectType = params["_value"]["typeId"];

        //await this.setKmeansChartsData();

        if (+this.projectType === 2 /*Preconfigured Projects */) {

            const preconfiguredProject = await this._IbidaasService.getPreconfiguredProjectsByID(+this.projectId);
            this.formGroupProject.controls['Name'].patchValue(preconfiguredProject.friendly_name);
            this.formGroupProject.controls['Description'].patchValue(preconfiguredProject.description);
            this.formGroupProject.controls['ProjectType'].patchValue(1);


            switch (preconfiguredProject.datasource) {
                case "no":
                    this.formGroupProject.controls['InputSelection'].patchValue(0);
                    this.experimentDatasourceTypeChange({ "value": 0 });
                    break;
                case "file":
                    this.formGroupProject.controls['InputSelection'].patchValue(1);
                    this.experimentDatasourceTypeChange({ "value": 1 });
                    this.formGroupExperiment.controls['DatasourceName'].patchValue(preconfiguredProject.datasourceInputDefaultValue);
                    break;
                case "keys":
                    this.formGroupProject.controls['InputSelection'].patchValue(2);
                    this.experimentDatasourceTypeChange({ "value": 2 });
                    break;
                case "dir":
                    this.formGroupProject.controls['InputSelection'].patchValue(3);
                    this.experimentDatasourceTypeChange({ "value": 3 });
                    break;
                default:
                    this.formGroupProject.controls['InputSelection'].patchValue(0);
                    this.experimentDatasourceTypeChange({ "value": 0 });
                    break;
            }


            this.formGroupProject.disable();

            if (+this.projectId === 1 || +this.projectId === 4) {
                this.formGroupProject.controls['DataSelection'].patchValue(+this.projectId);
                this.formGroupProject.controls['DataSelection'].enable();
            }


            this.analysisAlgorithm = preconfiguredProject.params;


            for (const _param of this.analysisAlgorithm) {
                this.formGroupExperiment.removeControl(_param.name);
                this.formGroupExperiment.addControl(_param.name, new FormControl(_param.defaultValue != null ? _param.defaultValue : null, Validators.required));
            }
        }

        if (+this.projectType === 1 /*Custom Projects */ && +this.projectId > 19) {
            this._IbidaasService.getCustomProject(+this.projectId).then(res => {
                console.log(res)
                this.formGroupProject.controls['Name'].patchValue(res.friendly_name);
                this.formGroupProject.controls['Description'].patchValue(res.description);
                this.formGroupProject.controls['ProjectType'].patchValue(2);
                this.formGroupProject.controls['InputSelection'].patchValue(+res.input_selection);

                this.experimentDatasourceTypeChange({ "value": +res.input_selection });

                this.uploadedProjectFileName = res.zip_filename;
                this.formGroupProject.disable();
            });

        }


        this.fillExperimentDatasource();

    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    async setKmeansChartsData(id) {
        if (+this.projectType === 2 && +this.projectId === 12 /*K-Means - Prediction*/) {
            const kmeansOutDataPrediction = await this._IbidaasService.getKmeansJsonOutDataPrediction(id);
            this.nvd3KmeansChartOutData = this.generateOutDatakmeans(kmeansOutDataPrediction, "vdata", "predicted_labels");
            const kMeansOutDataShorted = this.nvd3KmeansChartOutData.sort((n1, n2) => +n1.key.split("Cluster ")[1] - +n2.key.split("Cluster ")[1]);

            this.kMeansBarOutChartOptions = this._IbidaasService.getKmeansJsonOutBarChartOpt(
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.key),
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.values.length));

            this.updatekMeansBarChart();
        }

        if (+this.projectType === 2 && +this.projectId === 13 /*K-Means - Evaluation*/) {

            const kmeansOutDataEvaluation = await this._IbidaasService.getKmeansJsonOutDataEvaluation(id);

            this.nvd3KmeansChartOutDataEvaluationGroundTruth = this.generateOutDatakmeans(kmeansOutDataEvaluation, "vdata", "true_labels_train", false);

            this.nvd3KmeansChartOutDataEvaluationPredictions = this.generateOutDatakmeans(kmeansOutDataEvaluation, "vdata", "predicted_labels", false);

            this.nvd3KmeansChartOutDataEvaluationTestDataGroundTruth = this.generateOutDatakmeans(kmeansOutDataEvaluation, "vdata_test", "true_labels_test", false);

            this.nvd3KmeansChartOutDataEvaluationTestPredictions = this.generateOutDatakmeans(kmeansOutDataEvaluation, "vdata_test", "predicted_labels_test", true);

            this.fillConfusionMatrixDatasource(kmeansOutDataEvaluation);

            const kMeansOutDataShorted = this.nvd3KmeansChartOutDataEvaluationGroundTruth.sort((n1, n2) => +n1.key.split("Cluster ")[1] - +n2.key.split("Cluster ")[1]);

            this.kMeansBarOutChartOptions = this._IbidaasService.getKmeansJsonOutBarChartOpt(
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.key),
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.values.length));

            this.updatekMeansBarChart();
        }

    }





    CSVpreview() {
        this.csvData = false;
        let x = this.formGroupExperiment.controls["DatasourceName"].value;
        console.log(this.BasicUrl + x);
        if (x.endsWith('.csv')) {

            this.http.get(this.BasicUrl + x, {
                responseType: 'text'
            }).subscribe(
                data => this.extractData(data),
                err => console.log('error:', err)
            )

        }
    }


    extractData(res) {

        const arrayofArrays = convertCSVToArray(res, {
            type: 'array',
            separator: ',', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
        });

        this.headerRow = arrayofArrays.splice(0, 1)[0];

        for (let j = 0; j < 5; j++) {
            this.tab[j] = [];
            this.head[j] = this.headerRow[j];
        }

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.tab[i][j] = arrayofArrays[i][j];
            }
        }
        console.log(this.head);
        console.log(this.tab);

        this.csvData = true;
        return this.csvData;
    }











    fillConfusionMatrixDatasource(kmeansOutDataEvaluation: any) {

        for (let confusionData of kmeansOutDataEvaluation.confusion_matrix) {

            const confusionMatrixRow: ConfusionMatrix = {
                cluster1: confusionData[0],
                cluster2: confusionData[1],
                cluster3: confusionData[2],
                cluster4: confusionData[3],
                cluster5: confusionData[4],
                cluster6: confusionData[5],
                cluster7: confusionData[6],
                cluster8: confusionData[7],
                cluster9: confusionData[8]
            }

            this.confusionMatrixDataSource.push(confusionMatrixRow);
        }

        this.dataSource = new MatTableDataSource<ConfusionMatrix>(this.confusionMatrixDataSource);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

    }

    updatekMeansBarChart() {
        if (this.kMeansBarChart !== undefined) {
            this.kMeansBarChart.chart.destroy();
            this.kMeansBarChart.chart = 0;

            this.kMeansBarChart.datasets = this.kMeansBarOutChartOptions.datasets;
            this.kMeansBarChart.options = this.kMeansBarOutChartOptions.options;
            this.kMeansBarChart.labels = this.kMeansBarOutChartOptions.labels;

            this.kMeansBarChart.ngOnInit();
        }
    }

    onKmeansAnimationDone(e) {
        this.nvd3KmeansChart.ngNvD3.chart.update();
        this.nvd3KmeansChartPredictions.ngNvD3.chart.update();
        this.nvd3KmeansChartTestDataGroundTruth.ngNvD3.chart.update();
        this.nvd3KmeansChartTestPredictions.ngNvD3.chart.update();
    }

    onKmeansSelectedTabChange(e) {

        if (e.tab.textLabel === "Training Data - Ground Truth") {
            const kMeansOutDataShorted = this.nvd3KmeansChartOutDataEvaluationGroundTruth.sort((n1, n2) => +n1.key.split("Cluster ")[1] - +n2.key.split("Cluster ")[1]);

            this.kMeansBarOutChartOptions = this._IbidaasService.getKmeansJsonOutBarChartOpt(
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.key),
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.values.length)
            );

            this.showClusterBarChart = true;
        }
        if (e.tab.textLabel === "Training Data - KMeans Predictions") {
            const kMeansOutDataShorted = this.nvd3KmeansChartOutDataEvaluationPredictions.sort((n1, n2) => +n1.key.split("Cluster ")[1] - +n2.key.split("Cluster ")[1]);

            this.kMeansBarOutChartOptions = this._IbidaasService.getKmeansJsonOutBarChartOpt(
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.key),
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.values.length)
            );

            this.showClusterBarChart = true;
        }
        if (e.tab.textLabel === "Test Data - Ground Truth") {
            const kMeansOutDataShorted = this.nvd3KmeansChartOutDataEvaluationTestDataGroundTruth.sort((n1, n2) => +n1.key.split("Cluster ")[1] - +n2.key.split("Cluster ")[1]);

            this.kMeansBarOutChartOptions = this._IbidaasService.getKmeansJsonOutBarChartOpt(
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.key),
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.values.length)
            );

            this.showClusterBarChart = true;
        }
        if (e.tab.textLabel === "Test Data - KMeans Predictions") {
            const kMeansOutDataShorted = this.nvd3KmeansChartOutDataEvaluationTestPredictions.sort((n1, n2) => +n1.key.split("Cluster ")[1] - +n2.key.split("Cluster ")[1]);

            this.kMeansBarOutChartOptions = this._IbidaasService.getKmeansJsonOutBarChartOpt(
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.key),
                kMeansOutDataShorted.filter(k => k.key !== "Centers").map(c => c.values.length)
            );

            this.showClusterBarChart = true;
        }
        if (e.tab.textLabel === "Confusion Matrix on Test Data - Ground Truth  vs K-means Predictions") {
            this.showClusterBarChart = false;
        }

        this.updatekMeansBarChart();
    }

    generateData(groups, kMeansData: any[]) {
        var data = [],
            //shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
            shapes = ['diamond'],
            random = d3.random.normal();

        for (var i = 0; i < groups; i++) {
            data.push({
                key: 'Group ' + i,
                values: []
            });

            for (var j = i * kMeansData.length / groups; j < (i + 1) * kMeansData.length / groups; j++) {
                data[i].values.push({
                    x: Object.values(kMeansData[j])[0]
                    , y: Object.values(kMeansData[j])[1]
                    , size: Math.random()
                    , shape: shapes[0] /*shapes[j % 6]*/
                });
            }
        }

        return data;
    }

    generateOutDatakmeans(kMeansOutData: any, dataSourceName: string, dataSourceLabels: string, plorCenters: boolean = true) {
        var data = [],
            //shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
            shapes = ['diamond'],
            random = d3.random.normal();

        const clusters = kMeansOutData[dataSourceLabels].filter((item, i, ar) => ar.indexOf(item) === i);

        for (var i = 0; i < clusters.length; i++) {
            data.push({
                key: 'Cluster ' + clusters[i],
                values: []
            });

            for (var j = 0; j < kMeansOutData[dataSourceName].length; j++) {

                if (kMeansOutData[dataSourceLabels][j] === clusters[i]) {
                    data[i].values.push({
                        x: kMeansOutData[dataSourceName][j][0]
                        , y: kMeansOutData[dataSourceName][j][1]
                        , size: Math.random()
                        , shape: shapes[0] /*shapes[j % 6]*/
                    });
                }

            }
        }

        if (plorCenters) {
            data.push({
                key: 'Centers',
                values: kMeansOutData.centers.map(c => {
                    return {
                        x: c[0]
                        , y: c[1]
                        , size: 3
                        , shape: 'cross'
                    }
                })
            });
        }

        return data;
    }

    fillExperimentDatasource() {
        if (this.projectId !== null && +this.projectType === 2)
            this._IbidaasService.getExperiment(this.projectId).then(experiments => {
                if (this.grid != null) {

                    experiments.forEach(v => {
                        let updated = (new Date(v.updated_at).getTime() - new Date(v.created_at).getTime()) / 1000;
                        let h = Math.floor(updated / 3600).toString().padStart(2, '0'),
                            m = Math.floor(updated % 3600 / 60).toString().padStart(2, '0'),
                            s = Math.floor(updated % 60).toString().padStart(2, '0');
                        v.duration = h + ':' + m + ':' + s;
                    });

                    this.grid.data = experiments;
                    this.grid.refreshDataSource();
                }
            })

        if (this.projectId !== null && +this.projectType === 1 /*Custom Projects */ && +this.projectId > 19)
            this._IbidaasService.getCustomProjectExperiment(this.projectId).then(experiments => {
                if (this.grid != null) {

                    experiments.forEach(v => {
                        let updated = (new Date(v.updated_at).getTime() - new Date(v.created_at).getTime()) / 1000;
                        let h = Math.floor(updated / 3600).toString().padStart(2, '0'),
                            m = Math.floor(updated % 3600 / 60).toString().padStart(2, '0'),
                            s = Math.floor(updated % 60).toString().padStart(2, '0');
                        v.duration = h + ':' + m + ':' + s;




                    });

                    this.grid.data = experiments;
                    this.grid.refreshDataSource();
                }
            })
    }
    experimentDataTypeChange(e) {
        if (e.value == 1) {
            this.router.navigateByUrl('/projectnew/2/1')
        }
        if (e.value == 4) {
            this.router.navigateByUrl('/projectnew/2/4')

        }
    }

    experimentDatasourceTypeChange(e) {
        if (e.value == 0) {
            this.showExperimentDatasourceName = false;
            this.formGroupExperiment.controls["DatasourceName"].clearValidators();
        }

        if (e.value == 1 /*Files on server*/) {
            this.formGroupExperiment.controls["DatasourceName"].setValidators(Validators.required);

            this._IbidaasService.getInputFiles().then(res => {
                const result: any[] = <any[]>res;
                this.experimentDatasourceNames = result.map(r => {
                    return { "value": r == "" ? "null" : r, "viewValue": r == "" ? "null" : r };
                })
            });

            this.showExperimentDatasourceName = true;
        }

        if (e.value == 2 /*Namespace on Cassandra DB*/) {

            this.formGroupExperiment.controls["DatasourceName"].setValidators(Validators.required);

            this._IbidaasService.getKeySpaces().then(res => {
                const result: any[] = <any[]>res;
                this.experimentDatasourceNames = result.map(r => {
                    return { "value": r == "" ? "null" : r, "viewValue": r == "" ? "null" : r };
                })
            });

            this.showExperimentDatasourceName = true;
        }

        if (e.value == 3 /*Directory Datasource*/) {

            this.formGroupExperiment.controls["DatasourceName"].setValidators(Validators.required);

            this._IbidaasService.getDirectoryDatasources().then(res => {
                const result: any[] = <any[]>res;
                this.experimentDatasourceNames = result.map(r => {
                    return { "value": r == "" ? "null" : r, "viewValue": r == "" ? "null" : r };
                })
            });

            this.showExperimentDatasourceName = true;
        }

    }

    commandFocusOut(e) {
        if (+this.projectId !== 15) {
            this.experimentCustomFullCommand = "runcompass --projects ../conf/project.xml --resources=../conf/resources.xml --lang=python " +
                this.formGroupExperiment.controls['Command'].value
                + " "
                + this.formGroupExperiment.controls['DatasourceName'].value;

            this.formGroupExperiment.controls['FullCommand'].patchValue(this.experimentCustomFullCommand);
            this.formGroupExperiment.controls['FullCommand'].disable();
        }
    }

    experimentDatasourceNamesChange(e) {
        if (+this.projectId !== 15) {
            this.experimentCustomFullCommand = "runcompass --projects ../conf/project.xml --resources=../conf/resources.xml --lang=python " +
                this.formGroupExperiment.controls['Command'].value
                + " "
                + this.formGroupExperiment.controls['DatasourceName'].value;

            this.formGroupExperiment.controls['FullCommand'].patchValue(this.experimentCustomFullCommand);
            this.formGroupExperiment.controls['FullCommand'].disable();
        }
    }

    projectTypeChange(e) {

    }

    async proceedProjectClicked() {
        if (this.formGroupProject.valid && this.projectFile != null && this.projectFile.length > 0) {

            this.loadingSpinner = true;

            let formData = new FormData();

            formData.append('docker_image', this.formGroupProject.controls["UseDefaultDockerImg"].value ? "1" : "0");
            formData.append('docker_image_name', this.formGroupProject.controls["DockerImage"].value);
            formData.append('zip_filename', this.projectFile[0]);
            formData.append('language', "Python 2");
            formData.append('friendly_name', this.formGroupProject.controls["Name"].value);
            formData.append('description', this.formGroupProject.controls["Description"].value);
            formData.append('input_selection', this.formGroupProject.controls["InputSelection"].value);


            const createdCustomProject = await this._IbidaasService.saveProject(formData);

            if (createdCustomProject.id != null) {
                this.loadingSpinner = false;

                this.createdCustomProjectID = createdCustomProject.id;

                this.openSnackBar("Project created successfully", "OK")

                this.stepper.next();
            } else {
                this.openSnackBar("Error on creating project", "OK")
                this.loadingSpinner = false;
                console.log(createdCustomProject);
            }

        }
    }


    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }


    onUseDefaultDockerImgChange(event) {
        if (event.checked) {
            this.formGroupProject.controls["DockerImage"].setErrors(null);
        }
    }

    uploadAnalysisCode() {
        this.openUploaderDialog();
    }

    dataProcessingTypeChange(e) {

    }

    startFabrication() {
        if (this.formGroupProject.valid) {
            this.loadingSpinner = true;
            setTimeout(() => {
                this.fabricationGeneratedId = Math.floor(Math.random() * 9999) + 1111;
                this.fabricationCompleted = true;
                this.loadingSpinner = false;
            }, 3000);
        }
    }

    analysisAlgorithmChange(e) {

        this.analysisAlgorithm = [
            { Label: "Period", Name: "Period" }
        ];

        for (const _param of this.analysisAlgorithm) {
            this.formGroupExperiment.addControl(_param.Name, new FormControl('', Validators.required));
        }
    }


    async experimentRowClicked(e) {
        this.selectedExperiment = this.grid.data.find(c => c.id === e.id);
        console.log(this.selectedExperiment)

        if (+this.projectType === 2 /*Preconfigured Projects */) {

            switch (+this.projectId) {
                case 1 /*IP Address Relations - Batch processsing (fabricated data)*/: {

                    this.experimentDatasourceNames = [{ "value": "\/var\/nfs\/general\/fabricated\/experiment1.csv", "viewValue": "\/var\/nfs\/general\/fabricated\/experiment1.csv" }]

                    this.formGroupExperiment.controls['Name'].patchValue(this.selectedExperiment.friendly_name);
                    this.formGroupExperiment.controls['AnalysisAlgorithm'].patchValue(1);
                    this.formGroupExperiment.controls['DatasourceType'] != null ? this.formGroupExperiment.controls['DatasourceType'].patchValue("") : console.log("No DatasourceType Control");
                    this.formGroupExperiment.controls['DatasourceName'].patchValue("\/var\/nfs\/general\/fabricated\/experiment1.csv");
                    this.formGroupExperiment.controls['Command'].patchValue("myscript.py -parameter");

                    //this.Histogram = await this._IbidaasService.getHistogram();
                    this.Histogram = [{ "count": 0, "people": 17849 }, { "count": 1, "people": 4788 }, { "count": 2, "people": 1036 }, { "count": 3, "people": 214 }, { "count": 4, "people": 57 }, { "count": 5, "people": 27 }, { "count": 6, "people": 4 }, { "count": 7, "people": 1 }];


                    this.widgets.wdgStatsVisibility.datasets.today = [
                        {
                            label: 'People',
                            data: this.Histogram.map(c => c.people),
                            fill: 'start'
                        }
                    ]

                    this.widgets.wdgStatsVisibility.labels = this.Histogram.map(c => c.count.toString());

                    break;
                }

                case 4 /*IP Address Relations - Batch processsing (tokenized data))*/: {

                    this.experimentDatasourceNames = [{ "value": "\/var\/nfs\/general\/fabricated\/experiment1.csv", "viewValue": "\/var\/nfs\/general\/fabricated\/experiment1.csv" }]

                    this.formGroupExperiment.controls['Name'].patchValue(this.selectedExperiment.friendly_name);
                    this.formGroupExperiment.controls['AnalysisAlgorithm'].patchValue(1);
                    this.formGroupExperiment.controls['DatasourceType'] != null ? this.formGroupExperiment.controls['DatasourceType'].patchValue("") : console.log("No DatasourceType Control");
                    this.formGroupExperiment.controls['DatasourceName'].patchValue("\/var\/nfs\/general\/fabricated\/experiment1.csv");
                    this.formGroupExperiment.controls['Command'].patchValue("myscript.py -parameter");

                    //this.Histogram = await this._IbidaasService.getHistogram();
                    this.Histogram = [{ "count": 0, "people": 17849 }, { "count": 1, "people": 4788 }, { "count": 2, "people": 1036 }, { "count": 3, "people": 214 }, { "count": 4, "people": 57 }, { "count": 5, "people": 27 }, { "count": 6, "people": 4 }, { "count": 7, "people": 1 }];


                    this.widgets.wdgStatsVisibility.datasets.today = [
                        {
                            label: 'People',
                            data: this.Histogram.map(c => c.people),
                            fill: 'start'
                        }
                    ]

                    this.widgets.wdgStatsVisibility.labels = this.Histogram.map(c => c.count.toString());

                    break;
                }

                case 10 /*LASSO ADMM*/: {

                    const selectedExperimentProject = await this._IbidaasService.getPreconfiguredProjectsByID(+this.selectedExperiment.projectid);

                    this.formGroupExperiment.controls['Name'].patchValue(this.selectedExperiment.friendly_name);

                    const selectedExperimentConfigurations = JSON.parse(this.selectedExperiment.configuration);

                    this.formGroupExperiment.controls['DatasourceName'].patchValue(selectedExperimentConfigurations.input_path);

                    this.analysisAlgorithm = selectedExperimentProject.params;

                    for (const _param of this.analysisAlgorithm) {
                        this.formGroupExperiment.removeControl(_param.name);
                        this.formGroupExperiment.addControl(_param.name, new FormControl(selectedExperimentConfigurations[_param.name] != null ? selectedExperimentConfigurations[_param.name] : null, Validators.required));
                    }

                    this.createLassoChart(e.id);

                    break;
                }

                case 12 /*K-Means - Prediction*/: {
                    const selectedExperimentProject = await this._IbidaasService.getPreconfiguredProjectsByID(+this.selectedExperiment.projectid);

                    this.formGroupExperiment.controls['Name'].patchValue(this.selectedExperiment.friendly_name);

                    const selectedExperimentConfigurations = JSON.parse(this.selectedExperiment.configuration);

                    this.formGroupExperiment.controls['DatasourceName'].patchValue(selectedExperimentConfigurations.input_filename);

                    this.analysisAlgorithm = selectedExperimentProject.params;

                    for (const _param of this.analysisAlgorithm) {
                        this.formGroupExperiment.removeControl(_param.name);
                        this.formGroupExperiment.addControl(_param.name, new FormControl(selectedExperimentConfigurations[_param.name] != null ? selectedExperimentConfigurations[_param.name] : null, Validators.required));
                    }

                    this.setKmeansChartsData(e.id);


                    break;
                }

                case 13 /*K-Means - Evaluation*/: {
                    const selectedExperimentProject = await this._IbidaasService.getPreconfiguredProjectsByID(+this.selectedExperiment.projectid);

                    this.formGroupExperiment.controls['Name'].patchValue(this.selectedExperiment.friendly_name);

                    const selectedExperimentConfigurations = JSON.parse(this.selectedExperiment.configuration);

                    this.formGroupExperiment.controls['DatasourceName'].patchValue(selectedExperimentConfigurations.input_filename);

                    this.analysisAlgorithm = selectedExperimentProject.params;

                    for (const _param of this.analysisAlgorithm) {
                        this.formGroupExperiment.removeControl(_param.name);
                        this.formGroupExperiment.addControl(_param.name, new FormControl(selectedExperimentConfigurations[_param.name] != null ? selectedExperimentConfigurations[_param.name] : null, Validators.required));
                    }

                    this.setKmeansChartsData(e.id);

                    break;
                }
            }


            this.experimentDownloadDetails = await this._IbidaasService.getPreconfiguredExperimentDownloadDetails(e.id);
        }

        if (+this.projectType === 1 /*Custom Projects */) {

            const customProject = await this._IbidaasService.getCustomProject(+this.selectedExperiment.custom_project_id);
            this.experimentDatasourceTypeChange({ "value": +customProject.input_selection });

            let experimentRowClickedDatasourceName = "";

            switch (+customProject.input_selection) {
                case 0 /* No datasource */: {
                    break;
                }
                case 1 /* File Input */: {
                    experimentRowClickedDatasourceName = this.experimentDatasourceNames.find(c => c.viewValue === this.selectedExperiment.input_filename).value;
                    break;
                }
                case 2 /* Cassandra Keyspace */: {
                    experimentRowClickedDatasourceName = this.experimentDatasourceNames.find(c => c.viewValue === this.selectedExperiment.cassandra_keyspace).value;
                    break;
                }

                default:
                    break;
            }

            this.formGroupExperiment.controls['Name'].patchValue(this.selectedExperiment.friendly_name);
            this.formGroupExperiment.controls['AnalysisAlgorithm'].patchValue(1);
            this.formGroupExperiment.controls['Cores'].patchValue(+this.selectedExperiment.cores_number);
            this.formGroupExperiment.controls['Ram'].patchValue(+this.selectedExperiment.ram_gb);
            this.formGroupExperiment.controls['DatasourceType'] != null ? this.formGroupExperiment.controls['DatasourceType'].patchValue("") : console.log("No DatasourceType Control");
            this.formGroupExperiment.controls['DatasourceName'].patchValue(experimentRowClickedDatasourceName);
            this.formGroupExperiment.controls['FullCommand'].patchValue(this.selectedExperiment.command);
            this.formGroupExperiment.controls['Jupiters'].patchValue(this.selectedExperiment.jupiter_notebook == null ? '-' : this.selectedExperiment.jupiter_notebook);

            //console.log(this.formGroupExperiment.controls['Jupiters'])
            //console.log(this.selectedExperiment.jupiter_notebook)

            this.experimentDownloadDetails = await this._IbidaasService.getCustoExperimentDownloadDetails(e.id);
        }

        this.formGroupExperiment.disable();

        this.stepper.next();
    }

    deteleExperiment(e) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            Message: 'Are you sure you want to delete this experiment ?'
        };

        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            dialogResult => {
                if (dialogResult) {

                    if (+this.projectType === 2 /*Preconfigured Projects */) {
                        this._IbidaasService.removeExperiment(e.id).then(res => {
                            this._IbidaasService.getExperiment(this.projectId).then(experiments => {
                                this.grid.data = experiments;
                                this.grid.refreshDataSource();
                            })
                        })
                    }

                    if (+this.projectType === 1 /*Custom Projects */) {
                        this._IbidaasService.removeCustomExperiment(e.id).then(res => {
                            this._IbidaasService.getCustomProjectExperiment(this.projectId).then(experiments => {
                                this.grid.data = experiments;
                                this.grid.refreshDataSource();
                            })
                        })
                    }

                }
            }
        );
    }

    stopExperiment(e) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            Message: 'Are you sure you want to Stop this experiment ?'
        };

        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            dialogResult => {
                if (dialogResult) {

                    if (+this.projectType === 2) { /*Preconfigured Projects */// && +this.projectId === 1 /*IP Address Relations*/){
                        this._IbidaasService.removeExperiment(e.id).then(res => {
                            this._IbidaasService.getExperiment(this.projectId).then(experiments => {
                                this.grid.data = experiments;
                                this.grid.refreshDataSource();
                            })
                        })
                    }

                    if (+this.projectType === 1 /*Custom Projects */) {
                        this._IbidaasService.stopCustomExperiment(e.id).then(res => {
                            this._IbidaasService.getCustomProjectExperiment(this.projectId).then(experiments => {
                                this.grid.data = experiments;
                                this.grid.refreshDataSource();
                            })
                        })
                    }

                }
            }
        );
    }

    addNewExperiment() {
        this.formGroupExperiment.enable();
        switch (this.formGroupProject.controls["InputSelection"].value) {
            case 0 /* No datasource */: {
                this.experimentDatasourceNames = [];

                this.formGroupExperiment.controls['AnalysisAlgorithm'].patchValue(1);
                this.formGroupExperiment.controls['Name'].patchValue("");
                this.formGroupExperiment.controls['DatasourceType'] != null ? this.formGroupExperiment.controls['DatasourceType'].patchValue("") : console.log("No DatasourceType Control");
                this.formGroupExperiment.controls['DatasourceName'] != null ? this.formGroupExperiment.controls['DatasourceName'].patchValue("") : console.log("No DatasourceName Control");
                this.formGroupExperiment.controls['Command'].patchValue("myscript.py -parameter");

                break;
            }
            case 1 /* File Input */: {
                this.formGroupExperiment.controls['AnalysisAlgorithm'].patchValue(1);
                this.formGroupExperiment.controls['Name'].patchValue("");
                this.formGroupExperiment.controls['DatasourceType'] != null ? this.formGroupExperiment.controls['DatasourceType'].patchValue("") : console.log("No DatasourceType Control");
                // this.formGroupExperiment.controls['DatasourceName'] != null ? this.formGroupExperiment.controls['DatasourceName'].patchValue(""): console.log("No DatasourceName Control");
                this.formGroupExperiment.controls['Command'].patchValue("myscript.py -parameter");

                break;
            }
            case 2 /* Cassandra Keyspace */: {
                this.formGroupExperiment.controls['AnalysisAlgorithm'].patchValue(1);
                this.formGroupExperiment.controls['Name'].patchValue("");
                this.formGroupExperiment.controls['DatasourceType'] != null ? this.formGroupExperiment.controls['DatasourceType'].patchValue("") : console.log("No DatasourceType Control");
                this.formGroupExperiment.controls['DatasourceName'] != null ? this.formGroupExperiment.controls['DatasourceName'].patchValue("") : console.log("No DatasourceName Control");
                this.formGroupExperiment.controls['Command'].patchValue("myscript.py -parameter");

                break;
            }
            case 3 /* Directory Datasource For now only for lasso */: {
                this.formGroupExperiment.controls['Name'].patchValue("");
                this.formGroupExperiment.controls['DatasourceType'] != null ? this.formGroupExperiment.controls['DatasourceType'].patchValue("") : console.log("No DatasourceType Control");
                this.formGroupExperiment.controls['DatasourceName'] != null ? this.formGroupExperiment.controls['DatasourceName'].patchValue("") : console.log("No DatasourceName Control");

                break;
            }

            default:
                break;
        }

        this.formGroupExperiment.controls['FullCommand'].disable();
    }

    async startAnalysis() {
        if (!this.showExperimentDatasourceName) {
            this.formGroupExperiment.controls["DatasourceName"] != null ? this.formGroupExperiment.controls["DatasourceName"].patchValue("") : console.log("No control DatasourceName");
        }

        if (this.formGroupExperiment.valid) {
            this.loadingSpinner = true;

            console.log("running InitialExperiment");

            if (+this.projectId <= 19 && +this.projectId > 0 && (+this.projectId === 1 || +this.projectId === 4 || +this.projectId === 10 || +this.projectId === 12 || +this.projectId === 13 || +this.projectId === 14 || +this.projectId === 16) /*Temporary until other project can run experiments*/) {
                let experimentConfigurations = "";
                switch (+this.projectId) {
                    case 1 /*IP Address Relations*/:
                        experimentConfigurations = ""
                            + "{\"cores_number\":" + this.formGroupExperiment.controls["Cores"].value
                            + ", \"ram_gb\":" + this.formGroupExperiment.controls["Ram"].value
                            + ", \"cassandra_keyspace\": \"experiment1\""
                            // +" , \"cond\": \""+ this.formGroupExperiment.controls["cond"].value
                            //+"\" }";
                            + "}";
                        break;
                    case 4 /*IP Address Relations (tokenized data)*/:
                        experimentConfigurations = ""
                            + "{\"cores_number\":" + this.formGroupExperiment.controls["Cores"].value
                            + ", \"ram_gb\":" + this.formGroupExperiment.controls["Ram"].value
                            + ", \"cassandra_keyspace\": \"experiment1\""
                            // +" , \"cond\": \""+ this.formGroupExperiment.controls["cond"].value
                            //+"\" }";
                            + "}";
                        break;
                    case 10 /*Lasso ADM*/:
                        experimentConfigurations = ""
                            + "{ \"cores_number\":" + this.formGroupExperiment.controls["Cores"].value
                            + ", \"ram_gb\":" + this.formGroupExperiment.controls["Ram"].value
                            + ", \"rho\":" + this.formGroupExperiment.controls["rho"].value
                            + ", \"abstol\":" + this.formGroupExperiment.controls["abstol"].value
                            + ", \"reltol\":" + this.formGroupExperiment.controls["reltol"].value
                            + ", \"n\":" + this.formGroupExperiment.controls["n"].value
                            + ", \"max_iter\":" + this.formGroupExperiment.controls["max_iter"].value
                            + ", \"lmbd\":" + this.formGroupExperiment.controls["lmbd"].value
                            + ", \"input_path\": \"" + this.formGroupExperiment.controls["DatasourceName"].value
                            + "\" }";
                        break;
                    case 12 /*K-Means - Prediction*/:
                        experimentConfigurations = ""
                            + "{ \"cores_number\":" + this.formGroupExperiment.controls["Cores"].value
                            + ", \"ram_gb\":" + this.formGroupExperiment.controls["Ram"].value
                            + ", \"clusters\":" + this.formGroupExperiment.controls["clusters"].value
                            + ", \"max_iter\":" + this.formGroupExperiment.controls["max_iter"].value
                            + ", \"tol\":" + this.formGroupExperiment.controls["tol"].value
                            + ", \"subset_size\":" + this.formGroupExperiment.controls["subset_size"].value
                            + ", \"test_size\":" + this.formGroupExperiment.controls["test_size"].value
                            + ", \"input_filename\":" + "\"" + this.formGroupExperiment.controls["DatasourceName"].value
                            + "\" }";
                        break;
                    case 13 /*K-Means - Evaluation*/:
                        experimentConfigurations = ""
                            + "{ \"cores_number\":" + this.formGroupExperiment.controls["Cores"].value
                            + ", \"ram_gb\":" + this.formGroupExperiment.controls["Ram"].value
                            + ", \"clusters\":" + this.formGroupExperiment.controls["clusters"].value
                            + ", \"max_iter\":" + this.formGroupExperiment.controls["max_iter"].value
                            + ", \"tol\":" + this.formGroupExperiment.controls["tol"].value
                            + ", \"subset_size\":" + this.formGroupExperiment.controls["subset_size"].value
                            + ", \"test_size\":" + this.formGroupExperiment.controls["test_size"].value
                            + ", \"input_filename\":" + "\"" + this.formGroupExperiment.controls["DatasourceName"].value
                            + "\" }";
                        break;
                    case 14 /*Random Forest*/:
                        experimentConfigurations = ""
                            + "{ \"cores_number\":" + this.formGroupExperiment.controls["Cores"].value
                            + ", \"ram_gb\":" + this.formGroupExperiment.controls["Ram"].value
                            + ", \"md\":" + this.formGroupExperiment.controls["md"].value
                            + ", \"n\":" + this.formGroupExperiment.controls["n"].value
                            + ", \"hv\":" + this.formGroupExperiment.controls["hv"].value
                            + ", \"input_filename\":" + "\"" + this.formGroupExperiment.controls["DatasourceName"].value
                            + "\" }";
                        break;
                    case 16 /*Random Forest*/:
                        experimentConfigurations = ""
                            + "{ \"cores_number\":" + this.formGroupExperiment.controls["Cores"].value
                            + ", \"ram_gb\":" + this.formGroupExperiment.controls["Ram"].value
                            + ", \"md\":" + this.formGroupExperiment.controls["md"].value
                            + ", \"tf\":" + this.formGroupExperiment.controls["tf"].value
                            + ", \"distr_depth\":" + this.formGroupExperiment.controls["distr_depth"].value
                            + ", \"sklearn_max\":" + this.formGroupExperiment.controls["sklearn_max"].value
                            + ", \"bootstrap\":" + this.formGroupExperiment.controls["bootstrap"].value
                            + ", \"input_filename\":" + "\"" + this.formGroupExperiment.controls["DatasourceName"].value
                            + "\" }";
                        break;
                }

                console.log(experimentConfigurations)

                const experimentResult = await this._IbidaasService.runNewExperiment(
                    {
                        "friendly_name": this.formGroupExperiment.controls["Name"].value,
                        "configuration": experimentConfigurations
                    },
                    this.projectId
                );

                if (experimentResult.id) {
                    console.log("ended InitialExperiment");
                    console.log(experimentResult);

                    let experimentStatus = experimentResult.status;

                    while (experimentStatus !== "stopped") {
                        await this.delay(10000);
                        console.log("running MainExperiment");
                        let experimentMainResult = await this._IbidaasService.runNewMainExperiment(
                            experimentResult.id
                        );
                        console.log(experimentMainResult);
                        if (experimentMainResult.status) {
                            experimentStatus = experimentMainResult.status;
                        } else {
                            break;
                        }
                    }

                    this.completedAnalysis(experimentResult);

                } else {
                    this.loadingSpinner = false;
                    this.openSnackBar("Failed to run Initial Experiment", "OK");
                    console.log(experimentResult);
                }

            }

            if (+this.projectId > 19 || +this.projectId < 0) {

                let customExperimentObj = {};

                switch (this.formGroupProject.controls["InputSelection"].value) {
                    case 0 /* No datasource */: {
                        customExperimentObj = {
                            "friendly_name": this.formGroupExperiment.controls["Name"].value,
                            "cores_number": this.formGroupExperiment.controls["Cores"].value,
                            "ram_gb": this.formGroupExperiment.controls["Ram"].value,
                            "command": this.formGroupExperiment.controls["Command"].value + " " + this.formGroupExperiment.controls["DatasourceName"].value
                            , "jupiter_notebook": this.formGroupExperiment.controls["Jupiters"].value
                        };
                        break;
                    }
                    case 1 /* File Input */: {
                        customExperimentObj = {
                            "friendly_name": this.formGroupExperiment.controls["Name"].value,
                            "cores_number": this.formGroupExperiment.controls["Cores"].value,
                            "ram_gb": this.formGroupExperiment.controls["Ram"].value,
                            "input_filename": this.formGroupExperiment.controls["DatasourceName"].value,
                            "command": this.formGroupExperiment.controls["Command"].value + " " + this.formGroupExperiment.controls["DatasourceName"].value,
                            "jupiter_notebook": this.formGroupExperiment.controls["Jupiters"].value
                        };
                        break;
                    }
                    case 2 /* Cassandra Keyspace */: {
                        customExperimentObj = {
                            "friendly_name": this.formGroupExperiment.controls["Name"].value,
                            "cores_number": this.formGroupExperiment.controls["Cores"].value,
                            "ram_gb": this.formGroupExperiment.controls["Ram"].value,
                            "cassandra_keyspace": this.formGroupExperiment.controls["DatasourceName"].value,
                            "command": this.formGroupExperiment.controls["Command"].value + " " + this.formGroupExperiment.controls["DatasourceName"].value
                            , "jupiter_notebook": this.formGroupExperiment.controls["Jupiters"].value

                        };

                        break;
                    }
                    case 3 /* Directory Datasource */: {
                        customExperimentObj = {
                            "friendly_name": this.formGroupExperiment.controls["Name"].value,
                            "cores_number": this.formGroupExperiment.controls["Cores"].value,
                            "ram_gb": this.formGroupExperiment.controls["Ram"].value,
                            "cassandra_keyspace": this.formGroupExperiment.controls["DatasourceName"].value,
                            "command": this.formGroupExperiment.controls["Command"].value + " " + this.formGroupExperiment.controls["DatasourceName"].value
                            , "jupiter_notebook": this.formGroupExperiment.controls["Jupiters"].value

                        };
                        break;
                    }

                    default:
                        break;
                }

                const experimentResult = await this._IbidaasService.runNewCustomExperiment(customExperimentObj, +this.projectId < 0 ? this.createdCustomProjectID : +this.projectId);

                if (experimentResult.id) {
                    console.log("ended InitialExperiment");
                    console.log(experimentResult);

                    let experimentStatus = experimentResult.status;

                    setTimeout(async () => {

                        let customExperimentsRes = await this._IbidaasService.getCustomProjectExperiment(+this.projectId);
                        this.grid.data = customExperimentsRes;
                        this.grid.refreshDataSource();

                        this.openSnackBar("Experiment With Id: " + experimentResult.id + " Added for Execution", "OK");
                        this.loadingSpinner = false;

                        this.stepper.previous();

                        while (this.grid.data.find(c => c.status === "running")) {
                            await this.delay(5000);
                            let res = await this._IbidaasService.getCustomProjectExperiment(+this.projectId);
                            this.grid.data = res;
                            this.grid.refreshDataSource();
                        }

                    }, 2000);

                    // while(experimentStatus !== "stopped"){
                    //     await this.delay(10000);
                    //     console.log("running MainExperiment");
                    //     let experimentMainResult = await this._IbidaasService.runNewCustomMainExperiment(
                    //         +this.projectId < 0 ? this.createdCustomProjectID : +this.projectId
                    //     );
                    //     console.log(experimentMainResult);
                    //     if(experimentMainResult.find(c => c.id === experimentResult.id) != null){
                    //         break;
                    //     }else{
                    //         experimentStatus = "running";
                    //     }
                    // }

                    // this.completedAnalysis(experimentResult);

                } else {
                    this.loadingSpinner = false;
                    this.openSnackBar("Failed to run Initial Experiment", "OK");
                    console.log(experimentResult);
                }


            }

        }

    }

    async delay(ms: number) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
    }

    async completedAnalysis(experimentResult: any) {
        this.analysisCompleted = true;
        this.showStartAnalysis = false;
        this.loadingSpinner = false;
        this.analysisGeneratedId = experimentResult.id;

        console.log(experimentResult)

        this.fillExperimentDatasource();

        if (+this.projectId === 1 || +this.projectId === 4) {
            //Add correct header to work
            //this.Histogram = await this._IbidaasService.getHistogram();

            this.Histogram = [{ "count": 0, "people": 17849 }, { "count": 1, "people": 4788 }, { "count": 2, "people": 1036 }, { "count": 3, "people": 214 }, { "count": 4, "people": 57 }, { "count": 5, "people": 27 }, { "count": 6, "people": 4 }, { "count": 7, "people": 1 }];

            this.widgets.wdgStatsVisibility.datasets.today = [
                {
                    label: 'People',
                    data: this.Histogram.map(c => c.people),
                    fill: 'start'
                }
            ]

            this.widgets.wdgStatsVisibility.labels = this.Histogram.map(c => c.count.toString());

            if (this.ADMPriresChart !== undefined) {
                this.ADMPriresChart.chart.destroy();
                this.ADMPriresChart.chart = 0;

                this.ADMPriresChart.datasets = this.widgets.wdgStatsVisibility.datasets.today;
                this.ADMPriresChart.labels = this.widgets.wdgStatsVisibility.labels;
                this.ADMPriresChart.ngOnInit();
            }
        }


        if (+this.projectId === 10 /*Lasso ADM*/) {

            //console.log(this.analysisGeneratedId)

            this.createLassoChart(this.analysisGeneratedId);

            //this.experimentDownloadDetails = await this._IbidaasService.getPreconfiguredExperimentDownloadDetails(this.analysisGeneratedId);


        }

        if (+this.projectId === 12 /* Kmeans Prediction */ || +this.projectId === 13 /* Kmeans Evaluation */) {

            console.log(this.analysisGeneratedId)

            this.setKmeansChartsData(this.analysisGeneratedId);

        }

        this.experimentDownloadDetails = await this._IbidaasService.getPreconfiguredExperimentDownloadDetails(this.analysisGeneratedId);



    }

    async createLassoChart(id) {


        this.lassoADMChartData = await this._IbidaasService.getLassoADMJsonOutData(id);

        let priresLabels = [];

        for (let i = 0; i < this.lassoADMChartData.prires.length; i++) {
            priresLabels.push("" + i);
        }

        let dualresLabels = [];

        for (let i = 0; i < this.lassoADMChartData.dualres.length; i++) {
            dualresLabels.push("" + i);
        }

        if (this.ADMPriresChart !== undefined) {
            this.ADMPriresChart.chart.destroy();
            this.ADMPriresChart.chart = 0;

            this.ADMPriresChart.datasets = [
                {
                    label: 'prires',
                    data: this.lassoADMChartData.prires,
                    fill: 'start'
                }
            ];
            this.ADMPriresChart.labels = priresLabels;
            this.ADMPriresChart.ngOnInit();
        }

        if (this.ADMDualresChart !== undefined) {
            this.ADMDualresChart.chart.destroy();
            this.ADMDualresChart.chart = 0;

            this.ADMDualresChart.datasets = [
                {
                    label: 'dualres',
                    data: this.lassoADMChartData.dualres,
                    fill: 'start'
                }
            ];
            this.ADMDualresChart.labels = dualresLabels;
            this.ADMDualresChart.ngOnInit();
        }
    }



    openUploaderDialog() {
        const dialogConfig = new MatDialogConfig();
        console.log(dialogConfig);
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            title: 'Experiment dialog'
        };

        const dialogRef = this.dialog.open(CustomDialogUploaderComponent, dialogConfig);
        console.log(typeof (dialogRef));
        dialogRef.afterClosed().subscribe(
            dialogResult => {

                this.projectFile = dialogResult;
                console.log(dialogResult);
                console.log(dialogRef);
            }
        );
    }

    downloadCustomExperimentFile() {
        console.log("donwloading File ....");
    }



}
