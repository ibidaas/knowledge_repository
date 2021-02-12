import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material.module";

import { XGridComponent } from "./xGrid.component";

@NgModule({
    declarations: [
        XGridComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        XGridComponent
    ],
    entryComponents: [
        XGridComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class XGridModule {}
