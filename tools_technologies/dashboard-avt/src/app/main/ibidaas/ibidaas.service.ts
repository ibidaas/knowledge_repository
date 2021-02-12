import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TDFModel, External, AnalyticsAlgorithm, Project } from './ibidaas.interfaces';
import { AppConfigServiceService } from 'app/app-config-service.service';


const TDFModels: TDFModel[] = [
    { value: 'CAIXA Data Model', viewValue: 'CAIXA Data Model' },
    { value: 'CAIXA Data Model V2', viewValue: 'CAIXA Data Model V2' },
    { value: 'CAIXA Data Model V3', viewValue: 'CAIXA Data Model V3' },
    { value: 'CAIXA Data Model V4', viewValue: 'CAIXA Data Model V4' },
    { value: 'CAIXA Data Model V5', viewValue: 'CAIXA Data Model V5' }
];

const Externals: External[] = [
    { value: 'External 1', viewValue: 'External 1' },
    { value: 'External 2', viewValue: 'External 2' },
    { value: 'External 3', viewValue: 'External 3' },
    { value: 'External 4', viewValue: 'External 4' }
];

const AnalyticsAlgorithms: AnalyticsAlgorithm[] = [
    { value: 'Relation Detection From IPs', viewValue: 'Relation Detection From IPs' },
    { value: 'Relation Detection From IPs V1', viewValue: 'Relation Detection From IPs V1' },
    { value: 'Relation Detection From IPs V2', viewValue: 'Relation Detection From IPs V2' },
    { value: 'Relation Detection From IPs V3', viewValue: 'Relation Detection From IPs V3' },
    { value: 'Relation Detection From IPs V4', viewValue: 'Relation Detection From IPs V4' },
    { value: 'Relation Detection From IPs V5', viewValue: 'Relation Detection From IPs V5' }
];

const _Widgets = {
    wdgStatsVisibility: {
        chartType: 'line',
        datasets: {
            'today': [
                {
                    label: 'People',
                    data: [17849, 4788, 1036, 214, 57, 27, 4, 1],
                    fill: 'start'
                }
            ]
        },
        labels: ['0', '1', '2', '3', '4', '5', '6', '7'],
        colors: [
            {
                borderColor: '#3949ab',
                backgroundColor: '#3949ab',
                pointBackgroundColor: '#3949ab',
                pointHoverBackgroundColor: '#3949ab',
                pointBorderColor: '#ffffff',
                pointHoverBorderColor: '#ffffff'
            },
            {
                borderColor: 'rgba(30, 136, 229, 0.87)',
                backgroundColor: 'rgba(30, 136, 229, 0.87)',
                pointBackgroundColor: 'rgba(30, 136, 229, 0.87)',
                pointHoverBackgroundColor: 'rgba(30, 136, 229, 0.87)',
                pointBorderColor: '#ffffff',
                pointHoverBorderColor: '#ffffff'
            }
        ],
        options: {
            spanGaps: false,
            legend: { display: false },
            maintainAspectRatio: false,
            tooltips: { position: 'nearest', mode: 'index', intersect: false },
            layout: { padding: { left: 24, right: 32 } },
            elements: {
                point: {
                    radius: 4,
                    borderWidth: 2,
                    hoverRadius: 4,
                    hoverBorderWidth: 2
                }
            },
            scales: {
                xAxes: [
                    {
                        gridLines: { display: false },
                        ticks: { fontColor: 'rgba(0,0,0,0.54)' }
                    }
                ]
            },
            plugins: {
                filler: { propagate: false }
            }
        }
    }
};

@Injectable()
export class IbidaasService implements Resolve<any> {

    endpointUrl = this.appConfigService.endpointUrl;

    //localhostEndpointUrl = 'http://localhost:3000/';
    ibidaasLiveApiUrl = this.appConfigService.apiBaseUrl + '/api/';
    ibidassLiveHistogram = this.appConfigService.histogramUrl + 'visapi/ibidaasService/webresources/cassandra/histogram';

    PreconfiguredProjects: any[] = [
        {
            "id": 1,
            "friendly_name": "CAIXA: Analysis of relationships through IP addresses (Batch processsing)",
            "name": "CAIXA: Analysis of relationships through IP address - Batch processsing (fabricated data)",
            "description": "The CAIXA IP Addresses Use Case is about extracting relations between IP addresses. In this use case batch processing of big data emerges as an innovative tool that can be  instrumental in fraud detection.",
            "datasource": "keys",
            "status": "open",
            "routerLink": "/projectnew/2/1",
            "img": "/assets/images/caixa_batch.png",
            "alt": "Photo of a I-BiDaaS",
            "params": [
                // {
                //     "label": "Period", 
                //     "name":"cond", 
                //     "type": "list", 
                //     "datasource" : [
                //         {"viewValue":"Month","value":"m"},
                //         {"viewValue":"Week","value":"w"},
                //         {"viewValue":"Day","value":"d"}
                //     ]
                // } 				    
            ],
            "created_at": "2018-12-12 10:33:38",
            "updated_at": "2018-12-12 10:33:38"
        },
        {
            "id": 2,
            "friendly_name": "CAIXA: Analysis of relationships through IP addresses (Stream processsing)",
            "name": "CAIXA: Analysis of relationships through IP address - Stream processsing",
            "description": "The CAIXA IP Addresses Use Case in streaming mode allows for real-time IP relationship detection on incoming data and also the graph representation of relationships among the IPs.",
            "datasource": "no",
            "status": "open",
            "routerLink": "/caixastreamprocessing/2/2",
            "img": "/assets/images/caixa_streaming.jpg",
            "alt": "Photo of a I-BiDaaS",
            "params": [],
            "created_at": "2018-12-12 12:03:36",
            "updated_at": "2018-12-12 12:37:52"
        },
        {
            "id": 3,
            "friendly_name": "CRF: Production process of aluminium die-casting (Stream processsing)",
            "name": "FIAT use case",
            "description": "The use case deals with monitoring the quality of the production process of aluminium casting. The goal is to use Big Data for improving the quality of the production process and operational efficiency, in particular, the quality issues on the automotive component",
            "datasource": "no",
            "status": "open",
            "routerLink": "/fiatcrf/2/3",
            "img": "/assets/images/crf_streaming.jpg",
            "alt": "Photo of a I-BiDaaS",
            "params": [],
            "created_at": "2019-02-26 09:23:03",
            "updated_at": "2019-02-26 09:23:03"
        },
        {
            "id": 4,
            "friendly_name": "CAIXA: Analysis of relationships through IP addresses (Batch processsing)",
            "name": "CAIXA: Analysis of relationships through IP address - Batch processsing  (tokenized data)",
            "description": "The CAIXA IP Addresses Use Case is an application  of the I-BiDaaS ideas and tools extracting relations between IP addresses. In this use case batch processing of big data emerges as an innovative tool that can be  instrumental in fraud detection.",
            "datasource": "keys",
            "status": "open",
            "routerLink": "/projectnew/2/4",
            "img": "/assets/images/ibidaasHome.jpg",
            "alt": "Photo of a I-BiDaaS",
            "params": [],
            "created_at": "2018-12-12 10:33:38",
            "updated_at": "2018-12-12 10:33:38"
        },
        {
            "id": 5,
            "friendly_name": "TID: Quality of Service in Call Centres (Stream Processing)",
            "name": "Telefonica CC",
            "description": "The use case is about monitoring the sentiment of callers to Telefonica's call centres. Using GPU accelerated processing and real-time visualisations of sentiment and frequent words in calls, better analysis and increased performance are envisaged.",
            "datasource": "none",
            "status": "open",
            "routerLink": "/telefonica/livestats",
            "img": "/assets/images/call_center.png",
            "alt": "Photo of a telefonica in Spain",
            "params": [],
            "created_at": "2019-06-17 09:09:05",
            "updated_at": "2019-06-17 09:09:05"
        },
        {
            "id": 6,
            "friendly_name": "TID: Optimization of placement of telecommunication equipment (Batch Processing)",
            "name": "Telefonica Mobility",
            "description": "This case concerns the monitoring of the load percentages of Telefonica's antennas over a period of time in order to observe and therefore to predict possible congestions caused by the users' movement around an area.",
            "datasource": "none",
            "status": "open",
            "routerLink": "/telefonica/mobility",
            "img": "/assets/images/mobility.png",
            "alt": "Photo of a telefonica in Spain",
            "params": [],
            "created_at": "2020-05-13 11:44:01",
            "updated_at": "2020-05-13 11:44:01"
        },
        {
            "id": 7,
            "friendly_name": "TID: Accurate location prediction with high traffic and visibility (Stream Processing)",
            "name": "Telefonica KPI",
            "description": "This use case demonstrates high accuracy predictions of Telefonica's antennas that will become the next 'hotspots', i.e. will have increased load.",
            "datasource": "none",
            "status": "open",
            "routerLink": "/telefonica/kpis",
            "img": "/assets/images/kpis.png",
            "alt": "Photo of a telefonica in Spain",
            "params": [],
            "created_at": "2020-07-10 13:06:02",
            "updated_at": "2020-07-10 13:06:02"
        },
        {
            "id": 8,
            "friendly_name": "CRF: Maintenance and monitoring of production assets (Batch Processing)",
            "name": "FIAT use case",
            "description": "In this use case, sensor data have been analysed in order to identify anomalies in the measured values. Monitoring these anomalies can help operators perform predictive maintenance tasks and avoid sensor breakdowns.",
            "datasource": "no",
            "status": "open",
            "routerLink": "/fiatcrf/maintenance",
            "img": "/assets/images/crf-maintenance.JPG",
            "alt": "Photo of a I-BiDaaS",
            "params": [],
            "created_at": "2020-07-16 17:14:09",
            "updated_at": "2020-07-16 17:14:09"
        },
        {
            "id": 9,
            "friendly_name": "CAIXA: Enhance control of customers to online banking access (Stream Processing)",
            "name": "CAIXA OnlineBanking",
            "description": "This use cases focuses on analyzing the online mobile-to-mobile bank transfers. It's main objectives are to identify usage patterns and enhance the current security identifying the set of transactions in which we should increase the level of authentication.",
            "datasource": "no",
            "status": "open",
            "routerLink": "/onlinebanking",
            "img": "/assets/images/caixa_onlinebank.png",
            "alt": "Photo of a I-BiDaaS",
            "params": [],
            "created_at": "2020-09-15 14:11:11",
            "updated_at": "2020-09-15 14:11:11"
        },
        {
            "id": 10,
            "friendly_name": "LASSO ADMM",
            "name": "General Data Analyses - ADMM FLOSS",
            "description": "Least Absolute Shrinkage and Selection Operator algorithm for regression analysis, solved in a distributed manner. The LASSO model uses L1 regularization to induce sparsity and prevent overfitting of the model.",
            "datasource": "dir",
            "status": "open",
            "routerLink": "/projectnew/2/10",
            "img": "/assets/images/self-service/lasso2.jpg",
            "alt": "Photo of a I-BiDaaS",
            "params": [
                { "label": "Penalty in the Augmented Lagrangian used in the ADMM algorithm", "name": "rho", "type": "number", "defaultValue": 1, "obligatory": true },
                { "label": "The number of chunks data is split in (commonly also the number of workers since one worker usually maintains one data chunk)", "name": "n", "type": "number", "defaultValue": 3, "obligatory": true },
                { "label": "Absolute Tolerance (used to compute the threshold for early termination of the algorithm)", "name": "abstol", "type": "number", "defaultValue": 0.0001, "obligatory": true },
                { "label": "Relative Tolerance (used to compute the threshold for early termination of the algorithm)", "name": "reltol", "type": "number", "defaultValue": 0.01, "obligatory": true },
                { "label": "Maximum number of iterations prior to automatic termination", "name": "max_iter", "type": "number", "defaultValue": 500, "obligatory": true },
                { "label": "Tuning parameter λ (amount of shrinkage)", "name": "lmbd", "type": "number", "defaultValue": 0.001, "obligatory": true },
            ],
            "created_at": "2019-07-19 08:38:24",
            "updated_at": "2019-07-19 08:38:24"
        },
        {
            "id": 12,
            "friendly_name": "K-means - Prediction",
            "name": "K-means Prediction",
            "description": "The objective of K-means Prediction is to group similar data points together in a user-specified number of clusters (K)",
            "datasource": "file",
            "datasourceInputDefaultValue": "/root/general/users/stamatis/data/data_single.csv",
            "status": "open",
            "routerLink": "/projectnew/2/12",
            "img": "/assets/images/self-service/kmeans-pre.png",
            "alt": "Photo of a I-BiDaaS",
            "params": [
                { "label": "Number of clusters (K)", "name": "clusters", "type": "number", "defaultValue": 10 },
                { "label": "Maximum number of iterations prior to automatic termination", "name": "max_iter", "type": "number", "defaultValue": 10 },
                { "label": "Tolerance (used to compute the threshold for early termination of the algorithm)", "name": "tol", "type": "number", "defaultValue": 0.0001 },
                { "label": "Chunck size of each chunk (concerns the splitting of our data into chunks, not K-means directly)", "name": "subset_size", "type": "number", "defaultValue": 300 },
                { "label": "Portion of data to be treated as the test data (remaining data will be used for training)", "name": "test_size", "type": "number", "defaultValue": 0.2 }
            ],
            "created_at": "2019-07-19 08:39:46",
            "updated_at": "2019-07-19 08:39:46"
        },
        {
            "id": 13,
            "friendly_name": "K-means - Evaluation",
            "name": "K-means Evaluation",
            "description": "The objective of this algorithm is to evaluate the efficiency and the accuracy of the clusters created by the K-means Prediction algorithm. ",
            "datasource": "file",
            "datasourceInputDefaultValue": "/root/general/users/stamatis/data/data_single.csv",
            "status": "open",
            "routerLink": "/projectnew/2/13",
            "img": "/assets/images/self-service/kmeans-ev.png",
            "alt": "Photo of a I-BiDaaS",
            "params": [
                {
                    "label": "Number of clusters (K)",
                    "name": "clusters",
                    "type": "number",
                    "defaultValue": 10
                },
                {
                    "label": "Maximum number of iterations prior to automatic termination",
                    "name": "max_iter",
                    "type": "number",
                    "defaultValue": 10
                },
                {
                    "label": "Tolerance (used to compute the threshold for early termination of the algorithm)",
                    "name": "tol",
                    "type": "number",
                    "defaultValue": 0.0001
                },
                {
                    "label": "Portion of data to be treated as the test data (remaining data will be used for training)",
                    "name": "test_size",
                    "type": "number",
                    "defaultValue": 0.2
                },
                {
                    "label": "Chunck size of each chunk (concerns the splitting of our data into chunks, not K-means directly)",
                    "name": "subset_size",
                    "type": "number",
                    "defaultValue": 300
                }
            ],
            "created_at": "2019-07-19 08:39:46",
            "updated_at": "2019-07-19 08:39:46"
        },

        {
            "id": 14,
            "friendly_name": "Random Forest",
            "name": "Random Forest",
            "description": "Random forests is an ensemble learning method for classification, regression and other tasks that operate by constructing a multitude of decision trees at training time and outputting the class that is the mode of the classes (classification) or mean prediction (regression) of the individual trees.",
            "datasource": "file",
            "status": "open",
            "routerLink": "/projectnew/2/14",
            "img": "/assets/images/self-service/random-forest.png",
            "alt": "Photo of a I-BiDaaS",
            "params": [
                { "label": "The maximum depth of the tree (number). If 'Infinity', then nodes are expanded until all leaves are pure.", "name": "md", "type": "number", "defaultValue": Infinity },
                { "label": "Number of trees to fit (number).", "name": "n", "type": "number", "defaultValue": 10 },
                { "label": "If True, it uses majority voting over the predict() result of the decision tree predictions. If False, it takes the class with the higher probability given by predict_proba(), which is an average of the probabilities given by the decision trees.", "name": "hv", "type": "boolean", "defaultValue": "false" }
            ],
            "created_at": "2020-05-19 10:08:45",
            "updated_at": "2020-05-19 10:08:45"
        },
        {
            "id": 16,
            "friendly_name": "Decision Tree",
            "name": "Decision Tree",
            "description": "A decision tree is a decision support tool that uses a tree-like model of decisions and their possible consequences, including chance event outcomes, resource costs, and utility. It is one way to display an algorithm that only contains conditional control statements.",
            "datasource": "file",
            "status": "open",
            "routerLink": "/projectnew/2/16",
            "img": "/assets/images/self-service/decision-tree.png",
            "alt": "Photo of a I-BiDaaS",
            "params": [
                { "label": "The maximum depth of the tree (number). If 'Infinity', then nodes are expanded until all leaves are pure.", "name": "md", "type": "number", "defaultValue": 2 },
                { "label": "The number of features to consider when looking for the best split.", "name": "tf", "type": "number", "defaultValue": 10 },
                { "label": "Number of levels of the tree in which the nodes are split in a distributed way.", "name": "distr_depth", "type": "number", "defaultValue": 2 },
                { "label": "Maximum size of the arrays passed to sklearn’s DecisionTreeClassifier.fit(),which is called to fit subtrees of our DecisionTreeClassifier. sklearn fit() is used because it’s faster, but requires loading the data to memory,which can cause memory problems for large datasets.This parameter can be adjusted to fit the hardware capabilities.", "name": "sklearn_max", "type": "number", "defaultValue": 2 },
                { "label": "Bootstrap", "name": "bootstrap", "type": "boolean", "defaultValue": "false" }
            ],
            "created_at": "2020-05-20 11:13:55",
            "updated_at": "2020-05-20 11:13:55"
        },

    ];

    private _jsonKmeansData = '../../../../assets/kmeans.json';

    // private _jsonKmeansOutData =  '../../../../assets/out_kmeans.json';

    private _jsonOutData = this.appConfigService.apiBaseUrl + '/api/experiment/output/';

    private _jsonKmeansOutDataEvaluation = '../../../../assets/out_single_file.json';

    private _jsonLassoADMOutData = '../../../../assets/out_admm.json';

    constructor(private _httpClient: HttpClient, private appConfigService: AppConfigServiceService) { }

    getAllWidgets(): any {
        return _Widgets;
    }

    getTDFModels(): any[] {
        return TDFModels;
    }

    getExternals(): External[] {
        return Externals;
    }

    getAnalyticsAlgorithms(): AnalyticsAlgorithm[] {
        return AnalyticsAlgorithms;
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getWidgets()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * 
     *
     * @returns {Promise<any>}
     */
    getAllJupiters(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'jupiter-notebooks')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get('api/analytics-dashboard-widgets')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Projects 
     *
     * @returns {Promise<any>}
     */
    //JsonServer Version
    // getAllProjects(processingType: number = 1): Promise<any> {

    // 	return new Promise((resolve, reject) => {
    //         this._httpClient.get(this.endpointUrl + 'ibidaasprojects/?ProcessingType=' + processingType)
    //             .subscribe((response: any) => {
    //                 resolve(response);
    //             }, reject);
    //     });

    // }

    getAllProjects(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'project')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get Models
     *
     * @returns {Promise<any>}
     */
    getAllModels(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.endpointUrl + 'ibidaasmodels')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Params
     *
     * @returns {Promise<any>}
     */
    getAllParams(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.endpointUrl + 'ibidaasparams')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get All Experiments
     *
     * @returns {Promise<any>}
     */
    getAllExperiments(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.endpointUrl + 'ibidaaexperiments')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Experiments By Project ID
     *
     * @returns {Promise<any>}
     */
    getExperiment(projectID: number): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'project/experiments/' + projectID)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Custom Project Experiments By Project ID
     *
     * @returns {Promise<any>}
     */
    getCustomProjectExperiment(projectID: number): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'custom-project/experiments/' + projectID)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }


    /**
     * Run Initial Experiment
     *
     * @returns {Promise<any>}
     */
    runInitialExperiment(algorithmID): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'experiment/run/' + algorithmID)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Run Main Experiment
     *
     * @returns {Promise<any>}
     */
    runMainExperiment(mainExperimentID): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'experiment/' + mainExperimentID)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Run Experiment
     *
     * @returns {Promise<any>}
     */
    runNewExperiment(experiment, mainExperimentID): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.ibidaasLiveApiUrl + 'experiment/run/' + mainExperimentID, experiment)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject => {
                    resolve(reject);
                });
        });

    }

    /**
     * Run Main Experiment
     *
     * @returns {Promise<any>}
     */
    runNewMainExperiment(mainExperimentID): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'experiment/' + mainExperimentID)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Custom Experiment Downloading Details
     *
     * @returns {Promise<any>}
     */
    getCustoExperimentDownloadDetails(id: any) {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'custom-experiment/download/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get Preconfigured Experiment Downloading Details
     *
     * @returns {Promise<any>}
     */
    getPreconfiguredExperimentDownloadDetails(id: any) {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'experiment/download/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Run Custom Experiment
     *
     * @returns {Promise<any>}
     */
    runNewCustomExperiment(experiment, mainExperimentID): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.ibidaasLiveApiUrl + 'custom-experiment/run/' + mainExperimentID, experiment)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject => {
                    resolve(reject);
                });
        });
    }

    /**
     * Get Input Files
     *
     * @returns {Promise<any>}
     */
    getInputFiles() {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'input-files')
                .subscribe((response: any[]) => {
                    resolve(response);
                }, reject);
        });
    }


    /**
     * Get KeySpaces
     *
     * @returns {Promise<any>}
     */
    getKeySpaces() {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'keyspaces')
                .subscribe((response: any[]) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get Directory Datasource
     *
     * @returns {Promise<any>}
     */
    getDirectoryDatasources() {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'input-dirs')
                .subscribe((response: any[]) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Run Custom Main Experiment
     *
     * @returns {Promise<any>}
     */
    runNewCustomMainExperiment(mainExperimentID): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'custom-project/experiments/' + mainExperimentID)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }


    /**
     * Get Histogram
     *
     * @returns {Promise<any>}
     */
    getHistogram(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidassLiveHistogram)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Preconfigured Projects
     *
     * @returns {Promise<any>}
     */
    getPreconfiguredProjects(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.PreconfiguredProjects);
        });

    }

    /**
     * Get Preconfigured Projects by ID
     *
     * @returns {Promise<any>}
     */
    getPreconfiguredProjectsByID(id): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.PreconfiguredProjects.find(c => c.id === id));
        });
    }

    /**
     * Get Custom Projects
     *
     * @returns {Promise<any>}
     */
    getCustomProjects(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'custom-project')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Remove Custom Projects
     *
     * @returns {Promise<any>}
     */
    removeCustomProject(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(this.ibidaasLiveApiUrl + 'custom-project/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Remove Experiment
     *
     * @returns {Promise<any>}
     */
    removeExperiment(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(this.ibidaasLiveApiUrl + 'experiment/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Remove Custom Experiment
     *
     * @returns {Promise<any>}
     */
    removeCustomExperiment(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(this.ibidaasLiveApiUrl + 'custom-experiment/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Stop Custom Experiment
     *
     * @returns {Promise<any>}
     */
    stopCustomExperiment(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'custom-experiment/stop/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Get Custom Project
     *
     * @returns {Promise<any>}
     */
    getCustomProject(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.ibidaasLiveApiUrl + 'custom-project/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Save Experiment
     *
     * @returns {Promise<any>}
     */
    saveExperiment(data: any): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.endpointUrl + 'ibidaaexperiments', JSON.stringify(data), { headers: headers })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });

    }

    /**
     * Save new project to database
     *
     * @returns {Promise<any>}
     */
    saveProject(project: any): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.ibidaasLiveApiUrl + 'custom-project', project)
                .subscribe((response: any) => {
                    resolve(response);
                }, (reject: any) => {
                    resolve(reject)
                });
        });

    }

    /**
     * Get Kmeans Json Data
     *
     * @returns {Promise<any>}
     */
    getKmeansJsonData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this._jsonKmeansData)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get Kmeans Json Out Data Prediction
     *
     * @returns {Promise<any>}
     */
    getKmeansJsonOutDataPrediction(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this._jsonOutData + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get Kmeans Json Out Data Evaluation
     *
     * @returns {Promise<any>}
     */
    getKmeansJsonOutDataEvaluation(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this._jsonOutData + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }


    /**
     * Get Lasso ADM Json Out Data
     *
     * @returns {Promise<any>}
     */
    getLassoADMJsonOutData(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this._jsonOutData + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get Kmeans Json Out Data Bar Chart Options
     *
     * @returns {baseChart options}
     */
    getKmeansJsonOutBarChartOpt(labels: any[] = ["Cluster 1", "Cluster 2", "Cluster 3"], data: any[] = [40, 59, 35]) {
        return {
            chartType: 'bar',
            datasets: [
                {
                    "label": "Points",
                    "data": data,
                    "fill": false,
                    "borderWidth": 1
                }
            ],
            labels: labels,
            colors: [{
                "backgroundColor": ["#1F77B5", "#FF7E0E", "#2D9F2C", "#D62828", "#9466BE", "#54354c", "#57ebdc", "#b0b7b8"],
                "borderColor": ["#1F77B5", "#FF7E0E", "#2D9F2C", "#D62828", "#9466BE", "#54354c", "#57ebdc", "#b0b7b8"]
            }],
            options: {
                legend: { display: false },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        barPercentage: 0.5,
                        barThickness: 20,
                        maxBarThickness: 20,
                        minBarLength: 10,
                        gridLines: {
                            offsetGridLines: true
                        }
                    }],
                    yAxes: [{ ticks: { beginAtZero: true } }]
                }
            }
        }
    }
}
