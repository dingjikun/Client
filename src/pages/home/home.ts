import {Component, ViewChild, ElementRef} from '@angular/core';
import {UserserviceProvider} from "../../providers/userservice/userservice";
import { Geolocation } from '@ionic-native/geolocation';
import {Platform} from 'ionic-angular';
import { StockserviceProvider } from '../../providers/stockservice/stockservice';

declare var BMap;
declare var cordova:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  jd:number;
  wd:number;
  map:any;
  converter:any;
  @ViewChild('map') mapElement: ElementRef;

  constructor(private userService: UserserviceProvider, 
    private readonly geolocation:Geolocation, 
    private readonly platform: Platform,
    private readonly stockService:StockserviceProvider) {
    platform.ready().then(() => {
      this.gpsMap();
    });
  }

  ngOnInit() {
    this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });
    this.map.enableScrollWheelZoom();
    this.map.enableContinuousZoom();
    this.converter = new BMap.Convertor();
  }

  gpsMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.jd = resp.coords.longitude;
      this.wd = resp.coords.latitude;

      var points = [new BMap.Point(resp.coords.longitude,resp.coords.latitude)];
      this.converter.translate(points, 1, 5, (data) => {
        if (data.status === 0) {
          this.map.addOverlay(new BMap.Marker(data.points[0]));
          this.map.centerAndZoom(data.points[0], 19);
        }
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  capture() {
    // this.stockService.getStock({
    //   userID:3,
    //   categoryID:3,
    //   ossID:'ossid'
    // }).subscribe(data => {
    //   alert(data);
    // }
    // );
    cordova.plugins.videorecorder.recordVideo(this.userService.userID, this.jd, this.wd);
  }

}
