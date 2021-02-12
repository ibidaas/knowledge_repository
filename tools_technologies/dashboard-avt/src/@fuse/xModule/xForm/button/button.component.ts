import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field.interface";

@Component({
    selector: "app-button",
    template: 
    `
		<div [formGroup]="group" style="margin-top:5px; margin-bottom:5px; width:100%;">
			<button type="submit" mat-raised-button color="primary">{{field.label}}</button>
		</div>
    `,
    styles: []
})
export class ButtonComponent implements OnInit {
    field: FieldConfig;
    group: FormGroup;
    constructor() {}
    ngOnInit() {}
}
