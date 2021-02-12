import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';

export interface Course {
    id:number;
    experimentName:string;
    iconUrl: string;
    longDescription: string;
    description:string;
    category:string;
    experimentDate:Date;
}

@Component({
    selector: 'custom-dialog',
    templateUrl: './custom-dialog.component.html',
    styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent implements OnInit {

    form: FormGroup;
    description:string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CustomDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {description,longDescription,experimentName,
            category}:Course ) {

        this.description = description;


        this.form = fb.group({
            experimentName: [experimentName, Validators.required],
            //category: [category, Validators.required],
            experimentDate: [moment(), Validators.required],
            longDescription: [longDescription, null]
        });

    }

    ngOnInit() {

    }


    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

}