import { Component, NgZone, OnInit } from '@angular/core';
import { AppConfigServiceService } from 'app/app-config-service.service';

import * as L from 'leaflet'
//import 'node_modules/leaflet-timedimension/dist/leaflet.timedimension.src.js';

import '../../../../../assets/MarkersToCanvas'

import '../../../../../assets/AntennaPositionRandom'
declare let returnMarkersVar: any;

var intervalTestHotspot;//interval for goLiveFake

var hopCounter = 0;

var antennaMarkers = [];
var antennaMarkers_dict = {};
var antennaMarkers_dict_glob_buffer = {};
var antennaRadius = [];
var antennaRadius_dict = {};
var antennaRadius_dict_glob_buffer = {};

var ciLayer;


var buffer_antennaRadius_dict = {}; //for past-data & hide and show only hotspots


var groupCyrcles = L.featureGroup(); //to group circles

declare var Nirvana: any;

//hold the history of antenas + extra data if possible
import { cloneDeep } from 'lodash'; //library for a deep copy for the antenaHistory

var antennaHistory = [];


var icon = L.icon({
  iconUrl: 'assets/1.png',
  iconSize: [22, 19],
  iconAnchor: [10, 9]
});


export interface PeriodicElement {
  DataType: string;
  Value: any;
}


declare global {
  interface Window { my: any; }
}


@Component({
  selector: 'app-telefonica-kpis',
  templateUrl: './telefonica-kpis.component.html',
  styleUrls: ['./telefonica-kpis.component.scss'],
})

export class TelefonicaKpisComponent implements OnInit {
  id: any;
  displayedColumns: string[] = ['DataType', 'Value'];
  map: any;

  Session: any;
  kpisChannel: any;


  constructor(private ngZone: NgZone, private appConfigService: AppConfigServiceService) {

    this.Session = Nirvana.createSession({
      realms: [this.appConfigService.apamaUrl],
      applicationName: "testApp",
      sessionName: "testSession"

    });

    //console.log(this.Session);

    // set up channel           
    this.kpisChannel = this.Session.getChannel("/ibidaas/tid/antenna_out");
  }





  async ngOnInit() {
    window.my = window.my || {};
    window.my.namespace = window.my.namespace || {};

    this.map = L.map('mapid', {
      zoom: 11,
      center: [40.416775, -3.703790],
      tfullscreenControl: true,
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      preferCanvas: true
    }).addTo(this.map);

    /* 
     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/navigation-guidance-day-v4',
    accessToken: 'pk.eyJ1IjoiYWFsZXhvcDQwNCIsImEiOiJjazV6YzJ2eWowODk4M2tvYjZ3bm9iN3p2In0.nMmRx_P4dgP2ah-H3jxkOg',
    }).addTo(this.map);
    */

    //code bellow adds markers and antennaRadius 
    ciLayer = L.canvasIconLayer({}).addTo(this.map);

    ciLayer.addOnClickListener(function (e, data) { });//{console.log(data)});
    ciLayer.addOnHoverListener(function (e, data) { });//{console.log(data[0].data._leaflet_id)});


    //fetch antenna locations from local js
    var markers = [];
    markers = returnMarkersVar();
    //console.log(markers);

    for (var i = 0; i < markers.length; ++i) {
      var marker = L.marker([markers[i].lat, markers[i].lon], { icon: icon }).bindPopup("Antenna Id: " + markers[i].id + "</b><br> Lat: " + markers[i].lat + "</b><br> Lon: " + markers[i].lon + "</b><br> Hotspot: No");
      //antennaMarkers.push(marker);
      antennaMarkers_dict[markers[i].id] = marker;

      var circle = L.circle([markers[i].lat, markers[i].lon], {
        color: '#4682b4',
        fillColor: '#4682b4',
        stroke: false,
        radius: 1000,
        fillOpacity: 0.6
      }).addTo(groupCyrcles);
      //antennaRadius.push(circle);
      antennaRadius_dict[markers[i].id] = circle;
    }
    groupCyrcles.addTo(this.map);


    antennaMarkers_dict_glob_buffer = cloneDeep(antennaMarkers_dict);
    antennaRadius_dict_glob_buffer = cloneDeep(antennaRadius_dict);

    //MAKE A DEEP COPY OF THE FIRST VIEW OF THE ANTENNAS..USE IT TO UPDATE HISTORY..
    for (var key in antennaRadius_dict) {
      antennaRadius.push(antennaRadius_dict[key]);
    }
    antennaHistory.push(cloneDeep(antennaRadius));
    //console.log(antennaHistory);

    //create array antennaMarkers to feed the ciLayers
    for (var key in antennaMarkers_dict) {
      antennaMarkers.push(antennaMarkers_dict[key]);
    }
    ciLayer.addLayers(antennaMarkers);

    //start state = live //programmatically at the end to earn some time processing
    var stateIndexLive = document.getElementById("stateIndexLive");
    var liveBtn = document.getElementById('playReceiveTestDataBtn');
    liveBtn.click();
    document.querySelector('#playReceiveTestDataBtn').innerHTML = 'Pause';
    stateIndexLive.innerHTML = "pauseState";


    this.runKPISStreamingExperiment();
  }



  /* CODE BELOW FOR NIRVANA STREAM 50 ANTENNAS EVERY 60 SECONDS*/
  async runKPISStreamingExperiment() {
    this.subscribeToUM();

    if (this.kpisChannel.isSubscribed()) {
      this.kpisChannel.unsubscribe();
      this.Session.stop();
    }


  }

  subscribeToUM() {
    this.Session.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
    this.Session.on(Nirvana.Observe.START, this.onsessionStarted);

    this.Session.start();

    this.kpisChannel.on(Nirvana.Observe.SUBSCRIBE, this.subscriptionCompleteHandler);
    this.kpisChannel.on(Nirvana.Observe.ERROR, this.onErrorCaptured);
    this.kpisChannel.on(Nirvana.Observe.DATA, this.umDataEventHandler.bind(this));
    this.kpisChannel.subscribe();
  }

  // Handlers
  onErrorCaptured(resource, ex) {
    console.log("error");
    console.log(resource);
    console.log(ex.message);
  }
  // callback in order to know when the session was started
  onsessionStarted(s) {
    console.log("Session started with ID " + s.getSessionID());
    console.log(s);
    console.log(s.getResources());
  }
  subscriptionCompleteHandler(resource) {
    console.log("subscription to this resource was successful");
    console.log(resource.getName());
  }
  async umDataEventHandler(event) {
    console.log(event)
    let data = JSON.parse(event.getData()); //
    console.log(data);
    //console.log(data.antennas);

    var stateIndexLive = document.getElementById("stateIndexLive");
    var stateIndexHotspot = document.getElementById("stateIndexHotspots");

    //live button is pressed
    if (document.getElementById("stateIndexLive").innerHTML == "pauseState") {

      var currentAntenna_id;
      var hotspotValue;
      var selectedOpacity = (<HTMLInputElement>document.getElementById("opacityStep")).value;//cast getElement ot HTMLINputELment to resolve error typescript not recognizing .value

      for (var id in data.antennas) { //data.antennas for real data!
        currentAntenna_id = id;
        hotspotValue = data.antennas[id].hotspot;//data.antennas for real data!

        //AN TO INCOMMING JSON-DATASET MOU DINEI 0 MONO SE PROIGOUMENA HOTSPOT, 8A PAIKSEI OPWS EINAI APO KATW, ALLIOS 8ELEI CASES - 8ELW CASES! -> ERXONTAI ANA 50 antennas
        if (stateIndexHotspot.innerHTML == "onlyNonHotspots") {  //when new hotspot is created, check if user has decided to view only Nonhotspots
          if (hotspotValue == 0) {
            antennaRadius_dict[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
            antennaMarkers_dict[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
          } else {
            antennaRadius_dict[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: '0.0' });
            antennaMarkers_dict[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: '0.0' });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
          }
        }
        else if (stateIndexHotspot.innerHTML == "onlyHotspots") {//when new hotspot is created and an old is removed, check if user has decided to view only Hotspot
          if (hotspotValue == 0) {
            antennaRadius_dict[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: '0.0' });
            antennaMarkers_dict[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: '0.0' });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
          }
          else {
            antennaRadius_dict[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
            antennaMarkers_dict[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
          }
        }
        else {
          if (hotspotValue == 0) {
            antennaRadius_dict[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
            antennaMarkers_dict[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
          }
          else {
            antennaRadius_dict[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
            antennaMarkers_dict[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
          }
        }
      }
    }
    //EVEN WHEN THE PAUSE IS PRESED, I NEED TO UPDATE THE MAIN DICT WITH THE RADIUS
    else {
      //console.log(antennaMarkers_dict_glob_buffer);

      var currentAntenna_id;
      var hotspotValue;
      var selectedOpacity = (<HTMLInputElement>document.getElementById("opacityStep")).value;//cast getElement ot HTMLINputELment to resolve error typescript not recognizing .value

      for (var id in data.antennas) { //data.antennas for real data!
        currentAntenna_id = id;
        hotspotValue = data.antennas[id].hotspot;//data.antennas for real data!

        //AN TO INCOMMING JSON-DATASET MOU DINEI 0 MONO SE PROIGOUMENA HOTSPOT, 8A PAIKSEI OPWS EINAI APO KATW, ALLIOS 8ELEI CASES - 8ELW CASES! -> ERXONTAI ANA 50 antennas
        if (stateIndexHotspot.innerHTML == "onlyNonHotspots") {  //when new hotspot is created, check if user has decided to view only Nonhotspots
          if (hotspotValue == 0) {
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
          } else {
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: '0.0' });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
          }
        }
        else if (stateIndexHotspot.innerHTML == "onlyHotspots") {//when new hotspot is created and an old is removed, check if user has decided to view only Hotspot
          if (hotspotValue == 0) {
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: '0.0' });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
          }
          else {
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
          }
        }
        else {
          if (hotspotValue == 0) {
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: No");
          }
          else {
            antennaRadius_dict_glob_buffer[currentAntenna_id].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
            antennaMarkers_dict_glob_buffer[currentAntenna_id]._popup.setContent("Antenna Id: " + currentAntenna_id + "</b><br> Lon: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict_glob_buffer[currentAntenna_id]._latlng.lat + "</b><br> Hotspot: Yes");
          }
        }
      }
    }
    //console.log(antennaRadius_dict_glob_buffer["a9a3407fcfa694ec74637706ab37e1c9"].options.fillColor);
  }


  //toggle play/stop button
  receiveTestData() {

    //console.log(this.map.getZoom());

    /*
      if (this.map.getZoom() <9 && removedLayerFlag ==0){
        //this.map.removeLayer(ciLayer);
        for (var antenna in antennaMarkers_dict){
          //console.log(antennaMarkers_dict[antenna].options.icon.options.iconSize);
          antennaMarkers_dict[antenna].options.icon.options.iconSize = [0,0];
        }
        
        //this.map.ciLayer.setOpaciy(0);
        removedLayerFlag = 1;
      }
      else if (this.map.getZoom() >=9 && removedLayerFlag == 1){
        for (var antenna in antennaMarkers_dict){
          antennaMarkers_dict[antenna].options.icon.options.iconSize = [22,19];
        }
        removedLayerFlag = 0;
      }
  */
    //console.log("play button pushed");
    var stateIndexLive = document.getElementById("stateIndexLive");
    var stateIndexHotspot = document.getElementById("stateIndexHotspots");

    // function updateHistory() {
    //   antennaHistory.push(cloneDeep(antennaRadius));
    //   console.log(antennaHistory);
    //   hopCounter += 1;
    // }

    if (stateIndexLive.innerHTML === "playState") {
      document.querySelector('#playReceiveTestDataBtn').innerHTML = ' Pause ';
      stateIndexLive.innerHTML = "pauseState";
      document.getElementById("sliderLabel").textContent = "Live View";

      (<HTMLInputElement>document.getElementById("timestamp")).value = "4"; //when go live, programatically move slider thumb
      var selectedOpacity = (<HTMLInputElement>document.getElementById("opacityStep")).value;//cast getElement ot HTMLINputELment to resolve error typescript not recognizing .value

      this.map.removeLayer(groupCyrcles);
      var markers = [];
      markers = returnMarkersVar();


      //redraw map from antennaRadius -> the main thread, to continue
      //console.log("redraw_map");
      //var buffer_antennaRadius_dict = cloneDeep(antennaRadius_dict);

      //console.log(antennaRadius_dict_glob_buffer["a9a3407fcfa694ec74637706ab37e1c9"].options.fillColor);
      antennaRadius_dict = antennaRadius_dict_glob_buffer; //redraw from the buffer that is always updated (even when pause is pressed)
      for (var id in antennaRadius_dict) {
        if (antennaRadius_dict[id].options.fillColor == '#FF0000') {
          antennaRadius_dict[id].addTo(this.map);
          antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });

          antennaMarkers_dict[id]._popup.setContent("Antenna Id: " + id + "</b><br> Lon: " + antennaMarkers_dict[id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[id]._latlng.lat + "</b><br> Hotspot: Yes");
        }
        else {
          antennaRadius_dict[id].addTo(this.map);
          antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });
          antennaMarkers_dict[id]._popup.setContent("Antenna Id: " + id + "</b><br> Lon: " + antennaMarkers_dict[id]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[id]._latlng.lat + "</b><br> Hotspot: No");
        }
      }



      //intervalUpdateHistory = setInterval(updateHistory,1.8e+6); //update every 30 min (1.8e+6) - change for live test -> Use for real deployment

      if (hopCounter > 10) { antennaHistory = [] }//flush older data


      //HERE CALL FUNCTION TO READ JSON, UNCOMMENT FOR REAL DATA
      //readJSONAntennaData();//when completed, remove bellow testHotsptot with goLiveFakeHotspot

      //TEST CODE FOR UPDATING HOTSPOTS RANDOM
      //intervalTestHotspot = setInterval(goLiveFakeHotspot, Math.floor(Math.random()* 430) +250);

    } else {

      document.querySelector('#playReceiveTestDataBtn').innerHTML = 'Go Live';
      stateIndexLive.innerHTML = "playState";
      clearInterval(intervalTestHotspot);
      document.getElementById("sliderLabel").textContent = "Steam Paused";
    }
  }


  //toggle only Hotspots show button
  //ONLY NON HOTSPOTS IS AVAILABLE ONLY IN NO LIVE UPDATE
  onlyHotspot() {
    var stateIndexHotspot = document.getElementById("stateIndexHotspots");
    var selectedOpacity = (<HTMLInputElement>document.getElementById("opacityStep")).value;//cast getElement ot HTMLINputELment to resolve error typescript not recognizing .value

    //live button is pressed
    if (document.getElementById("stateIndexLive").innerHTML == "pauseState") {
      antennaRadius_dict = antennaRadius_dict_glob_buffer; //redraw from the buffer that is always updated (even when pause is pressed)

      if (stateIndexHotspot.innerHTML === "allAntennas") {
        document.querySelector('#onlyHotspotBtn').innerHTML = 'Hide Hotspots';
        stateIndexHotspot.innerHTML = "onlyHotspots";

        for (var id in antennaRadius_dict) {
          if (antennaRadius_dict[id].options.fillColor == "#4682b4") {
            antennaRadius_dict[id].setStyle({ fillOpacity: '0' });
          }
        }
      } else if (stateIndexHotspot.innerHTML === "onlyHotspots") {
        document.querySelector('#onlyHotspotBtn').innerHTML = 'Show All Antennas';
        stateIndexHotspot.innerHTML = "onlyNonHotspots";

        for (var id in antennaRadius_dict) {
          if (antennaRadius_dict[id].options.fillColor == "#4682b4") {
            antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });

          }
          else if (antennaRadius_dict[id].options.fillColor == '#FF0000') {
            antennaRadius_dict[id].setStyle({ fillOpacity: '0.0' });
          }
        }
      }
      else if (stateIndexHotspot.innerHTML === "onlyNonHotspots") {
        document.querySelector('#onlyHotspotBtn').innerHTML = 'Show only Hotspots';
        stateIndexHotspot.innerHTML = "allAntennas";
        for (var id in antennaRadius_dict) {
          if (antennaRadius_dict[id].options.fillColor == '#FF0000') {
            antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });

          }
          else {
            antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });
          }
        }
      }
    }
    else {
      if (stateIndexHotspot.innerHTML === "allAntennas") {
        document.querySelector('#onlyHotspotBtn').innerHTML = 'Hide Hotspots';
        stateIndexHotspot.innerHTML = "onlyHotspots";

        for (var id in buffer_antennaRadius_dict) {
          if (buffer_antennaRadius_dict[id].options.fillColor == "#4682b4") {
            buffer_antennaRadius_dict[id].setStyle({ fillOpacity: '0' });
          }
        }
      } else if (stateIndexHotspot.innerHTML === "onlyHotspots") {
        document.querySelector('#onlyHotspotBtn').innerHTML = 'Show All Antennas';
        stateIndexHotspot.innerHTML = "onlyNonHotspots";

        for (var id in buffer_antennaRadius_dict) {
          if (buffer_antennaRadius_dict[id].options.fillColor == "#4682b4") {
            buffer_antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });

          }
          else if (buffer_antennaRadius_dict[id].options.fillColor == '#FF0000') {
            buffer_antennaRadius_dict[id].setStyle({ fillOpacity: '0.0' });
          }
        }
      }
      else if (stateIndexHotspot.innerHTML === "onlyNonHotspots") {
        document.querySelector('#onlyHotspotBtn').innerHTML = 'Show only Hotspots';
        stateIndexHotspot.innerHTML = "allAntennas";
        for (var id in buffer_antennaRadius_dict) {
          if (buffer_antennaRadius_dict[id].options.fillColor == '#FF0000') {
            buffer_antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });

          }
          else {
            buffer_antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });
          }
        }
      }
    }
  }



  //fake step back -> read the atennaPosition json and for 100-200 ->hotspot
  testStepBack() {
    //STOP LIVE STREAMING WHEN VIEWING THE PAST
    var stateIndexLive = document.getElementById("stateIndexLive");
    if (stateIndexLive.innerHTML === "pauseState") {
      var liveBtn = document.getElementById('playReceiveTestDataBtn');
      liveBtn.click();
      document.querySelector('#playReceiveTestDataBtn').innerHTML = 'Go Live';
      stateIndexLive.innerHTML = "playState";
    }


    var selectedTimestamp = (<HTMLInputElement>document.getElementById("timestamp")).value;//cast getElement ot HTMLINputELment to resolve error typescript not recognizing .value

    this.map.removeLayer(groupCyrcles);

    //console.log(buffer_antennaRadius_dict);
    buffer_antennaRadius_dict = cloneDeep(antennaRadius_dict);
    var markers = [];
    markers = returnMarkersVar();

    var selectedOpacity = (<HTMLInputElement>document.getElementById("opacityStep")).value;//cast getElement ot HTMLINputELment to resolve error typescript not recognizing .value

    if (selectedTimestamp == "0") {
      var date = new Date(Date.now() - 4 * 3600000);
      document.getElementById("sliderLabel").textContent = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':00:00';
      for (var key in buffer_antennaRadius_dict) {
        if (key.includes("ed")) {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: Yes");
        }
        else {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: No");
        }
      }
    }
    else if (selectedTimestamp == "1") {
      var date = new Date(Date.now() - 3 * 3600000);
      document.getElementById("sliderLabel").textContent = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':00:00';
      for (var key in buffer_antennaRadius_dict) {
        if (key.includes("ef")) {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: Yes");
        }
        else {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: No");
        }
      }
    }
    else if (selectedTimestamp == "2") {
      var date = new Date(Date.now() - 2 * 3600000);
      document.getElementById("sliderLabel").textContent = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':00:00';
      for (var key in buffer_antennaRadius_dict) {
        if (key.includes("ea")) {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: Yes");
        }
        else {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: No");
        }
      }
    }
    else if (selectedTimestamp == "3") {
      var date = new Date(Date.now() - 3600000);
      document.getElementById("sliderLabel").textContent = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':00:00';
      for (var key in buffer_antennaRadius_dict) {
        if (key.includes("ee")) {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#FF0000', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: Yes");
        }
        else {
          buffer_antennaRadius_dict[key].setStyle({ fillColor: '#4682b4', fillOpacity: selectedOpacity });
          antennaMarkers_dict[key]._popup.setContent("Antenna Id: " + key + "</b><br> Lon: " + antennaMarkers_dict[key]._latlng.lng + "</b><br> Lat: " + antennaMarkers_dict[key]._latlng.lat + "</b><br> Hotspot: No");
        }
      }
    }
    else if (selectedTimestamp == "4") {
      //start state = live //programmatically at the end to earn some time processing
      var stateIndexLive = document.getElementById("stateIndexLive");
      var liveBtn = document.getElementById('playReceiveTestDataBtn');
      liveBtn.click();
      document.querySelector('#playReceiveTestDataBtn').innerHTML = ' Pause ';
      stateIndexLive.innerHTML = "pauseState";
    }

  }



  changeOpacity() {
    var selectedOpacity = (<HTMLInputElement>document.getElementById("opacityStep")).value;//cast getElement ot HTMLINputELment to resolve error typescript not recognizing .value

    //console.log(selectedOpacity);
    //for ( var i = 0; i < totalAntennas; ++i ){
    //  antennaRadius[i].setStyle({fillOpacity:selectedOpacity});
    //}

    //live button is pressed
    if (document.getElementById("stateIndexLive").innerHTML == "pauseState") {
      antennaRadius_dict = antennaRadius_dict_glob_buffer; //redraw from the buffer that is always updated (even when pause is pressed)
      for (var id in antennaRadius_dict) {
        antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });
      }
    }
    else {
      for (var id in buffer_antennaRadius_dict) {
        buffer_antennaRadius_dict[id].setStyle({ fillOpacity: selectedOpacity });

      }
    }

  }

  //@HostListener('unloaded')
  ngOnDestroy() {
    // console.log('Items destroyed');
    antennaMarkers = [];
    antennaRadius = [];
    antennaMarkers_dict = {};
    antennaRadius_dict = {};
    if (this.kpisChannel.isSubscribed()) {
      this.kpisChannel.unsubscribe();
      this.Session.stop();
    }
    //groupCyrcles = L.featureGroup(); //to group circles

  }

  //groupCyrcles = L.featureGroup(); //to group circles

}


