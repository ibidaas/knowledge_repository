import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewEncapsulation } from '@angular/core';
import { XUploadService } from './xUpload.service';

@Component({
	exportAs: "xUpload",
  	selector: 'x-upload',
  	template: `
		<div draggable="true" ngClass="{{dragAreaClass}}">
			<div class="col-md-12 text-center" >
				<button mat-raised-button color="primary" 
					(click)="file.click()" style="margin-right:10px;">Click to browse
				</button> Or Drag & Drop to upload your files 

				<input type="file" #file [multiple]="(maxFiles > 1)" (change)="onFileChange($event)" style="display:none" />
			</div>
		</div>
		<div class="row error" *ngIf="errors.length > 0">
			<ul>
				<li *ngFor="let err of errors">{{err}}</li>
			</ul>
        </div>
        
        <div class="row success" *ngIf="success.length > 0">
            <ul>
                <li *ngFor="let err of success">{{err}}</li>
            </ul>
        </div>
	`
})
export class XUploadComponent implements OnInit {

	formData: FormData;
    errors: Array<string> =[];
    success: Array<string> =[];
	urlAction: string;
	dragAreaClass: string;
	@Input() controller: string;
	@Input() action: string;
	@Input() label: string;
	@Input() fileExt: string;
	@Input() maxFiles: number;
	@Input() maxSize: number;
    @Output() uploadStatus = new EventEmitter();
    @Output() uploadedFile = new EventEmitter();

    constructor(private xUploadService: XUploadService) {
		this.urlAction = "";
		this.dragAreaClass = "dragarea";
		this.fileExt = "ZIP, RAP";
		this.maxFiles = 5;
		this.maxSize = 30; // 30MB
	}

    ngOnInit() { }

    onFileChange(event) {
		const files = event.target.files;
		this.saveFiles(files);
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) onDrop(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        this.saveFiles(files);
    }

    saveFiles(files) {
        this.errors = []; // Clear error
        this.success = []; // Clear success
		// Validate file size and allowed extensions
		if (files.length > 0 && (!this.isValidFiles(files))) {
			this.uploadStatus.emit(false);
			return;
		}

		if (files.length > 0) {

            this.formData = new FormData();
            for (let j = 0; j < files.length; j++) {
                this.formData.append("file[]", files[j], files[j].name);
			}
			
            const parameters = { label: this.label };
            this.urlAction = this.controller + '/' + this.action;
            
            // this.xUploadService.upload(this.urlAction, this.formData).subscribe(
            //     success => {
            //         this.uploadStatus.emit(true);
            //         console.log(success);
            //     },
            //     error => {
            //         this.uploadStatus.emit(true);
            //         this.errors.push(error.ExceptionMessage);
            //     }
            // );

            for (let j = 0; j < files.length; j++) {
                this.success.push(
                    "Success : " + files[j].name + ": is successfully uploaded!"
                );
    
            }
            

            this.uploadStatus.emit(true);

            this.uploadedFile.emit(files);
        }
    }

    private isValidFiles(files) {
       // Check Number of files
        if (files.length > this.maxFiles) {
            this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
            return;
        }
        this.isValidFileExtension(files);
        return this.errors.length === 0;
    }

    private isValidFileExtension(files) {
        // Make array of file extensions
        const extensions = (this.fileExt.split(',')).map(function (x) { return x.toLocaleUpperCase().trim(); });

          for (let i = 0; i < files.length; i++) {
              // Get file extension
              const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
              // Check the extension exists
              const exists = extensions.includes(ext);
              if (!exists) {
                  this.errors.push("Error (Extension): " + files[i].name);
              }
              // Check file size
              this.isValidFileSize(files[i]);
          }
    }


    private isValidFileSize(file) {
        const fileSizeinMB = file.size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {
            this.errors.push(
            	"Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )"
            );
        } 
    }
}
