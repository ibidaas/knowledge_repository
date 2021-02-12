import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { XUploadComponent } from './xUpload.component';
import { MatButtonModule } from "@angular/material";

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule
  	],
  	declarations: [
		//XUploadComponent,
  	],
  	exports: [
		//XUploadComponent
  	]
})
export class XUploadModule { }
