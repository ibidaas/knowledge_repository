import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  	selector: 'spinner',
  	template:
	`
        <div class="spinner" *ngIf="loading && !fullscreen">
            <div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>
        </div>

        <div *ngIf="loading && fullscreen" 
            class="spinner"
            style="position: fixed; top: 0;left: 0; 
                width: 100%; height: 100vh; z-index: 99999;
                background-color: rgba(30,30,30,.45); 
                margin:0px; padding-top: 22%;">
            <div class="bounce1" style="background-color:#fff;"></div>
            <div class="bounce2" style="background-color:#fff;"></div>
            <div class="bounce3" style="background-color:#fff;"></div>
        </div>
    `
})
export class SpinnerComponent implements OnInit, OnDestroy {

    @Input() loading: boolean = true;
    @Input() fullscreen: boolean = false;

	constructor() {}

	ngOnInit() {}

    ngOnDestroy() {}

}
