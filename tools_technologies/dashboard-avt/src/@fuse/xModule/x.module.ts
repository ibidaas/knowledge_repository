import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { XFormModule } from "./xForm/xForm.module";
import { XGridModule } from "./xGrid/xGrid.module";
// import { XUploadModule } from './xUpload/xUpload.module';

@NgModule({
	imports: [
		XFormModule,
		XGridModule,
		// XUploadModule
	],
	exports: [
		XFormModule,
		XGridModule,
		// XUploadModule
	]
})
export class XModule {}
