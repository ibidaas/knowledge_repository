import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field.interface";

@Component({
    selector: "app-checkbox",
    template: 
    `
		<div [formGroup]="group" style="margin-top:5px; margin-bottom:5px; width:100%;">
			<mat-checkbox [formControlName]="field.name">{{field.label}}</mat-checkbox>
		</div>
    `,
    styles: []
})
export class CheckboxComponent implements OnInit {
    field: FieldConfig;
    group: FormGroup;
    constructor() {}
    ngOnInit() {}
}
