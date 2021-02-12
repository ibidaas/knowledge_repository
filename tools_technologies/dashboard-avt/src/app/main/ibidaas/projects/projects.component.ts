import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../../i18n/en';
import { locale as greek } from '../../../i18n/el';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { IbidaasService } from '../ibidaas.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Project, ProjectiBiDaas } from '../ibidaas.interfaces';
import { ProcessingType } from '../Enums/ibidaas.enum';

@Component({
    selector   : 'projects',
    templateUrl: './projects.component.html',
	styleUrls: ['../ibidaas.scss']
})
export class ProjectsComponent {
	
	//displayedColumns: string[] = ['select', 'Id', 'Name', 'Active', 'Buttons'];
	displayedColumns: string[] = ['Id', 'Name', 'Status', 'Created', 'Buttons'];
	dataSource: any = {};
	selection = new SelectionModel<ProjectiBiDaas>(true, []);
	
	private sub: any;
	
	projects: any[] = [];
	processingType: number = 1;
	processingTypeLabel: string = "Batch Processing";
	
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

    constructor(
		private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
		private _IbidaasService: IbidaasService,
		private route: ActivatedRoute
    )
    {
		if (!sessionStorage.getItem('user')) {
            this.router.navigateByUrl('/auth');
        }
        this._fuseTranslationLoaderService.loadTranslations(english, greek);		
    }
	
	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.processingType = +params['processingType'];
			this.processingTypeLabel = this.processingType == ProcessingType.BatchProcesssing ? "Batch Processing" : "Stream Processing";
			this.loadData();	
		});
	}
	
	async loadData() {
		const projectType = this.processingType == ProcessingType.BatchProcesssing ? "- Batch processsing" : "- Stream processsing";
		this.projects = (await this._IbidaasService.getAllProjects()).filter( 
				p => (p.name as string).indexOf(projectType) != -1
			);
		this.dataSource = new MatTableDataSource<ProjectiBiDaas>( this.projects );
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}
	
	openProject(projectId) {
		this.router.navigateByUrl('/project/' + this.processingType + "/" + projectId);
	}
	
}
