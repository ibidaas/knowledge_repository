import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field.interface";

@Component({
    selector: "app-radiobutton",
    template: `
		<div [formGroup]="group" style="margin-top:5px; margin-bottom:5px; width: 100%;">
			<label class="radio-label-padding">{{field.label}}:</label>
			<mat-radio-group [formControlName]="field.name">
				<mat-radio-button *ngFor="let item of field.options" 
					[value]="item" style="margin-right:10px;">{{item}}
				</mat-radio-button>
			</mat-radio-group>
		</div>
    `,
    styles: []
})
export class RadiobuttonComponent implements OnInit {
    field: FieldConfig;
    group: FormGroup;
    constructor() {}
    ngOnInit() {}
}
