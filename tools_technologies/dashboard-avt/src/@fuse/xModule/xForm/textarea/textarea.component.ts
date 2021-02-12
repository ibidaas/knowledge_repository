import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field.interface";

@Component({
    selector: "app-textarea",
    template: `
		<mat-form-field [formGroup]="group" appearance="outline" style="margin-top:5px; margin-bottom:5px; width:100%;">
			<mat-label>{{field.label}}</mat-label>
			<textarea matInput [placeholder]="field.label" [formControlName]="field.name" rows="5"></textarea>
			<ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
				<mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
			</ng-container>
		</mat-form-field>
    `,
    styles: []
})
export class TextareaComponent implements OnInit {
    field: FieldConfig;
    group: FormGroup;
    constructor() {}
    ngOnInit() {}
}
