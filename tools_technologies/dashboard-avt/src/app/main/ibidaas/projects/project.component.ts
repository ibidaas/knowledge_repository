import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { MatStepper } from '@angular/material/stepper';

import { CustomDialogComponent } from '@fuse/dialog/custom-dialog.component';

import { CustomDialogUploaderComponent } from '../dialogs/custom-dialog-uploader.component';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../i18n/en';
import { locale as greek } from '../../../i18n/el';

import { fuseAnimations } from '@fuse/animations';
import { IbidaasService } from '../ibidaas.service';
import { TDFModel, External, AnalyticsAlgorithm, ProjectiBiDaas } from '../ibidaas.interfaces';
import { ProcessingType, AnalysisAlgorithms, FabricationModels } from '../Enums/ibidaas.enum';

import { FieldConfig } from "@fuse/xModule/xForm/field.interface";
import { XGridComponent } from "@fuse/xModule/xGrid/xGrid.component";

export interface Element {
	name: string;
    id: number;
    type: number;
    date: string;
    data: any[];
    projectID: number;
}

@Component({
    selector   : 'project',
    templateUrl: './project.component.html',
	styleUrls: ['../ibidaas.scss'],
    animations   : fuseAnimations
})
export class ProjectComponent implements OnInit {
	
    @ViewChild('stepper') stepper: MatStepper;

    @ViewChild(XGridComponent) grid: XGridComponent;    
	
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
	
	columns = [
		{ columnDef: 'id',   header: 'A/A',    cell: (element: Element) => `${element.id}`},
		{ columnDef: 'name', header: 'Name',   cell: (element: Element) => `${element.name}`},
		{ columnDef: 'date', header: 'Date', cell: (element: Element) => `${element.date}`}
    ];

    isLinear = true;
    projectId: number;
    projectTypeId: number;
    
	formGroupFabrication: FormGroup;
	formGroupAnalysis: FormGroup;

    AllModels: any[] = [];
    AllParams: any[] = [];

    // TDFModels: TDFModel[] = [];
    FabricationModelValue = null;
    AnalysisModelValue = null;

	FabricationModels: any[] = [];
    Params: any[] = [];
    ParamsAnalysis: any[] = [];
	Externals: any[] = [];
    AnalysisAlgorithms: any[] = [];
    Histogram: any[] = [];
    
    selectedExperiment: any = null;

	selectedDay = 'today';
    widgets: any = {};

    fabricationGeneratedId: number = 3705;
    analysisGeneratedId: number = 1111;
    
    isReadOnly: boolean = true;

    fabricationCompleted: boolean = false;
    analysisCompleted: boolean = false;

    loadingSpinner: boolean = false;
	
    constructor(
        private route: ActivatedRoute,
        private router: Router,
		private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _IbidaasService: IbidaasService,
        private dialog: MatDialog,
    )
    {
        if (!sessionStorage.getItem('user')) {
            this.router.navigateByUrl('/auth');
        }

        this._fuseTranslationLoaderService.loadTranslations(english, greek);
        //this._registerCustomChartJSPlugin();
        
        this.formGroupFabrication = this._formBuilder.group({
			FabricationModelCtrl: ['', Validators.required],
			ExternalCtrl: ['']
        });

        this.formGroupAnalysis = this._formBuilder.group({
			AnalysisAlgorithmsCtrl: ['', Validators.required]
        });

        this.widgets = this._IbidaasService.getAllWidgets();

    }
	
	ngOnInit() {

        this.route.params.subscribe(params => {

            const selectedFabrModel = 1;

            this.isReadOnly = (params['id'] > 0 ? true : false);
            this.projectId = params['id'];
            this.projectTypeId = params['typeId'];

            this._IbidaasService.getAllParams().then(allParams => {

                this.AllParams = allParams;
    
                this._IbidaasService.getAllModels().then(models => {

                    this.FabricationModels = models
                    .filter(
                        m => m.Type === 1 
                        && m.Id !== FabricationModels.CAIXADataModel 
                        && m.Id !== FabricationModels.CAIXADataModel2
                        );
                        
                    this.AnalysisAlgorithms = models.filter(m => m.Type === 2);

                    if (this.isReadOnly) {                        
                        //this.formGroupFabrication.get("FabricationModelCtrl").value = selectedFabrModel;
                        this.FabricationModels = models.filter(m => m.Type === 1);

                        this.formGroupFabrication.patchValue({ FabricationModelCtrl : selectedFabrModel });
        
                        this.formGroupFabrication.controls["FabricationModelCtrl"].disable();
            
                        const filteredModels = this.FabricationModels.find(m => m.Id === selectedFabrModel);
                        const paramsIds: number[] = filteredModels.Params.split(',').map(p => +p);
        
                        this.setModels(selectedFabrModel);
                        
                        for (const _param of this.AllParams.filter(p => paramsIds.indexOf(p.Id) !== -1)) {
                            //this.formGroupFabrication.get(_param.Name).value = 3;
                            this.formGroupFabrication.patchValue({ [_param.Name] : selectedFabrModel });
                            this.formGroupFabrication.controls[_param.Name].disable();
                        }
                    }

                });
    
            });
            
            this._IbidaasService.getExperiment(params['id']).then(experiments => {
                this.grid.data = experiments;
                this.grid.refreshDataSource();
            })

        });
                
    }

	change(e) {
        this.setModels(e.source.value);
    }

    setModels(e) {


        // for(let control in this.formGroupFabrication.controls){
        //     if(control !== "FabricationModelCtrl" && control !== "ExternalCtrl"){
        //         this.formGroupFabrication.removeControl(control);
        //     }
        // };

        const filteredModels = this.FabricationModels.find(m => m.Id === e);
        const paramsIds: number[] = filteredModels.Params.split(',').map(p => +p);

        this.Params = this.AllParams.filter(p => paramsIds.indexOf(p.Id) !== -1);

        for (const _param of this.Params) {
            this.formGroupFabrication.addControl(_param.Name, new FormControl('', Validators.required));
        }

    }

    changeAlgorithm(e) {

        if(e.value === AnalysisAlgorithms.UploadYourOwnAlgoritmh){
            this.openUploaderDialog();
        }else{
            this.setModelsAnalysis(e.source.value);
        }
    }    

    setModelsAnalysis(e) {

        const filteredModels = this.AnalysisAlgorithms.find(m => m.Id === e);
        const paramsIds: number[] = filteredModels.Params.split(',').map(p => +p);

        this.ParamsAnalysis = this.AllParams.filter(p => paramsIds.indexOf(p.Id) !== -1);

        for (const _param of this.ParamsAnalysis) {
            this.formGroupAnalysis.addControl(_param.Name, new FormControl('', Validators.required));
        }

    }

    startFabrication() {
        if(this.formGroupFabrication.valid){
            this.loadingSpinner = true;
            setTimeout(() => {
                this.fabricationGeneratedId = Math.floor(Math.random() * 9999) + 1111;
                this.fabricationCompleted = true;
                this.loadingSpinner = false;
            }, 3000);
        }
    }

    async startAnalysis() {
        if(this.formGroupAnalysis.valid){
            
            this.loadingSpinner = true;

            console.log("running InitialExperiment");
            const experimentResult = await this._IbidaasService.runInitialExperiment(1);
            console.log("ended InitialExperiment");
            console.log(experimentResult);
            let experimentStatus = experimentResult.status;

            while(experimentStatus !== "stopped"){
                await this.delay(10000);
                console.log("running MainExperiment");
                let experimentMainResult = await this._IbidaasService.runMainExperiment(experimentResult.id);
                console.log(experimentMainResult);
                if(experimentMainResult.status){
                    experimentStatus = experimentMainResult.status;
                }else{
                    break;
                }
            }

            this.analysisGeneratedId = experimentResult.id;

            //Add correct header to work
            this.Histogram = await this._IbidaasService.getHistogram();

            //[{"count":0,"people":17849},{"count":1,"people":4788},{"count":2,"people":1036},{"count":3,"people":214},{"count":4,"people":57},{"count":5,"people":27},{"count":6,"people":4},{"count":7,"people":1}];
            
            this.widgets.wdgStatsVisibility.datasets.today = [
                {
                    label: 'People',
					data :  this.Histogram.map(c => c.people),
					fill : 'start'
                }
            ]
            
            this.widgets.wdgStatsVisibility.labels = this.Histogram.map(c => c.count.toString());

            this.analysisCompleted = true;
            this.loadingSpinner = false;

            // setTimeout(() => {
            //     this.analysisGeneratedId = Math.floor(Math.random() * 9999) + 1111;
            //     this.analysisCompleted = true;
            //     this.loadingSpinner = false;
            // }, 3000);
        }
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
    }

    experimentRowClicked(e) {

        this.selectedExperiment = this.grid.data.find(c => c.id === e.id); //e.Id;
        this.stepper.next();

        this.formGroupAnalysis.patchValue({ AnalysisAlgorithmsCtrl : this.selectedExperiment.type });

        this.formGroupAnalysis.controls["AnalysisAlgorithmsCtrl"].disable();

        const paramsIds: number[] = this.selectedExperiment.data.map(p => +p.paramId);

        this.ParamsAnalysis = this.AllParams.filter(p => paramsIds.indexOf(p.Id) !== -1);

        for (const _param of this.ParamsAnalysis) {

            if(this.formGroupAnalysis.controls[_param.Name]){
                this.formGroupAnalysis.patchValue({ [_param.Name] :  this.selectedExperiment.data.find( p => p.paramId === _param.Id).value });
            } else{
                this.formGroupAnalysis.addControl(_param.Name, new FormControl(this.selectedExperiment.data.find( p => p.paramId === _param.Id).value, Validators.required));
            }

            this.formGroupAnalysis.controls[_param.Name].disable();

        }
    }

    async openDialog(){
		const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            id: 1,
            title: 'Experiment dialog'
        };

        //this.dialog.open(CustomDialogComponent, dialogConfig);
        
        const dialogRef = this.dialog.open(CustomDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            dialogResult =>{
                if(dialogResult){
                    // if(+this.projectId < 0){ // Is new project
                    //     let projectName = " ";
                    //     if(+this.projectTypeId === ProcessingType.BatchProcesssing){
                    //         projectName = "CAIXA: Analysis of relationships through IP address - Batch processsing";
                    //     } else{
                    //         projectName = "CAIXA: Analysis of relationships through IP address - Stream processsing";
                    //     }

                    //     this._IbidaasService.saveProject({"name": projectName}).then( result => {
                    //         console.log(result);
                    //         this.projectId = result.id;
                    //         this.saveExperiment(dialogResult);
                    //         this.router.navigateByUrl('/projects/'+ this.projectTypeId);
                    //     })
                    // } else{
                        this.saveExperiment(dialogResult);
                        this.router.navigateByUrl('/projects/'+ this.projectTypeId);
                    // }
                }
            } 
        );    
    }

    openUploaderDialog(){
		const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            title: 'Experiment dialog'
        };

        const dialogRef = this.dialog.open(CustomDialogUploaderComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            dialogResult =>{
                if(dialogResult)
                    {
                        this.setModelsAnalysis(3);
                    }
                else{
                    this.formGroupAnalysis.patchValue({ AnalysisAlgorithmsCtrl : undefined });
                }
            } 
        );    
    }

    saveExperiment(dialogResult: any){
        const experiment: Element = {
            name: dialogResult.experimentName,
            id: this.analysisGeneratedId, //Math.max.apply(Math, this.grid.data.map(function(o) { return o.id; })) + 1,
            date: dialogResult.experimentDate.toString(),
            type: this.formGroupAnalysis.controls["AnalysisAlgorithmsCtrl"].value,
            data: this.getAnalysisAlgorithmParams(),
            projectID: +this.projectId
        };
        
        this._IbidaasService.saveExperiment(experiment).then( expResult => {
            console.log(expResult);
        });
        
    }
    
    getAnalysisAlgorithmParams(): any[]{
        let paramsArray = [];
        for(let control of Object.keys(this.formGroupAnalysis.controls)){
            const param = this.AllParams.find(p => p.Name === control);
            if(param){
                paramsArray.push({
                    "paramId": param.Id,
                    "value" : +this.formGroupAnalysis.controls[control].value
                  });
            }
        }

        return paramsArray;
    }

    addNewExperiment(){
        this.ParamsAnalysis = this.AllParams;

        for (const _param of this.ParamsAnalysis) {
            if(this.formGroupAnalysis.controls[_param.Name]){
                this.formGroupAnalysis.removeControl(_param.Name);
                //this.formGroupAnalysis.patchValue({ [_param.Name] : null });
                //this.formGroupAnalysis.controls[_param.Name].enable();
            }
        }

        this.ParamsAnalysis = [];

        this.formGroupAnalysis.patchValue({ AnalysisAlgorithmsCtrl : null });

        this.formGroupAnalysis.controls["AnalysisAlgorithmsCtrl"].enable();

        this.formGroupAnalysis.clearValidators();

        this.selectedExperiment = null;

        this.analysisCompleted = false;
  
    }

    downloadConfigAnalysis(){
        let algorithmConfig = {
            "Analysis Algorithm": this.AnalysisAlgorithms.find(c => c.Id === this.formGroupAnalysis.value.AnalysisAlgorithmsCtrl).Title
        };

        for (let param in this.formGroupAnalysis.value){
            if(param !== "AnalysisAlgorithmsCtrl"){
                Object.assign(algorithmConfig, { [param] : this.formGroupAnalysis.value[param] });
            }
        }

        this.downloadAsJson(algorithmConfig, "AnalysisAlgorithmConfig");
    }

    private downloadAsJson(keys: any, filename: string) {
        const ordered = {};
        Object.keys(keys).sort().forEach(function(key) { ordered[key] = keys[key]; });
        const sJson = JSON.stringify(ordered,null,'\t');
        const element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
        element.setAttribute('download', filename + ".json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
    }
	
	private _registerCustomChartJSPlugin(): void {

		(<any>window).Chart.plugins.register({
			afterDatasetsDraw: function (chart, easing): any {
				// Only activate the plugin if it's made available
				// in the options
				if (
					!chart.options.plugins.xLabelsOnTop ||
					(chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
				)
				{
					return;
				}

				// To only draw at the end of animation, check for easing === 1
				const ctx = chart.ctx;
             
				chart.data.datasets.forEach(function (dataset, i): any {
					const meta = chart.getDatasetMeta(i);
					if ( !meta.hidden )
					{
						meta.data.forEach(function (element, index): any {

							// Draw the text in black, with the specified font
							ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
							const fontSize = 13;
							const fontStyle = 'normal';
							const fontFamily = 'Roboto, Helvetica Neue, Arial';
							ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

							// Just naively convert to string for now
							const dataString = dataset.data[index].toString() + 'k';

							// Make sure alignment settings are correct
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							const padding = 15;
							const startY = 24;
							const position = element.tooltipPosition();
							ctx.fillText(dataString, position.x, startY);

							ctx.save();

							ctx.beginPath();
							ctx.setLineDash([5, 3]);
							ctx.moveTo(position.x, startY + padding);
							ctx.lineTo(position.x, position.y - padding);
							ctx.strokeStyle = 'rgba(255,255,255,0.12)';
							ctx.stroke();

							ctx.restore();
						});
					}
				});
			}
		});
	}
	
}
