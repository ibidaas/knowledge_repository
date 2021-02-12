import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ContentChild, TemplateRef } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel, DataSource } from '@angular/cdk/collections';

@Component({
	exportAs: "xGrid",
	selector: "x-grid",
	template: `
	
		<mat-form-field>
			<input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
		</mat-form-field>
		
		<table mat-table [dataSource]="dataSource" matSort  style="width:100%;" matSortActive="{{displayedColumns[0]}}" matSortDirection="desc">
		
			<ng-container matColumnDef="{{column}}" *ngFor="let column of displayedColumns">
				
				<ng-container *ngIf="column === 'select'">
					<th mat-header-cell *matHeaderCellDef>
						<mat-checkbox (change)="$event ? masterToggle() : null"
							[checked]="selection.hasValue() && isAllSelected()"
							[indeterminate]="selection.hasValue() && !isAllSelected()">
						</mat-checkbox>
					</th>
					<td mat-cell *matCellDef="let row">
						<mat-checkbox (click)="$event.stopPropagation()"
							(change)="$event ? selection.toggle(row) : null"
							[checked]="selection.isSelected(row)">
						</mat-checkbox>
					</td>
				</ng-container>
				
				<ng-container *ngIf="column !== 'select' && column !== 'actions'">
					<th mat-header-cell *matHeaderCellDef mat-sort-header>{{column}}</th>
					<td mat-cell *matCellDef="let element"> {{element[column]}} </td>
				</ng-container>
				
				<ng-container *ngIf="column === 'actions'">
					<th mat-header-cell *matHeaderCellDef></th>
					<td mat-cell *matCellDef="let element">
						<button mat-raised-button color="warning" *ngIf="element.status === 'running'" style="background-color: orange; color: white;" (click)="rowStopClicked(element)">Stop</button>
						<button mat-raised-button color="primary" *ngIf="element.status === 'stopped'" (click)="rowClicked(element)">View</button>
						<button mat-raised-button color="danger" *ngIf="element.status === 'stopped'" style="margin-left:10px; background-color: red; color: white;" (click)="rowDeleteClicked(element)">Delete</button>
					</td>
				</ng-container>
				
			</ng-container>
		  
			<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="selection.toggle(row)"></tr>
				
		</table>
		
		<ng-template #templateRef>
			<ng-content select="grid-actions"></ng-content>
		</ng-template>
		
		<mat-paginator #paginator 
                [length]="dataSource.filteredData.length" 
				[pageIndex]="0" 
				[pageSize]="5" 
				[pageSizeOptions]="[5, 15, 25, 100]" 
				showFirstLastButtons>
            </mat-paginator>
		
	`,
	styles: []
})
export class XGridComponent implements OnInit {
	
	@ContentChild(TemplateRef) templateRef: TemplateRef<any>;
	
	@Input() columns: any[] = [];
    @Input() data: any[] = [];
    
	@Output() selectRow: EventEmitter<any> = new EventEmitter();
	
	@Output() deleteRow: EventEmitter<any> = new EventEmitter();

	@Output() stopRow: EventEmitter<any> = new EventEmitter();
	
	displayedColumns: string[] = [];
	dataSource: MatTableDataSource<any>;
	// dataSource: any;
	
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	
	selection = new SelectionModel<any>(true, []);
	
	constructor() {}

	ngOnInit() {
		// this.displayedColumns = this.columns.map(c => c.columnDef);
		
		this.displayedColumns = this.columns.map(x => x.columnDef).concat(['actions']);
		
		this.dataSource = new MatTableDataSource<any>(this.data);
		// this.dataSource = new GridDataSource(this.data);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	refreshDataSource(){
		this.dataSource = new MatTableDataSource<any>(this.data);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected == numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
    }
    
    rowClicked(e) {
        this.selectRow.emit(e);
	}
	
	rowDeleteClicked(e){
		this.deleteRow.emit(e);
	}

	rowStopClicked(e){
		this.stopRow.emit(e);
	}
	
}

// export class GridDataSource extends DataSource<any> {
	
	// data :any[] = [];

	// constructor(_data: any[]) {
		// super();
		// this.data = _data;
	// }
	
	// /** Connect function called by the table to retrieve one stream containing the data to render. */
	// connect(): Observable<any[]> {
		// return Observable.of(this.data);
	// }

  // disconnect() {}
// }
