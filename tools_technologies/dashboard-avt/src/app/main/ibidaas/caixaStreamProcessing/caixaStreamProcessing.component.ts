import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { IbidaasService } from '../ibidaas.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';


import { HttpClient } from '@angular/common/http';
const { convertCSVToArray } = require('convert-csv-to-array');
//import { ViewChild, ElementRef } from '@angular/core';
import * as vis from 'vis';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppConfigServiceService } from 'app/app-config-service.service';




export interface CaixaStreamProcessing {
  date: string;
  description: string;
  type: string;
  userid1: number;
  userid2: number;
}

declare var Nirvana: any;

@Component({
  selector: 'caixa-Stream-Processing',
  templateUrl: './caixaStreamProcessing.component.html',
  styleUrls: ['./caixaStreamProcessing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CaixaStreamProcessingComponent implements OnInit, OnDestroy {

  experimentStatus;

  caixaStreamProcessingDataSource: CaixaStreamProcessing[] = [];

  displayedColumns: string[] = ['date', 'description', 'type', 'userid1', 'userid2'];
  dataSource: MatTableDataSource<CaixaStreamProcessing>;
  isExperimentRunning: boolean = false;

  projectId: any;
  projectType: any;

  relationsChannel: any;
  Session: any;


  //currId:number =0;

  network;
  nodes = new vis.DataSet();
  edges: any = new vis.DataSet();

  options: any = {

    nodes: {
      shape: "dot",
      font: {
        size: 12,
        face: "Tahoma",

      }
    },
    edges: {
      width: 0.15,
      color: { inherit: false },
      smooth: {
        type: "continuous"
      }
    },
    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -80000,
        springConstant: 0.001,
        springLength: 200
      }
    },
    interaction: {
      tooltipDelay: 200,
      hideEdgesOnDrag: true
    }
  };

  loadingSpinner: boolean = false;


  csvUrl = 'assets/relationships.csv';
  field;
  nodesArray = [];
  edgesArray = [];
  currentID;
  level = 0;
  selected;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _IbidaasService: IbidaasService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private appConfigService: AppConfigServiceService
  ) {
    this.caixaStreamProcessingDataSource = [];

    this.dataSource = new MatTableDataSource<CaixaStreamProcessing>([]);

    // create session
    this.Session = Nirvana.createSession({
      realms: [this.appConfigService.apamaUrl],
      applicationName: "testApp",
      sessionName: "testSession"
    });

    // set up channel           
    const pairsChannel = this.Session.getChannel("/ibidaas/caixa/transaction_related");
    this.relationsChannel = this.Session.getChannel("/ibidaas/caixa/transaction_pair");

    console.log(this.Session);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {

    const params = await this.route.params;

    this.projectId = params["_value"]["id"];
    this.projectType = params["_value"]["typeId"];
    this.loadingSpinner = true;

    this.http.get(this.csvUrl, { responseType: 'text' })
      .subscribe(
        data => {
          const arrayofArrays = convertCSVToArray(data, {
            type: 'array',
            separator: ','
          });

          this.getData(arrayofArrays);
        }
      );


  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  getData(arrayofArrays) {
    this.loadingSpinner = false;

    this.field = [...arrayofArrays];

  }

  async runCaixaStreamingExperiment() {
    /*Empty grid data*/
    this.caixaStreamProcessingDataSource = [];
    this.dataSource = new MatTableDataSource<CaixaStreamProcessing>([]);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    /*Disable button*/
    this.isExperimentRunning = true;

    const experimentConfigurations = ""
      + "{\"cores_number\":" + 2
      + ", \"ram_gb\":" + 1 + "}";

    const experimentResult = await this._IbidaasService.runNewExperiment(
      {
        "friendly_name": "Caixa Streaming Test",
        "configuration": experimentConfigurations
      },
      this.projectId
    );

    if (experimentResult.id) {
      console.log("ended InitialExperiment");
      console.log(experimentResult);

      this.subscribeToUM();

      this.experimentStatus = experimentResult.status;

      while (this.experimentStatus !== "stopped") {

        await this.delay(10000);

        console.log("running MainExperiment");

        let experimentMainResult = await this._IbidaasService.runNewMainExperiment(
          experimentResult.id
        );
        console.log(experimentMainResult);

        if (this.experimentStatus != 'stopped') {


          if (experimentMainResult.status) {
            this.experimentStatus = experimentMainResult.status;
          } else {
            break;
          }



        } else {
          break;
        }

      }

      this.isExperimentRunning = false;

      if (this.relationsChannel.isSubscribed()) {
        this.relationsChannel.unsubscribe();
        this.Session.stop();
      }
    }

  }

  subscribeToUM() {

    this.Session.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
    this.Session.on(Nirvana.Observe.START, this.onsessionStarted);

    this.Session.start();

    this.relationsChannel.on(Nirvana.Observe.SUBSCRIBE, this.subscriptionCompleteHandler);
    this.relationsChannel.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
    this.relationsChannel.on(Nirvana.Observe.DATA, this.relationsEventHandler.bind(this));
    this.relationsChannel.subscribe();
  }

  subscriptionCompleteHandler(resource) {
    console.log("subscription to this resource was successful");
    console.log(resource.getName());
  }

  // callback in order to know when the session was started
  onsessionStarted(s) {
    console.log("Session started with ID " + s.getSessionID());
    console.log(s);
    console.log(s.getResources());
  }

  // Handlers
  onErrorCaptured(resource, ex) {
    console.log("error");
    console.log(resource);
    console.log(ex.message);
  }

  // set up subscriber for relations
  relationsEventHandler(event) {

    //console.log("event");
    //console.log(event.getData());
    let data = JSON.parse(event.getData());

    this.caixaStreamProcessingDataSource.push({
      "date": moment(data.date, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss'),
      "description": data.description,
      "type": data.type,
      "userid1": data.userid1,
      "userid2": data.userid2
    })

    this.dataSource = new MatTableDataSource<CaixaStreamProcessing>(this.caixaStreamProcessingDataSource);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }


  graphos(val) {
    this.selected = 0;
    let m = 0;
    this.currentID = val;
    var count;
    this.nodesArray = [];
    this.edgesArray = [];


    const indexes = this.field.flatMap((ids, i) => ids[0] == this.currentID ? i : []);//pou vrisketai auto to id ston arxiko pinaka
    if (indexes.length == 0) {
      //alert("ID not found")
      this._snackBar.open('ID not Found', 'x', {
        duration: 2000,
      });
    } else {

      var count: any = this.field.filter((v) => (v[0] == this.field[indexes[m]][0])).length;//colors analoga me ta posa interractions
      this.nodesArray.push({ id: this.currentID, label: String(this.currentID), group: count })

      do {

        count = this.field.filter((v) => (v[0] == this.field[indexes[m]][1])).length;

        this.nodesArray.push({ id: this.field[indexes[m]][1], label: String(this.field[indexes[m]][1]), group: count })//pusharw ta ids pou epikoinwnh o currentID
        this.edgesArray.push({ from: this.field[indexes[m]][0], to: this.field[indexes[m]][1] })
        m++;
      } while (m < indexes.length)

      var nodes = new vis.DataSet(this.nodesArray);
      var edges = new vis.DataSet(this.edgesArray);

      var container = document.getElementById("mynetwork");

      var data = { nodes: nodes, edges: edges };
      this.network = new vis.Network(container, data, this.options);


    }





  }


  graphos2() {
    //var e = document.getElementById("LevelSelector")  as HTMLSelectElement;
    //var levels: any = e.options[e.selectedIndex].value;//ta epipeda pou theloun na doun 
    //var levels=this.selected;

    if (this.selected < this.level) {
      this.graphos(this.currentID)
    }
    this.level = this.selected;
    let j = 1;//prospernaw ton arxiko node
    let i = 0;
    var check;
    var count;
    var currentID;


    let m;

    for (i = 0; i < this.level; i++) {

      var k = this.nodesArray.length;//gia osa nodes uparxoun hdh kanw th diadikasia
      let nodesSoFar = this.nodesArray.map(v => v.id)

      for (j; j < k; j++) {
        currentID = nodesSoFar[j];

        const indexes = this.field.flatMap((ids, i) => ids[0] === currentID ? i : []); //theseis tou ID ston field
        //console.log(indexes)
        m = 0;
        do {

          check = this.nodesArray.filter(v => (v.id == this.field[indexes[m]][1]))//an uparxei hdh 
          if (check.length == 0) {
            count = this.field.filter((v) => (v[0] == this.field[indexes[m]][1])).length;
            this.nodesArray.push({ id: this.field[indexes[m]][1], label: String(this.field[indexes[m]][1]), group: count })
          }

          check = this.edgesArray.find(v => (v.from == this.field[indexes[m]][1] && v.to == this.field[indexes[m]][0]))
          if (check == undefined) {
            this.edgesArray.push({ from: this.field[indexes[m]][0], to: this.field[indexes[m]][1] })
          }
          m++;
        } while (m < indexes.length)


      }

    }
    var nodes = new vis.DataSet(this.nodesArray);
    var edges = new vis.DataSet(this.edgesArray);

    var container = document.getElementById("mynetwork");

    var data = { nodes: nodes, edges: edges };
    this.network = new vis.Network(container, data, this.options);


  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    if (this.relationsChannel.isSubscribed()) {
      this.relationsChannel.unsubscribe();
      this.Session.stop();
    }
    this.experimentStatus = "stopped";

  }



}
