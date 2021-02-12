import {Component, Inject, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { DropzoneComponent , DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as moment from 'moment';

export interface Course {
    title: string;
}

@Component({
    selector: 'custom-dialog-uploader',
    templateUrl: './custom-dialog-uploader.component.html',
    styleUrls: ['./custom-dialog-uploader.component.css']
})
export class CustomDialogUploaderComponent implements OnInit {
    // DROPZONE pROPERTIES
    @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;
    public type: string;
    public disabled: boolean;
    public files: any;
    public config: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        cancelReset: null
    };

    imagesPath: string;
    action: string;
    controller: string;
    label: string;

    description: any;

    isFileUploaded: boolean = false;
    
    // DROPZONE pROPERTIES END

    title:string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CustomDialogUploaderComponent>,
        @Inject(MAT_DIALOG_DATA) {title}:Course ) {

        this.title = title;

        this.controller = "TestController";
		this.label = "label_prefix";

    }

    ngOnInit() {
        this.imagesPath = "test";
        this.action = "teat/";
    }

    refreshImages(e){
        if(e === true){
            this.isFileUploaded = true;
        }
    }

    removeImage(e){

    }

    filesUploaded(e){
        this.files = e;
    }


    save() {
        this.dialogRef.close(this.files);
    }

    close() {
        this.dialogRef.close();
    }

    /* Dropzone methods */

    public toggleType(): void {
        this.type = (this.type === 'component') ? 'directive' : 'component';
    }
    public toggleDisabled(): void {
        this.disabled = !this.disabled;
    }
    public toggleAutoReset(): void {
        this.config.autoReset = this.config.autoReset ? null : 5000;
        this.config.errorReset = this.config.errorReset ? null : 5000;
        this.config.cancelReset = this.config.cancelReset ? null : 5000;
    }
    public toggleMultiUpload(): void {
        this.config.maxFiles = this.config.maxFiles ? 0 : 1;
    }
    public toggleClickAction(): void {
        this.config.clickable = !this.config.clickable;
    }
    public resetDropzoneUploads(): void {
        if (this.type === 'directive' && this.directiveRef) {
            this.directiveRef.reset();
        } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
            this.componentRef.directiveRef.reset();
        }
    }
    public onUploadInit(args: any): void {
        console.log('onUploadInit:', args);
    }
    public onUploadError(args: any): void {
        console.log('onUploadError:', args);
    }
    public onUploadSuccess(args: any): void {
        console.log('onUploadSuccess:', args);
    }

    /* End Dropzone methods */

}