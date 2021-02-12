import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
//import 'node_modules/leaflet-heatmap/leaflet-heatmap.js'
//import HeatmapOverlay from 'leaflet-heatmap'
//var HeatmapOverlay = require('leaflet-heatmap');


import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet'
import 'leaflet-timedimension';

import '../../../../../assets/AntennaPositionRandom';

declare let returnMarkersVar: any;

//import 'outData'; //need add outData.js on moduls+angular.json 
//declare let returnOutData:any;

//var GeoJSON = require('geojson');


export interface PeriodicElement {
  DataType: string;
  Value: any;
}


declare global {
  interface Window { my: any; }
}

@Component({
  selector: 'app-telefonica-mobility',
  templateUrl: './telefonica-mobility.component.html',
  styleUrls: ['./telefonica-mobility.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TelefonicaMobilityComponent implements OnInit {

  value = 1 //default opacity

  _jsonURL = '../../../../../assets/new_geoJson.json'
  //_outURL = '../../../../../assets/out.json'

  url: string = "https://toolbox.ibidaas.eu/qviz/";
  urlSafe: SafeResourceUrl;

  antID: any;
  displayedColumns: string[] = ['DataType', 'Value'];
  map: any;
  case1;
  layerControl;
  timesnew: any = []

  geoJSONTDLayer1: any;
  cc1: any;
  geoJSONTDLayer: any;
  cc2: any;
  pane1: any;

  constructor(private ngZone: NgZone,
    private http: HttpClient,
    public sanitizer: DomSanitizer
  ) {

  }

  public getJSON() {
    return this.http.get(this._jsonURL);
  }

  //public getOutJSON(){
  //  return this.http.get(this._outURL);
  //}

  ngOnInit() {

    //get antenna positions from the same file like KPIS!
    var markers = [];
    markers = returnMarkersVar();

    //var outData = [];
    //outData = returnOutData();



    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    /*
         let date = 1590969600000+32400000-2664000000; // get from ORIGINAL data (pernw to current time kai afairw 1 mhna gia na ftiaksw array me ta timestamps) <current time-1mhna-4wres giati sto loop ksekinaw +4 wres>
         var times_array = [];
         for (let g = 1; g <=185; g++) {
            //this.timesnew.push(date + g * 14400000)
            date = date+14400000;
            times_array.push(date);
          }
          //console.log(times_array);
          let myarray: any = [];
    
        //get AntennaLocations from the same file like KPIS
        var lat_list = [];
        var lon_list = [];
        for ( var i=0; i < markers.length-1000; ++i ){
          lat_list.push(markers[i].lat);
          lon_list.push(markers[i].lon);
        }
       
           //iterate to out.json gia na exw access sta data, kai apo ekei kanw tis allages sto myarray push+ pernw apo to lat_list-lon_list coords-(den me noiazei seira )
          //console.log(outData[1]);
    
          for (var i=0; i<outData.length; i++){
            //get list of load history
            var loadhistory = [];
            for (var key in outData[i].history){
              loadhistory.push(outData[i].history[key]);
            }
    
            myarray.push({ antID: outData[i].name, avg: outData[i].avg_users, load: loadhistory, times: times_array, lat: lat_list[i], lng: lon_list[i] })  //gia geojson 1k antennas
          }
    
        let mpla = GeoJSON.parse(myarray, { Point: ['lat', 'lng'] });
        let newjson = JSON.stringify(mpla) //THE NEW GEOJSON
        console.log(newjson) //copy this to the new_geoJson location !!!!!
    */

    /////////////////////////////



    var base = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 16,
      id: 'mapbox/navigation-guidance-day-v4',
      accessToken: 'pk.eyJ1IjoiYWFsZXhvcDQwNCIsImEiOiJjazV6YzJ2eWowODk4M2tvYjZ3bm9iN3p2In0.nMmRx_P4dgP2ah-H3jxkOg',


    });
    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });


    //bathymetryGroupLayer.addTo(this.map);

    //console.log(this.timesnew)

    this.map = L.map('mapid', {
      zoom: 12,
      center: [38.27846, -5.57],
      layers: [osmLayer],
      tfullscreenControl: true,
      timeDimensionControl: true,
      timeDimensionControlOptions: {
        title: "May 2020 data",
        timeSliderDragUpdate: true,
        loopButton: true,
        autoPlay: true,
        playerOptions: {
          transitionTime: 1000,
        },
        timeZones: ["Local"] ///change 
      },
      timeDimension: true,
    });

    var legend = L.control({ position: "topright" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend"),
        labels = ["<strong>Colors Table </strong><br><em> μ = mean number<br>of connected users </em><br>"];

      div.innerHTML += labels.push(
        '0.25μ' +
        '<hr style="background-color:#bdd7e7; border: 1px solid #bdd7e7; height:30px; width:30px; border-radius:50%">'
      );
      div.innerHTML += labels.push(
        '0.5μ' +
        '<hr style="background-color:#6baed6; border: 1px solid #6baed6;height:30px; width:30px; border-radius:50%">'
      );
      div.innerHTML += labels.push(
        '1μ' +
        '<hr style="background-color:#969696; border: 1px solid #969696;  height:30px; width:30px; border-radius:50%">'
      );
      div.innerHTML += labels.push(
        '1.5μ' +
        '<hr style="background-color:#fb6a4a; border: 1px solid #fb6a4a;  height:30px; width:30px; border-radius:50%">'
      );
      div.innerHTML += labels.push(
        '1.75μ' +
        '<hr style="background-color:#d7191c; border: 1px solid #d7191c;  height:30px; width:30px; border-radius:50%">'
      );

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(this.map);

    //heatmapLayer.setData(testData);

    this.layerControl = L.control.layers({

      "OSM": osmLayer,
      "Base": base,

    }, {}).addTo(this.map);

    // L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
    //   _getDisplayDateFormat: function (date) {
    //     return date.format("mmmm yyyy");
    //   }
    // });

    //var player = new L.TimeDimension.Player().addTo(this.map);
    //this.map.on('click',this.onMapClick);

    this.getJSON().subscribe(data => {
      //console.log(data);
      this.test(data, this.map)
    });

    //this.test(mpla, this.map)


  }

  // publicFunc(a) {
  //   this.ngZone.run(() => this.privateFunc(a));
  // }

  // privateFunc(a) {

  //   let et = this.map.timeDimension.getCurrentTimeIndex();
  //   console.log(a)

  // }


  onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
  }


  test(geojsonFeature, map) {

    this.pane1 = this.map.createPane('newpane')

    let timeindex = map.timeDimension.getCurrentTimeIndex()
    //console.log(timeindex)

    var icon = L.icon({
      iconUrl: 'assets/1.png', iconSize: [25, 25],
      iconAnchor: [12, 12]
    })

    var geojsonMarkerOptions = {
      pane: 'newpane',
      radius: 400,
      fillColor: null,
      opacity: 0,
      fillOpacity: 0,
      color: "lightgrey"
    };


    var aa = L.geoJSON(geojsonFeature, {

      pointToLayer: function (feature, latlng) {
        let timeindex = map.timeDimension.getCurrentTimeIndex()
        let colorpicker = feature.properties.load[timeindex] / feature.properties.avg //xroma - mean

        //console.log(feature.properties.load[timeindex])
        // console.log(feature.properties.load)
        if (colorpicker < 0.38) {
          geojsonMarkerOptions.fillColor = '#bdd7e7'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 0.76) {
          geojsonMarkerOptions.fillColor = '#6baed6'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1) {
          geojsonMarkerOptions.fillColor = '#969696'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1.25) {
          geojsonMarkerOptions.fillColor = '#969696'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1.63) {
          geojsonMarkerOptions.fillColor = '#fb6a4a'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else {
          geojsonMarkerOptions.fillColor = '#d7191c'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        return new L.circle(latlng, geojsonMarkerOptions)

      },


    });

    this.geoJSONTDLayer = L.timeDimension.layer.geoJson(aa, {
      updateTimeDimension: true,
      duration: null,
      updateTimeDimensionMode: 'replace',

    });



    var ab = L.geoJSON(geojsonFeature, {

      pointToLayer: function (feature, latLng) {
        if (feature.properties.load) {
          return new L.Marker(latLng, {
            icon: icon
          });
        }
      },
      onEachFeature: function (feature, layer) {

        if (feature.properties) {
          layer.bindPopup('Cell ID: <b>' + feature.properties.antID + '</b> <br>Users Connected: <b>' + feature.properties.load[map.timeDimension.getCurrentTimeIndex()] + '</b> <br> Avg Users Connected: <b>' + Math.round(feature.properties.avg) + '</b> <br> Lat: <b>' + feature.geometry.coordinates[1] + '</b> <br> Lng: <b>' + feature.geometry.coordinates[0]);
        }
      }

    });
    var geoJSONTDLayer1 = L.timeDimension.layer.geoJson(ab, {
      updateTimeDimension: true,
      duration: null,
      updateTimeDimensionMode: 'replace',
    });

    var cc = L.geoJSON(geojsonFeature, {

      pointToLayer: function (feature, latlng) {
        let timeindex = map.timeDimension.getCurrentTimeIndex()
        let colorpicker = feature.properties.load[timeindex] / feature.properties.avg

        if (colorpicker < 0.38) {
          geojsonMarkerOptions.fillColor = '#bdd7e7'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 0.76) {
          geojsonMarkerOptions.fillColor = '#6baed6'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1) {
          geojsonMarkerOptions.fillColor = '#969696'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1.25) {
          geojsonMarkerOptions.fillColor = '#969696'
          geojsonMarkerOptions.radius = 0;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1.63) {
          geojsonMarkerOptions.fillColor = '#fb6a4a'
          geojsonMarkerOptions.radius = 0;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else {
          geojsonMarkerOptions.fillColor = '#d7191c'
          geojsonMarkerOptions.radius = 0;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        return new L.circle(latlng, geojsonMarkerOptions)
      },


    });


    this.cc1 = L.timeDimension.layer.geoJson(cc, {
      updateTimeDimension: true,
      duration: null,
      updateTimeDimensionMode: 'replace',
    });

    var cc1 = L.geoJSON(geojsonFeature, {

      pointToLayer: function (feature, latlng) {
        let timeindex = map.timeDimension.getCurrentTimeIndex()
        let colorpicker = feature.properties.load[timeindex] / feature.properties.avg

        if (colorpicker < 0.38) {
          geojsonMarkerOptions.fillColor = '#bdd7e7'
          geojsonMarkerOptions.radius = 0;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 0.76) {
          geojsonMarkerOptions.fillColor = '#6baed6'
          geojsonMarkerOptions.radius = 0;
          geojsonMarkerOptions.fillOpacity = 0.8

        } else if (colorpicker < 1) {
          geojsonMarkerOptions.fillColor = '#969696'
          geojsonMarkerOptions.radius = 0;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1.25) {
          geojsonMarkerOptions.fillColor = '#969696'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else if (colorpicker < 1.63) {
          geojsonMarkerOptions.fillColor = '#fb6a4a'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        else {
          geojsonMarkerOptions.fillColor = '#d7191c'
          geojsonMarkerOptions.radius = 1700;
          geojsonMarkerOptions.fillOpacity = 0.8

        }
        return new L.circle(latlng, geojsonMarkerOptions)

      },


    });

    this.cc2 = L.timeDimension.layer.geoJson(cc1, {
      updateTimeDimension: true,
      duration: null,
      updateTimeDimensionMode: 'replace',
    });


    // ab.addTo(this.map);
    // aa.addTo(this.map);
    //this.case1 = L.layerGroup([geoJSONTDLayer, geoJSONTDLayer1])

    //this.layerControl.addOverlay(this.case1, 'asdfsaf');

    this.geoJSONTDLayer.addTo(this.map);
    geoJSONTDLayer1.addTo(this.map);




  }

  hidereds() {
    this.geoJSONTDLayer.removeFrom(this.map)
    this.cc2.removeFrom(this.map);
    this.cc1.addTo(this.map);
  }

  showreds() {
    this.geoJSONTDLayer.removeFrom(this.map)
    this.cc1.removeFrom(this.map);
    this.cc2.addTo(this.map);

  }

  showall() {
    this.cc1.removeFrom(this.map);
    this.cc2.removeFrom(this.map);
    this.geoJSONTDLayer.addTo(this.map)

  }

  adjustOp() {

    this.pane1.style.opacity = this.value;
  }


}


