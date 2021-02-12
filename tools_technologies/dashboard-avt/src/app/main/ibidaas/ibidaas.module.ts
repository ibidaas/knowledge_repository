import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { SpinnerModule } from '@fuse/spinner/spinner.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DropzoneModule, DropzoneConfigInterface, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
	url: "TestUrl",
	acceptedFiles: 'personalAlgorithms/*', createImageThumbnails: false
};

import {
	MatAutocompleteModule,
	MatBadgeModule,
	MatBottomSheetModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatExpansionModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule,
} from '@angular/material';

import { NvD3Module } from 'angular2-nvd3';

import { XModule } from '@fuse/xModule/x.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './projects/project.component';
import { ProjectNewComponent } from './projects/project-new.component';

import { TelefonicaLiveStatsComponent } from './telefonica/telefonica-live-stats.component';

import { FiatCrfComponent } from './fiat-crf/fiat-crf.component';

import { CaixaStreamProcessingComponent } from './caixaStreamProcessing/caixaStreamProcessing.component';

import { XUploadComponent } from '@fuse/xModule/xUpload/xUpload.component';

import { IbidaasService } from './ibidaas.service';

import { FuseConfirmDialogModule } from '@fuse/components/confirm-dialog/confirm-dialog.module';
import { ExpertmodeComponent } from './expertmode/expertmode.component';
import { SelfservicemodeComponent } from './selfservicemode/selfservicemode.component';
import { UsecasesComponent } from './usecases/usecases.component';
import { TelefonicaMobilityComponent } from './telefonica/telefonica-mobility/telefonica-mobility.component';
import { TelefonicaKpisComponent } from './telefonica/telefonica-kpis/telefonica-kpis.component';
import { MaintenanceComponent } from './fiat-crf/maintenance/maintenance.component';
import { OnlineBankingComponent } from './online-banking/online-banking.component';

const routes = [
	{ path: 'usecases', component: UsecasesComponent },
	{ path: 'selfservicemode', component: SelfservicemodeComponent },
	{ path: 'expertmode', component: ExpertmodeComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'projects/:processingType', component: ProjectsComponent },
	{ path: 'project/:typeId/:id', component: ProjectComponent },
	{ path: 'projectnew/:typeId/:id', component: ProjectNewComponent },
	{ path: 'telefonica/livestats', component: TelefonicaLiveStatsComponent },
	{ path: 'telefonica/mobility', component: TelefonicaMobilityComponent },
	{ path: 'telefonica/kpis', component: TelefonicaKpisComponent },
	{ path: 'fiatcrf/:typeId/:id', component: FiatCrfComponent },
	{ path: 'caixastreamprocessing/:typeId/:id', component: CaixaStreamProcessingComponent },
	{ path: 'fiatcrf/maintenance', component: MaintenanceComponent },
	{ path: 'onlinebanking', component: OnlineBankingComponent },



];

@NgModule({
	declarations: [
		DashboardComponent,
		ProjectsComponent,
		ProjectComponent,
		ProjectNewComponent,
		TelefonicaLiveStatsComponent,
		FiatCrfComponent,
		CaixaStreamProcessingComponent,
		XUploadComponent,

		ExpertmodeComponent,
		SelfservicemodeComponent,
		UsecasesComponent,
		TelefonicaMobilityComponent,
		TelefonicaKpisComponent,
		MaintenanceComponent,
		OnlineBankingComponent,
	],
	imports: [
		RouterModule.forChild(routes),
		TranslateModule,
		ChartsModule,
		NgxChartsModule,
		FuseSharedModule,
		FuseWidgetModule,
		HttpClientModule,
		HttpClientXsrfModule.withOptions({
			cookieName: 'XSRF-TOKEN',
			headerName: 'X-CSRF-TOKEN'
		}),
		CdkTableModule,
		CdkTreeModule,
		DragDropModule,
		MatAutocompleteModule,
		MatBadgeModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatStepperModule,
		SpinnerModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatTreeModule,
		ScrollingModule,
		FuseConfirmDialogModule,

		XModule,
		DropzoneModule,
		NvD3Module,
	],
	exports: [
		UsecasesComponent,
		SelfservicemodeComponent,
		ExpertmodeComponent,
		DashboardComponent,
		ProjectsComponent,
		ProjectComponent,
		ProjectNewComponent,
		TelefonicaLiveStatsComponent,
		FiatCrfComponent,
		CaixaStreamProcessingComponent,
		XUploadComponent,
		MatAutocompleteModule,
		MatBadgeModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatStepperModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatTreeModule,
	],
	providers: [
		NvD3Module,
		IbidaasService,
		{
			provide: DROPZONE_CONFIG,
			useValue: DEFAULT_DROPZONE_CONFIG
		}
	],
	entryComponents: [XUploadComponent]
})

export class IbidaasModule { }
