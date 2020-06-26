import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PostProvider } from '../../providers/post-provider';
import { App } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { FormGroup, FormControl } from '@angular/forms';

import chartJs from 'chart.js';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;

  latitude: any;
  longitude: any;
  radius: any;
  cabang_name: any;
  place_type: any;
  radiuz: any;
  scoope: any;
  sum_nearby: any;
  type_nearby: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public postPvdr: PostProvider,
    private app: App,
    public storage: Storage,
    public popoverCtrl: PopoverController
  ) {
    //code constructor
  }


  ionViewDidLoad() {

    this.storage.get('session_storage').then((res) => {

      if (
        res[0]['jabatan_name'] == 'IT Manager'
        || res[0]['jabatan_name'] == 'IT Senior Manager'
        || res[0]['jabatan_name'] == 'IT Programmer Coordinator'
        || res[0]['jabatan_name'] == 'IT Programmer Staff'
        || res[0]['jabatan_name'] == 'IT Implementator Staff'
        || res[0]['jabatan_name'] == 'IT Support Staff'
        || res[0]['jabatan_name'] == 'Business Development Director'
        || res[0]['jabatan_name'] == 'Marketing Director'
        || res[0]['jabatan_name'] == 'National General Trade Manager'
        || res[0]['jabatan_name'] == 'Deputy National General Trade Manager'
        || res[0]['jabatan_name'] == 'National Sales & Promotion Manager'
        || res[0]['jabatan_name'] == 'Vice President Director'
        || res[0]['jabatan_name'] == 'Sales & Distribution Director'
        || res[0]['jabatan_name'] == 'Group Brand Manager'
        || res[0]['jabatan_name'] == 'National Key Account Manager'
      ) {

        this.initMap(-6.1579074, 106.7190608, 13, 'Jakarta 1');

      } else {

        if (res[0]['cabang_id'] == '31') { //JK1
          this.initMap(-6.1579074, 106.7190608, 13, 'Jakarta 1');
        } else if (res[0]['cabang_id'] == '32') { //JK2
          this.initMap(-6.4166, 106.8352, 13, 'Jakarta 2');
        } else if (res[0]['cabang_id'] == '41') { //SBY
          this.initMap(-7.6497, 112.6401, 13, 'Surabaya');
        } else if (res[0]['cabang_id'] == '43') { //DPS
          this.initMap(-8.4181237, 115.1879839, 13, 'Denpasar');
        } else if (res[0]['cabang_id'] == '40') { //RG
          this.initMap(1.5161, 124.8483, 13, 'Regional Timur');
        } else if (res[0]['cabang_id'] == '30') { //RB
          this.initMap(1.1049, 104.0422, 13, 'Regional Barat');
        } else if (res[0]['cabang_id'] == '33') { //BDG
          this.initMap(-6.9259, 107.6186, 13, 'Bandung');
        } else if (res[0]['cabang_id'] == '42') { //SMG
          this.initMap(-7.1544, 110.4188, 13, 'Semarang');
        }

      }

    });

    // this.initMap(-6.17209, 106.8267068, 13, 'Jakarta 1');
  }

  initMap(x, y, zoom, cabang_name) {
    this.cabang_name = cabang_name;
    var posisi_x;
    var posisi_y;
    let yang_ke = 0;
    var myLatlng = { lat: x, lng: y };
    var map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: zoom,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: image
    });

    let content = "<h4>Location</h4>";

    google.maps.event.addListener(marker, 'dragend', () => {
      yang_ke++;
      var inputElement = <HTMLInputElement>document.getElementById('yang_ke');
      inputElement.value = yang_ke.toString();

      posisi_x = marker.getPosition().lat();
      posisi_y = marker.getPosition().lng();
      this.addInfoWindow(marker, content, map, posisi_x, posisi_y, yang_ke);
    });
  }

  addInfoWindow(marker, content, map, x, y, yang_ke) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      //infoWindow.open(map, marker);
      this.radius_setup(x, y, yang_ke);
    });
  }

  radius_setup(x, y, yang_ke) {
    if (parseInt((document.getElementById('yang_ke') as HTMLInputElement).value) == yang_ke) {
      const modal = this.modalCtrl.create(MoveanddragPage, { lat: x, long: y });
      modal.present();
      modal.onDidDismiss(vue => {
        if (vue) {
          this.outlet_radius(vue.lat, vue.long, vue.radius, vue.place_type);
        }
      });
    }
  }

  outlet_radius(x, y, r, place_type) {
    this.radiuz = (parseFloat(r)/1000).toFixed(2); 
    var rad = parseFloat(r);  //meters
    var theLat = parseFloat(x);  //decimal degrees
    var theLng = parseFloat(y);  //decimal degrees

    var yMin = theLat - (0.0000065 * rad);
    var xMin = theLng - (-0.0000065 * rad);

    var yMax = theLat + (0.0000065 * rad);
    var xMax = theLng + (-0.0000065 * rad);

    this.allRadiusRectangleOutletsales(yMin, yMax, xMin, xMax, x, y, r, place_type);
  }

  allRadiusRectangleOutletsales(j, k, l, m, x, y, r, place_type) {
    let body = {
      j: j,
      k: k,
      l: l,
      m: m,
      action: 'allRadiusRectangleOutletsalesNew'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {
      var icon;
      var alloutlet = [];


      if (data.success) {

        this.scoope = data.scoope;

        for (let i = 0; i < data.result.length; i++) {

          //pilih icon
          if (data.result[i]['color'] == '1') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '2') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '3') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '4') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '5') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['color'] == '6') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else if (data.result[i]['color'] == '7') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          } else if (data.result[i]['color'] == '8') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
          } else if (data.result[i]['color'] == '9') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '10') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '11') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '12') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '13') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['color'] == '14') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else if (data.result[i]['color'] == '15') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          } else if (data.result[i]['color'] == '16') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
          } else if (data.result[i]['color'] == '17') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '18') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '19') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '20') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '21') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '22') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '23') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['color'] == '24') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else if (data.result[i]['color'] == '25') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          } else if (data.result[i]['color'] == '26') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
          } else if (data.result[i]['color'] == '27') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '28') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '29') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '30') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          }

          alloutlet.push({
            lat: data.result[i]['lat'],
            lng: data.result[i]['long'],
            outletname: data.result[i]['outletname'],
            namasalesman: data.result[i]['namasalesman'],
            lastVisit: data.result[i]['lastVisit'],
            alamattoko: data.result[i]['alamattoko'],
            icon: icon
          }
          );

        }

        this.circle(x, y, r, alloutlet, place_type);

      } else {
        document.getElementById('load').style.display = 'none';
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {

      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  circle(x, y, r, alloutlet, place_type) {

    var service;
    var infowindow;
    var latitude;
    var longitude;
    var myLatlng = { lat: x, lng: y };
    var map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 13,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    for (let i = 0; i < alloutlet.length; i++) {
      latitude = parseFloat(alloutlet[i]['lat']);
      longitude = parseFloat(alloutlet[i]['lng']);
      var latlng = { lat: latitude, lng: longitude };

      var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: alloutlet[i]['icon']
      });

      var contentString =
        '<h4>' + alloutlet[i]['outletname'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
        '<div>' +
        '<p>' + alloutlet[i]['alamattoko'] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<p>' + alloutlet[i]['namasalesman'] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<p> Last Visit : ' + alloutlet[i]['lastVisit'] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
        '</p>' +
        '</div>';

      marker.content = contentString;

      var infoWindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'mouseover', function () {
        infoWindow.setContent(this.content);
        infoWindow.open(this.getMap(), this);
      });

    }


    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: myLatlng,
      radius: r
    });

    google.maps.event.addListener(cityCircle, 'click', () => {
      //percobaan call other function
      //this.getAnalytics(x, y, r, place_type);
    });


    if (place_type.length > 0) {

      var request = {
        location: myLatlng,
        radius: r,
        type: place_type
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function (results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

          var inputElement = <HTMLInputElement>document.getElementById('sum_nearby');
          inputElement.value = results.length;

          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            console.log('iki : ',place)
            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              icon: image
            });

            var contentString =
              '<h4>' + place.name + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
              '<div>' +
              '<p>' + place.types[0] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
              '<p>' + place.vicinity + '&nbsp;&nbsp;&nbsp;&nbsp;' +
              '<p>' + place.formatted_phone_number + '&nbsp;&nbsp;&nbsp;&nbsp;' +
              '</p>' +
              '</div>';

            marker.content = contentString;

            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'mouseover', function () {
              infoWindow.setContent(this.content);
              infoWindow.open(this.getMap(), this);
            });

          }
        }
      });

    }

    setTimeout(() => {
      this.button_analytic(x, y, r, place_type);

      if(place_type==""){
        this.type_nearby = "None Type";
      }else{
        this.type_nearby = place_type;
      }
      
      this.sum_nearby = parseFloat((document.getElementById('sum_nearby') as HTMLInputElement).value);
      document.getElementById('legend').style.display='';
    }, 1000)

  }

  getAnalytics(x, y, r, place_type) {
    alert('here');
  }

  button_analytic(x, y, r, place_type) {
    this.latitude = x;
    this.longitude = y;
    this.radius = r;
    this.place_type = place_type;
    document.getElementById('analytic_button').style.display = '';
  }

  open_data_analytics(x, y, r, place_type) {
    this.navCtrl.push(AnalyticsPage, { lat: x, long: y, radius: r, place_type: place_type });
  }

  cabanglist(ev, tanggal) {
    let popover = this.popoverCtrl.create(CabanglistPage);
    popover.present({
      ev: ev
    });

    //setup wilayah sesuai dengan wilayah cabang
    popover.onDidDismiss(data => {

      if (data) {

        if (data.chosee == '31') { //JK1
          this.initMap(-6.2147318, 106.7106443, 12, 'Jakarta 1');
        } else if (data.chosee == '32') { //JK2
          this.initMap(-6.4166, 106.8352, 11, 'Jakarta 2');
        } else if (data.chosee == '41') { //SBY
          this.initMap(-7.6497, 112.6401, 9, 'Surabaya');
        } else if (data.chosee == '43') { //DPS
          this.initMap(-8.4181237, 115.1879839, 10, 'Denpasar');
        } else if (data.chosee == '40') { //RG
          this.initMap(1.5161, 124.8483, 12, 'Regional Timur');
        } else if (data.chosee == '30') { //RB
          this.initMap(1.1049, 104.0422, 12, 'Regional Barat');
        } else if (data.chosee == '33') { //BDG
          this.initMap(-6.9259, 107.6186, 12, 'Bandung');
        } else if (data.chosee == '42') { //SMG
          this.initMap(-7.1544, 110.4188, 11, 'Semarang');
        }
      }
    });
  }

  menu(ev) {
    let popover = this.popoverCtrl.create(MenusPage);
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {

      if (data) {
        if (data.menu == 'tracking_sales') {
          this.app.getRootNav().setRoot(TrackingsalesPage);
        }
        if (data.menu == 'data_analytics') {
          this.app.getRootNav().setRoot(HomePage);
        }
        if (data.menu == 'all_outlets') {
          this.app.getRootNav().setRoot(AlloutletPage);
        }
        if (data.menu == 'all_counters') {
          this.app.getRootNav().setRoot(AllcountertPage);
        }
        if (data.menu == 'product_mapping') {
          this.app.getRootNav().setRoot(ProductdistributionPage);
        }
        if (data.menu == 'expansion') {
          this.app.getRootNav().setRoot(ExpansionPage);
        }
        if (data.menu == 'settings') {
          const modal = this.modalCtrl.create(SettingPage);
          modal.present();
        }
        if (data.menu == 'logout') {
          this.storage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        }
      }

    });
  }

}


@Component({
  templateUrl: 'trackingsales.html'
})
export class TrackingsalesPage {

  today = new Date();
  date = this.today.getFullYear() + '-' + this.benarMonth((this.today.getMonth() + 1)) + '-' + this.benarDate(this.today.getDate());
  cabang_name: any;
  kode_cabang: any;
  animation_directions: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private app: App,
    public storage: Storage,
    public postPvdr: PostProvider) {
  }

  ionViewDidLoad() {


    this.storage.get('session_storage').then((res) => {

      if (
        res[0]['jabatan_name'] == 'IT Manager'
        || res[0]['jabatan_name'] == 'IT Senior Manager'
        || res[0]['jabatan_name'] == 'IT Programmer Coordinator'
        || res[0]['jabatan_name'] == 'IT Programmer Staff'
        || res[0]['jabatan_name'] == 'IT Implementator Staff'
        || res[0]['jabatan_name'] == 'IT Support Staff'
        || res[0]['jabatan_name'] == 'Business Development Director'
        || res[0]['jabatan_name'] == 'Marketing Director'
        || res[0]['jabatan_name'] == 'National General Trade Manager'
        || res[0]['jabatan_name'] == 'Deputy National General Trade Manager'
        || res[0]['jabatan_name'] == 'National Sales & Promotion Manager'
        || res[0]['jabatan_name'] == 'Vice President Director'
        || res[0]['jabatan_name'] == 'Sales & Distribution Director'
        || res[0]['jabatan_name'] == 'Group Brand Manager'
        || res[0]['jabatan_name'] == 'National Key Account Manager'
      ) {

        this.initMap(-6.2147318, 106.7106443, 12, 31, 'Jakarta 1', this.date);

      } else {

        if (res[0]['cabang_id'] == '31') { //JK1
          this.initMap(-6.2147318, 106.7106443, 12, 31, 'Jakarta 1', this.date);
        } else if (res[0]['cabang_id'] == '32') { //JK2
          this.initMap(-6.4166, 106.8352, 11, 32, 'Jakarta 2', this.date);
        } else if (res[0]['cabang_id'] == '41') { //SBY
          this.initMap(-7.6497, 112.6401, 9, 41, 'Surabaya', this.date);
        } else if (res[0]['cabang_id'] == '43') { //DPS
          this.initMap(-8.4181237, 115.1879839, 10, 43, 'Denpasar', this.date);
        } else if (res[0]['cabang_id'] == '40') { //RG
          this.initMap(1.5161, 124.8483, 12, 40, 'Regional Timur', this.date);
        } else if (res[0]['cabang_id'] == '30') { //RB
          this.initMap(1.1049, 104.0422, 12, 30, 'Regional Barat', this.date);
        } else if (res[0]['cabang_id'] == '33') { //BDG
          this.initMap(-6.9259, 107.6186, 12, 33, 'Bandung', this.date);
        } else if (res[0]['cabang_id'] == '42') { //SMG
          this.initMap(-7.1544, 110.4188, 11, 42, 'Semarang', this.date);
        }

      }

    });


  }

  initMap(lat, lng, zoom, kdcabang, namacabang, date) {

    this.cabang_name = namacabang;
    this.date = date;
    this.kode_cabang = kdcabang;

    var myLatlng = { lat: lat, lng: lng };
    var map = new google.maps.Map(document.getElementById('atlas'), {
      zoom: zoom,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    //loading
    document.getElementById('loading').style.display = '';

    let body = {
      kdcabang: kdcabang,
      tanggal: date,
      action: 'getLastlocationsales'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {
      //loading
      document.getElementById('loading').style.display = 'none';

      if (data.success) {

        for (let i = 0; i < data.result.length; i++) {

          var image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          var latlng = { lat: parseFloat(data.result[i]['lat']), lng: parseFloat(data.result[i]['long']) }
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: image
          });

          var contentString =
            '<h4>' + data.result[i]['outletname'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
            '<div>' +
            '<p><b>Kode Outlet : </b>' + data.result[i]['kdoutlet'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
            '<p><b>Nama Sales : </b>' + data.result[i]['namasalesman'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
            '<p><b>Kode Sales : </b>' + data.result[i]['kdsalesman'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
            '<p><b>Cek In : </b>' + data.result[i]['WaktuIn'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
            '<p><b>Cek Out : </b>' + data.result[i]['WaktuOut'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
            '<p><b>Avg 3 Mon : </b>' + data.result[i]['avg3mon'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
            '<p><b>Actual : </b>' + data.result[i]['actual'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
            '</p>' +
            '</div>';

          marker.content = contentString;

          var infoWindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.setContent(this.content);
            infoWindow.open(this.getMap(), this);
          });

          google.maps.event.addListener(marker, 'click', () => {
            this.detailSalesman(data.result[i]['kdsalesman'], data.result[i]['namasalesman'], kdcabang, date, myLatlng, zoom);
          });

        }

      } else {

        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }
    }, error => {
      //loading
      document.getElementById('loading').style.display = 'none';
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Lost Connected',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  detailSalesman(kdsalesman, salesmanname, kdcabang, date, myLatlng, zoom) {
    const prompt = this.alertCtrl.create({
      title: 'Salesman Trip',
      message: "Let's to see " + kdsalesman + " " + salesmanname + " trip",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //code
          }
        },
        {
          text: 'Ok',
          handler: data => {

            var markerArray = [];

            // Instantiate a directions service.
            var directionsService = new google.maps.DirectionsService;

            var map = new google.maps.Map(document.getElementById('atlas'), {
              zoom: zoom,
              center: myLatlng,
              rotateControl: false,
              fullscreenControl: false,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: true,
              streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
              },
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
              }
            });

            let body = {
              kdcabang: kdcabang,
              kdsalesman: kdsalesman,
              tanggal: date,
              action: 'getAllPositionSalesman'
            };

            this.postPvdr.postData(body, 'read').subscribe((key) => {


              if (key.success) {

                let lat_from;
                let lng_from;
                let lat_from2;
                let lng_from2;

                this.animation_directions = [];
                for (let j = 0; j < key.result.length; j++) {

                  var image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
                  var latlng = { lat: parseFloat(key.result[j]['lat']), lng: parseFloat(key.result[j]['long']) }
                  var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    icon: image
                  });


                  lat_from2 = parseFloat(key.result[j]['lat']);
                  lng_from2 = parseFloat(key.result[j]['long']);

                  if ((lat_from2 != lat_from && lng_from2 != lng_from)) {

                    this.animation_directions.push(
                      {
                        lat: parseFloat(key.result[j]['lat']),
                        lng: parseFloat(key.result[j]['long'])
                      });

                  }

                  lat_from = parseFloat(key.result[j]['lat']);
                  lng_from = parseFloat(key.result[j]['long']);


                  var contentString =
                    '<h4>' + key.result[j]['outletname'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
                    '<div>' +
                    '<p><b>Nama Sales : </b>' + salesmanname + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<p><b>Kode Sales : </b>' + kdsalesman + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<p><b>Cek In : </b>' + key.result[j]['WaktuIn'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<p><b>Cek Out : </b>' + key.result[j]['WaktuOut'] + ' &nbsp;&nbsp;&nbsp;&nbsp;' +
                    '</p>' +
                    '</div>';

                  marker.content = contentString;

                  var infoWindow = new google.maps.InfoWindow();
                  google.maps.event.addListener(marker, 'mouseover', function () {
                    infoWindow.setContent(this.content);
                    infoWindow.open(this.getMap(), this);
                  });

                }

                var lineSymbol = {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 5,
                  strokeColor: '#393'
                };

                var line = new google.maps.Polyline({
                  path: this.animation_directions,
                  icons: [{
                    icon: lineSymbol,
                    offset: '100%'
                  }],
                  map: map
                });

                var count = 0;
                window.setInterval(function () {
                  count = (count + 1) % 200;

                  var icons = line.get('icons');
                  icons[0].offset = (count / 2) + '%';
                  line.set('icons', icons);
                }, 50);



              } else {
                const alert = this.alertCtrl.create({
                  title: 'Opps I am Sorry',
                  subTitle: 'Data Not Found.',
                  buttons: ['OK']
                });
                alert.present();
              }
            }, error => {
              const alert = this.alertCtrl.create({
                title: 'Opps I am Sorry',
                subTitle: 'Not Connected From Server.',
                buttons: ['OK']
              });
              alert.present();
            });

          }
        }
      ]
    });
    prompt.present();
  }

  salesmanlist(ev, id, name, tanggal) {

    //popover
    let popover = this.popoverCtrl.create(SalesmanlistPage, { cabang_id: id, cabang_name: name, tanggal: tanggal });
    popover.present({
      ev: ev
    });

    //ketika popover di tutup
    popover.onDidDismiss(res => {

      if (res) {
        //your code
      }
    });

  }

  cabanglist(ev, tanggal) {
    let popover = this.popoverCtrl.create(CabanglistPage);
    popover.present({
      ev: ev
    });

    //setup wilayah sesuai dengan wilayah cabang
    popover.onDidDismiss(data => {

      if (data) {

        if (data.chosee == '31') { //JK1
          this.initMap(-6.2147318, 106.7106443, 12, 31, 'Jakarta 1', this.date);
        } else if (data.chosee == '32') { //JK2
          this.initMap(-6.4166, 106.8352, 11, 32, 'Jakarta 2', this.date);
        } else if (data.chosee == '41') { //SBY
          this.initMap(-7.6497, 112.6401, 9, 41, 'Surabaya', this.date);
        } else if (data.chosee == '43') { //DPS
          this.initMap(-8.4181237, 115.1879839, 10, 43, 'Denpasar', this.date);
        } else if (data.chosee == '40') { //RG
          this.initMap(1.5161, 124.8483, 12, 40, 'Regional Timur', this.date);
        } else if (data.chosee == '30') { //RB
          this.initMap(1.1049, 104.0422, 12, 30, 'Regional Barat', this.date);
        } else if (data.chosee == '33') { //BDG
          this.initMap(-6.9259, 107.6186, 12, 33, 'Bandung', this.date);
        } else if (data.chosee == '42') { //SMG
          this.initMap(-7.1544, 110.4188, 11, 42, 'Semarang', this.date);
        }
      }
    });
  }

  changedate(ev) {

    let popover = this.popoverCtrl.create(DatelistPage, { kdcabang: this.kode_cabang });
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {

      if (data) {
        if (data.kdcabang == '31') { //JK1
          this.initMap(-6.2147318, 106.7106443, 12, 31, 'Jakarta 1', data.date);
        } else if (data.kdcabang == '32') { //JK2
          this.initMap(-6.4166, 106.8352, 11, 32, 'Jakarta 2', data.date);
        } else if (data.kdcabang == '41') { //SBY
          this.initMap(-7.6497, 112.6401, 9, 41, 'Surabaya', data.date);
        } else if (data.kdcabang == '43') { //DPS
          this.initMap(-8.4181237, 115.1879839, 10, 43, 'Denpasar', data.date);
        } else if (data.kdcabang == '40') { //RG
          this.initMap(1.5161, 124.8483, 12, 40, 'Regional Timur', data.date);
        } else if (data.kdcabang == '30') { //RB
          this.initMap(1.1049, 104.0422, 12, 30, 'Regional Barat', data.date);
        } else if (data.kdcabang == '33') { //BDG
          this.initMap(-6.9259, 107.6186, 12, 33, 'Bandung', data.date);
        } else if (data.kdcabang == '42') { //SMG
          this.initMap(-7.1544, 110.4188, 11, 42, 'Semarang', data.date);
        }
      }

    });
  }

  menu(ev) {
    let popover = this.popoverCtrl.create(MenusPage);
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {

      if (data) {
        if (data.menu == 'tracking_sales') {
          this.app.getRootNav().setRoot(TrackingsalesPage);
        }
        if (data.menu == 'data_analytics') {
          this.app.getRootNav().setRoot(HomePage);
        }
        if (data.menu == 'all_outlets') {
          this.app.getRootNav().setRoot(AlloutletPage);
        }
        if (data.menu == 'all_counters') {
          this.app.getRootNav().setRoot(AllcountertPage);
        }
        if (data.menu == 'product_mapping') {
          this.app.getRootNav().setRoot(ProductdistributionPage);
        }
        if (data.menu == 'expansion') {
          this.app.getRootNav().setRoot(ExpansionPage);
        }
        if (data.menu == 'settings') {
          const modal = this.modalCtrl.create(SettingPage);
          modal.present();
        }
        if (data.menu == 'logout') {
          this.storage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        }
      }

    });
  }

  //perbaikan format bulan
  benarMonth(m) {
    if (m * 1 < 10) {
      m = '0' + m;
    } else {
      m = m;
    }

    return m;
  }

  //perbaikan format tanggal
  benarDate(d) {
    if (d * 1 < 10) {
      d = '0' + d;
    } else {
      d = d;
    }

    return d;
  }

}


@Component({
  templateUrl: 'login.html'
})
export class LoginPage {

  username:any;
  password:any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public storage: Storage) {
  }

  ionViewDidLoad() {

    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let user = splitParams[0].split('=');
      this.username = user[1];
      let pass = splitParams[1].split('=');
      this.password = pass[1];
      
      this.storage.set('seasson_user_auto_login', 'Yes');
      this.processLogin(this.username,this.password,'autologin');
      
    }

  }

  loginform() {

    const prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Please Enter Username dan Password.",
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //code cancel
          }
        },
        {
          text: 'Login',
          handler: data => {
            this.processLogin(data.username,data.password,'manuallogin');
          }
        }
      ]
    });
    prompt.present();
  }

  processLogin(username,password,tipe){
    console.log(username,password,tipe)
    let body = {
      username: username,
      password: password,
      tipe:tipe,
      action: 'cekAutoLogin'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {


      if (data.success) {

        this.storage.set('session_storage', data.result);
        this.navCtrl.setRoot(TrackingsalesPage);

      } else {

        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Access Denied.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {

      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });
  }

}


@Component({
  templateUrl: 'analytics.html'
})
export class AnalyticsPage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('barCanvas2') barCanvas2;
  @ViewChild('barCanvas3') barCanvas3;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('maps') mapContainer: ElementRef;

  maps: any;
  barChart: any;
  barChart2: any;
  lineChart: any;
  pieChart: any;
  doughnutChart: any;
  polarareaChart: any;

  lat: any;
  long: any;
  radius: any;
  rad: any;
  place_type: any;
  outlet = [];
  outlets = [];
  results = [];
  pcode_outlets = [];
  pcode_results = [];
  kontribusi_brand_nama = [];
  kontribusi_brand_sales = [];
  data_month_per_month = [];
  data_sales_per_month = [];
  data_sales_equivalent: any;
  data_month_equivalent: any;
  warna = [];
  tots: Number = 0;
  tot_sales: Number;

  j: any; k: any; l: any; m: any;
  constructor(

    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public postPvdr: PostProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController

  ) {
    this.lat = navParams.get("lat");
    this.long = navParams.get("long");
    this.radius = navParams.get("radius");
    this.place_type = navParams.get("place_type");
    // this.rad = Math.round(parseFloat(navParams.get("radius")) / 1000);
    this.rad = (parseFloat(navParams.get("radius")) / 1000).toFixed(2);

  }

  ionViewDidEnter() {
    this.initMap(this.lat, this.long, this.radius, this.place_type);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.get_radius_circle(this.lat, this.long, this.radius);
    }, 150)
    setTimeout(() => {
      //your code
    }, 250)
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  initMap(x, y, r, place_type) {

    var rad = parseFloat(r)  //meters
    var theLat = parseFloat(x);  //decimal degrees
    var theLng = parseFloat(y);  //decimal degrees

    var yMin = theLat - (0.0000065 * rad);
    var xMin = theLng - (-0.0000065 * rad);

    var yMax = theLat + (0.0000065 * rad);
    var xMax = theLng + (-0.0000065 * rad);

    this.getMapsSelectedOutlet(yMin, yMax, xMin, xMax, x, y, r, place_type);

  }

  getMapsSelectedOutlet(j, k, l, m, x, y, r, place_type) {

    let body = {
      j: j,
      k: k,
      l: l,
      m: m,
      action: 'allRadiusRectangleOutletsales'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      var icon;
      var alloutlet = [];

      if (data.success) {

        for (let i = 0; i < data.result.length; i++) {

          //pilih icon
          if (data.result[i]['color'] == '1') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '2') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '3') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '4') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '5') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['color'] == '6') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else if (data.result[i]['color'] == '7') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          } else if (data.result[i]['color'] == '8') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
          } else if (data.result[i]['color'] == '9') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '10') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '11') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '12') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '13') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['color'] == '14') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else if (data.result[i]['color'] == '15') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          } else if (data.result[i]['color'] == '16') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
          } else if (data.result[i]['color'] == '17') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '18') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '19') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '20') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '21') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '22') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['color'] == '23') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['color'] == '24') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else if (data.result[i]['color'] == '25') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          } else if (data.result[i]['color'] == '26') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
          } else if (data.result[i]['color'] == '27') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['color'] == '28') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['color'] == '29') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['color'] == '30') {
            icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          }

          alloutlet.push({
            lat: data.result[i]['lat'],
            lng: data.result[i]['long'],
            icon: icon
          }
          );

        }

        this.circle_area(x, y, r, alloutlet, place_type);

      } else {

        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {

      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  circle_area(x, y, r, alloutlet, place_type) {
    var service;
    var infowindow;
    var latitude;
    var longitude;
    var myLatlng = { lat: x, lng: y };
    var map = new google.maps.Map(document.getElementById('maps'), {
      zoom: 13,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    for (let i = 0; i < alloutlet.length; i++) {
      latitude = parseFloat(alloutlet[i]['lat']);
      longitude = parseFloat(alloutlet[i]['lng']);
      var latlng = { lat: latitude, lng: longitude };

      var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: alloutlet[i]['icon']
      });

    }


    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: myLatlng,
      radius: r
    });

    if (place_type.length > 0) {
      var request = {
        location: myLatlng,
        radius: r,
        type: place_type
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function (results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            var outlet_name = place.name;
            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              icon: image
            });

            google.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent(place.name);
              infowindow.open(map, this);
            });
          }
        }
      });

    }

  }

  get_radius_circle(x, y, r) {

    var rad = parseFloat(r)  //meters
    var theLat = parseFloat(x);  //decimal degrees
    var theLng = parseFloat(y);  //decimal degrees

    var yMin = theLat - (0.0000065 * rad);
    var xMin = theLng - (-0.0000065 * rad);

    var yMax = theLat + (0.0000065 * rad);
    var xMax = theLng + (-0.0000065 * rad);

    this.viewDataSales(yMin, yMax, xMin, xMax)

  }

  viewDataSales(j, k, l, m) {

    this.j = j;
    this.k = k;
    this.l = l;
    this.m = m;

    //loading
    const loader = this.loadingCtrl.create({
      //content: "Loading...",
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box">
           <img src="assets/imgs/loader.gif" width='50' height='50'/>
        </div>
      </div>`,
    });
    loader.present();

    let body = {
      j: j,
      k: k,
      l: l,
      m: m,
      action: 'allRadiusCircleRectangleOutletsales'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      //loaoding
      loader.dismiss();

      if (data.success) {

        let jml = 0;
        for (let i = 0; i < data.dataListOutlet.result.length; i++) {
          this.outlet.push(
            {
              KdOutlet: data.dataListOutlet.result[i]['KdOutlet'],
              outletname: data.dataListOutlet.result[i]['outletname'],
              KotaToko: data.dataListOutlet.result[i]['KotaToko'],
              Alm1Toko: data.dataListOutlet.result[i]['Alm1Toko'],
              latitude: data.dataListOutlet.result[i]['lat'],
              longitude: data.dataListOutlet.result[i]['long']
            });
          jml++;
        }

        var tot_sales = 0;
        for (let j = 0; j < data.data_detail_sales_outlet.result.length; j++) {

          this.outlets.push(
            data.data_detail_sales_outlet.result[j]['outletname']
          );

          this.results.push(
            data.data_detail_sales_outlet.result[j]['netto3month']
          );
          tot_sales += parseFloat(data.data_detail_sales_outlet.result[j]['netto3month']);
        }

        this.tot_sales = tot_sales;

        for (let k = 0; k < data.data_detail_pcode_outlet.result.length; k++) {
          //dilimit aja jadi TOP Ten PCode
          if (k < 10) {
            this.pcode_outlets.push(
              data.data_detail_pcode_outlet.result[k]['namabarang']
            );

            this.pcode_results.push(
              data.data_detail_pcode_outlet.result[k]['quantity3month']
            );
          }

        }

        this.data_month_equivalent = ['Average3Months : ' + data.data_detail_sales_equivalent.result[0]['evg'] + '%', 'Actual : ' + data.data_detail_sales_equivalent.result[0]['act'] + '%'];
        this.data_sales_equivalent = [data.data_detail_sales_equivalent.result[0]['monthevg'], data.data_detail_sales_equivalent.result[0]['monthreal']];

        for (let u = 0; u < data.data_detail_sales_kontribusi_brand.result.length; u++) {
          //dilimit aja jadi TOP Ten PCode

          this.kontribusi_brand_nama.push(
            data.data_detail_sales_kontribusi_brand.result[u]['namabrand']
          );

          this.kontribusi_brand_sales.push(
            data.data_detail_sales_kontribusi_brand.result[u]['tot_netto']
          );

        }

        this.data_month_per_month = [
          data.data_detail_sales_per_month.result[0]['bulan1'],
          data.data_detail_sales_per_month.result[0]['bulan2'],
          data.data_detail_sales_per_month.result[0]['bulan3'],
          data.data_detail_sales_per_month.result[0]['bulan4'],
          data.data_detail_sales_per_month.result[0]['bulan5'],
          data.data_detail_sales_per_month.result[0]['bulan6'],
          data.data_detail_sales_per_month.result[0]['bulan7'],
          data.data_detail_sales_per_month.result[0]['bulan8'],
          data.data_detail_sales_per_month.result[0]['bulan9'],
          data.data_detail_sales_per_month.result[0]['bulan10'],
          data.data_detail_sales_per_month.result[0]['bulan11'],
          data.data_detail_sales_per_month.result[0]['bulan12']
        ];
        this.data_sales_per_month = [
          data.data_detail_sales_per_month.result[0]['month1'],
          data.data_detail_sales_per_month.result[0]['month2'],
          data.data_detail_sales_per_month.result[0]['month3'],
          data.data_detail_sales_per_month.result[0]['month4'],
          data.data_detail_sales_per_month.result[0]['month5'],
          data.data_detail_sales_per_month.result[0]['month6'],
          data.data_detail_sales_per_month.result[0]['month7'],
          data.data_detail_sales_per_month.result[0]['month8'],
          data.data_detail_sales_per_month.result[0]['month9'],
          data.data_detail_sales_per_month.result[0]['month10'],
          data.data_detail_sales_per_month.result[0]['month11'],
          data.data_detail_sales_per_month.result[0]['month12']
        ];

        var colors = [
          'rgb(147,112,219)',
          'rgb(138,43,226)',
          'rgb(148,0,211)',
          'rgb(153,50,204)',
          'rgb(139,0,139)',
          'rgb(128,0,128)',
          'rgb(75,0,130)',
          'rgb(106,90,205)',
          'rgb(72,61,139)',
          'rgb(230,230,250)',
          'rgb(216,191,216)',
          'rgb(221,160,221)',
          'rgb(238,130,238)',
          'rgb(218,112,214)',
          'rgb(255,0,255)',
          'rgb(255,0,255)',
          'rgb(186,85,211)',
          'rgb(173,255,47)',
          'rgb(127,255,0)',
          'rgb(124,252,0)',
          'rgb(0,255,0)',
          'rgb(50,205,50)',
          'rgb(152,251,152)',
          'rgb(144,238,144)',
          'rgb(0,250,154)',
          'rgb(0,255,127)',
          'rgb(60,179,113)',
          'rgb(46,139,87)',
          'rgb(34,139,34)',
          'rgb(0,128,0)',
          'rgb(0,100,0)',
          'rgb(154,205,50)',
          'rgb(107,142,35)',
          'rgb(128,128,0)',
          'rgb(85,107,47)',
          'rgb(102,205,170)',
          'rgb(143,188,143)',
          'rgb(32,178,170)',
          'rgb(0,139,139)',
          'rgb(0,128,128)',
          'rgb(0,255,255)',
          'rgb(0,255,255)',
          'rgb(224,255,255)',
          'rgb(175,238,238)',
          'rgb(127,255,212)',
          'rgb(64,224,208)',
          'rgb(72,209,204)',
          'rgb(0,206,209)',
          'rgb(95,158,160)',
          'rgb(70,130,180)',
          'rgb(176,196,222)',
          'rgb(176,224,230)',
          'rgb(173,216,230)',
          'rgb(135,206,235)',
          'rgb(135,206,250)',
          'rgb(0,191,255)',
          'rgb(30,144,255)',
          'rgb(100,149,237)',
          'rgb(123,104,238)',
          'rgb(65,105,225)',
          'rgb(0,0,255)',
          'rgb(0,0,205)',
          'rgb(0,0,139)',
          'rgb(0,0,128)',
          'rgb(25,25,112)',
          'rgb(255,248,220)',
          'rgb(255,235,205)',
          'rgb(255,228,196)',
          'rgb(255,222,173)',
          'rgb(245,222,179)',
          'rgb(222,184,135)',
          'rgb(210,180,140)',
          'rgb(188,143,143)',
          'rgb(244,164,96)',
          'rgb(218,165,32)',
          'rgb(184,134,11)',
          'rgb(205,133,63)',
          'rgb(210,105,30)',
          'rgb(139,69,19)',
          'rgb(160,82,45)',
          'rgb(165,42,42)',
          'rgb(128,0,0)',
          'rgb(255,160,122)',
          'rgb(255,127,80)',
          'rgb(255,99,71)',
          'rgb(255,69,0)',
          'rgb(255,140,0)',
          'rgb(255,165,0)',
          'rgb(255,192,203)',
          'rgb(255,182,193)',
          'rgb(255,105,180)',
          'rgb(255,20,147)',
          'rgb(199,21,133)',
          'rgb(219,112,147)'
        ];

        for (let e = 0; e < data.data_detail_sales_outlet.result.length; e++) {

          this.warna.push(
            colors[e]
          );

        }

        this.tots = jml;
        this.getBarChart(this.results, this.outlets, this.warna);
        this.getBarChart2(this.pcode_results, this.pcode_outlets);
        this.getBarChart3(this.data_month_per_month, this.data_sales_per_month);
        this.getDoughnutChart(this.data_month_equivalent, this.data_sales_equivalent);
        this.getPieChart(this.kontribusi_brand_nama, this.kontribusi_brand_sales);

      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {

      //loaoding
      loader.dismiss();

      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  getBarChart(length, arrays, warna) {

    const data = {
      labels: arrays,
      datasets: [{
        label: 'Sales',
        data: length,
        backgroundColor: warna,
        borderWidth: 1
      }]
    };

    const options = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options);
  }

  getBarChart2(length, arrays) {

    const data = {
      type: 'horizontalBar',
      labels: arrays,
      datasets: [{
        label: 'Total Sales : ',
        data: length,
        backgroundColor: [
          'rgb(255, 0, 0)',
          'rgb(20, 0, 255)',
          'rgb(255, 230, 0)',
          'rgb(0, 255, 10)',
          'rgb(60, 0, 70)',
          'rgb(255, 94, 0)',
          'rgb(255, 0, 251)',
          'rgb(171, 214, 0)',
          'rgb(153, 73, 73)',
          'rgb(173, 173, 123)'
        ],
        borderWidth: 1
      }]
    };

    const options = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    var myBarChart = new chartJs(this.barCanvas2.nativeElement, {
      type: 'horizontalBar',
      data: data,
      options: options
    });

    //tidak digunakan karena dengan menampilkan dengan spesifikasi tertentu
    //return this.getChart(this.barCanvas2.nativeElement, 'bar', data, options);
  }

  getBarChart3(length, arrays) {

    const data = {
      labels: length,
      datasets: [{
        type: 'line',
        label: 'Sales',
        data: arrays,
        fill: false,
        borderColor: 'rgb(252, 186, 3)',
        borderWidth: 4
      }, {
        type: 'bar',
        label: 'Sales',
        data: arrays,
        backgroundColor: [

          'rgb(200, 6, 0)',
          'rgb(36, 0, 255)',
          'rgb(252, 240, 3)',

          'rgb(255, 0, 225)',
          'rgb(0, 255, 225)',
          'rgb(255, 166, 0)',

          'rgb(173, 113, 61)',
          'rgb(255, 232, 212)',
          'rgb(35, 120, 83)',

          'rgb(79, 57, 69)',
          'rgb(161, 255, 46)',
          'rgb(173, 104, 104)'

        ],
        borderWidth: 1
      }
      ]
    };

    const options = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.barCanvas3.nativeElement, 'bar', data, options);
  }

  getPieChart(brand, salesbrand) {
    const data = {
      labels: brand,
      datasets: [{
        data: salesbrand,
        backgroundColor: ['rgb(200, 6, 0)', 'rgb(36, 0, 255)', 'rgb(255, 8, 222)']
      }]
    }

    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }

  getDoughnutChart(month, salesofmonth) {

    const data = {
      labels: month,
      datasets: [{
        label: 'Teste Chart',
        data: salesofmonth,
        backgroundColor: [
          'rgb(0, 244, 97)',
          'rgb(37, 39, 43)'
          //'rgb(255, 207, 0)'
        ]
      }]
    }

    return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data);
  }

  open_outlet(kode_outlet, nama_outlet, lat, lng) {
    this.navCtrl.push(OutletPage, { kode_outlet: kode_outlet, nama_outlet: nama_outlet, lat: lat, lng: lng });
  }

  list_all_product_outlet(j, k, l, m) {
    const modal = this.modalCtrl.create(ListproductPage, { j: j, k: k, l: l, m: m });
    modal.present();
  }

  list_sales_outlet(j, k, l, m) {
    const modal = this.modalCtrl.create(ListsalesoutletPage, { j: j, k: k, l: l, m: m });
    modal.present();
  }

}


@Component({
  templateUrl: 'moveanddrag.html'
})
export class MoveanddragPage {

  radius: number = 0;
  lat: any;
  long: any;
  place_type: any;
  langs;
  langForm;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.getCurrentData(navParams.get("lat"), navParams.get("long"));

    this.langForm = new FormGroup({
      "langs": new FormControl({ value: 'none', disabled: false })
    });

  }

  getCurrentData(lat, long) {
    this.lat = lat;
    this.long = long;
  }

  doSubmit(event) {
    alert('Submitting form ' + this.langForm.value + ' Radius : ' + this.radius);
    event.preventDefault();
  }

  apply() {
    var place_type;
    if (this.place_type == 'none') {
      place_type = []
    } else {
      place_type = [this.place_type]
    }

    this.viewCtrl.dismiss({ lat: this.lat, long: this.long, radius: this.radius, place_type: place_type });
  }

  close() {
    this.viewCtrl.dismiss();
  }

}


@Component({
  templateUrl: 'outlet.html'
})
export class OutletPage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  barChart: any;
  lineChart: any;
  pieChart: any;
  doughnutChart: any;

  kode_outlet: any;
  nama_outlet: any;
  lat: any;
  lng: any;


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams) {
    this.kode_outlet = navParams.get("kode_outlet");
    this.nama_outlet = navParams.get("nama_outlet");
    this.lat = parseFloat(navParams.get("lat"));
    this.lng = parseFloat(navParams.get("lng"));

  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    var myLatlng = { lat: this.lat, lng: this.lng };
    var map = new google.maps.Map(document.getElementById('peta'), {
      zoom: 15,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.barChart = this.getBarChart();
      this.lineChart = this.getLineChart();
    }, 150)
    setTimeout(() => {
      this.pieChart = this.getPieChart();
      this.doughnutChart = this.getDoughnutChart();
    }, 250)
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getBarChart() {

    const data = {
      labels: ['test', 'test', 'test', 'test', 'test'],
      datasets: [{
        label: 'Pengunjung',
        data: [5, 20, 8, 10, 15],
        backgroundColor: [
          'rgb(255, 0, 0)',
          'rgb(20, 0, 255)',
          'rgb(255, 230, 0)',
          'rgb(0, 255, 10)',
          'rgb(60, 0, 70)'
        ],
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options);


  }

  getLineChart() {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: '2018',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(231, 205, 35)',
        borderColor: 'rgb(231, 205, 35)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: [20, 15, 98, 4],
        scanGaps: false,
      }, {
        label: '2019',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(117, 0, 49)',
        borderColor: 'rgb(51, 50, 46)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: [29, 135, 13, 70],
        scanGaps: false,
      }
      ]
    }

    return this.getChart(this.lineCanvas.nativeElement, 'line', data)
  }

  getPieChart() {
    const data = {
      labels: ['OH', 'BLACK EYE', 'RESTO'],
      datasets: [{
        data: [300, 75, 224],
        backgroundColor: ['rgb(200, 6, 0)', 'rgb(36, 0, 255)', 'rgb(242, 255, 0)']
      }]
    }

    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }

  getDoughnutChart() {
    const data = {
      labels: ['Bali Tour', 'Jetwings', 'Abbey'],
      datasets: [{
        label: 'Teste Chart',
        data: [12, 65, 32],
        backgroundColor: [
          'rgb(0, 244, 97)',
          'rgb(37, 39, 43)',
          'rgb(255, 207, 0)'
        ]
      }]
    }

    return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data);
  }

}


@Component({
  templateUrl: 'datelist.html'
})
export class DatelistPage {

  cabang_kode: any;

  listDate = [];
  constructor(public alertCtrl: AlertController, public postPvdr: PostProvider, public viewCtrl: ViewController, public navParams: NavParams) {
    this.cabang_kode = navParams.get("kdcabang");
  }

  ionViewDidLoad() {

    document.getElementById('loading').style.display = '';
    document.getElementById('change_date').style.display = 'none';

    let body = {
      action: 'getLastSevenDay'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('change_date').style.display = '';

      if (data.success) {

        for (let i = 0; i < data.result.length; i++) {

          this.listDate.push(
            {
              date: data.result[i]['date'],

            });

        }


      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('change_date').style.display = '';
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connection to server',
        buttons: ['OK']
      });
      alert.present();
    });
  }


  dateSelected(date) {

    this.viewCtrl.dismiss({
      date: date,
      kdcabang: this.cabang_kode
    });
  }

}


@Component({
  templateUrl: 'cabanglist.html'
})
export class CabanglistPage {

  items: any;


  constructor(public viewCtrl: ViewController, public storage: Storage) {
    this.storage.get('session_storage').then((res) => {

      if (res[0]['jabatan_name'] == 'IT Manager'
        || res[0]['jabatan_name'] == 'IT Senior Manager'
        || res[0]['jabatan_name'] == 'IT Programmer Coordinator'
        || res[0]['jabatan_name'] == 'IT Programmer Staff'
        || res[0]['jabatan_name'] == 'IT Implementator Staff'
        || res[0]['jabatan_name'] == 'IT Support Staff'
        || res[0]['jabatan_name'] == 'Business Development Director'
        || res[0]['jabatan_name'] == 'Marketing Director'
        || res[0]['jabatan_name'] == 'National General Trade Manager'
        || res[0]['jabatan_name'] == 'Deputy National General Trade Manager'
        || res[0]['jabatan_name'] == 'National Sales & Promotion Manager'
        || res[0]['jabatan_name'] == 'Vice President Director'
        || res[0]['jabatan_name'] == 'Sales & Distribution Director'
        || res[0]['jabatan_name'] == 'Group Brand Manager'
        || res[0]['jabatan_name'] == 'National Key Account Manager'
      ) {

        this.items = [

          { 'NamaCabang': 'Jakarta 1', 'KdCabang': '31' },
          { 'NamaCabang': 'Jakarta 2', 'KdCabang': '32' },
          { 'NamaCabang': 'Bandung', 'KdCabang': '33' },
          { 'NamaCabang': 'Surabaya', 'KdCabang': '41' },
          { 'NamaCabang': 'Semarang', 'KdCabang': '42' },
          { 'NamaCabang': 'Denpasar', 'KdCabang': '43' },
          { 'NamaCabang': 'Regbar', 'KdCabang': '30' },
          { 'NamaCabang': 'Regtim', 'KdCabang': '40' }
        ];

      } else {
        if (res[0]['cabang_id'] == '31') { //JK1
          this.items = [
            { 'NamaCabang': 'Jakarta 1', 'KdCabang': '31' }
          ];
        } else if (res[0]['cabang_id'] == '32') { //JK2
          this.items = [
            { 'NamaCabang': 'Jakarta 2', 'KdCabang': '32' }
          ];
        } else if (res[0]['cabang_id'] == '41') { //SBY
          this.items = [
            { 'NamaCabang': 'Surabaya', 'KdCabang': '41' }
          ];
        } else if (res[0]['cabang_id'] == '43') { //DPS
          this.items = [
            { 'NamaCabang': 'Denpasar', 'KdCabang': '43' }
          ];
        } else if (res[0]['cabang_id'] == '40') { //RG
          this.items = [
            { 'NamaCabang': 'Regional Timur', 'KdCabang': '40' }
          ];
        } else if (res[0]['cabang_id'] == '30') { //RB
          this.items = [
            { 'NamaCabang': 'Regional Barat', 'KdCabang': '30' }
          ];
        } else if (res[0]['cabang_id'] == '33') { //BDG
          this.items = [
            { 'NamaCabang': 'Bandung', 'KdCabang': '33' }
          ];
        } else if (res[0]['cabang_id'] == '42') { //SMG
          this.items = [
            { 'NamaCabang': 'Semarang', 'KdCabang': '42' }
          ];
        }
      }




    });
  }

  itemSelected(kode, name) {
    this.viewCtrl.dismiss({ name: name, chosee: kode });
  }

}

@Component({
  templateUrl: 'cabanglist.html'
})
export class CabangslistPage {

  items: any;

  constructor(public viewCtrl: ViewController, public storage: Storage) {
    this.storage.get('session_storage').then((res) => {

      if (
        res[0]['jabatan_name'] == 'IT Manager'
        || res[0]['jabatan_name'] == 'IT Senior Manager'
        || res[0]['jabatan_name'] == 'IT Programmer Coordinator'
        || res[0]['jabatan_name'] == 'IT Programmer Staff'
        || res[0]['jabatan_name'] == 'IT Implementator Staff'
        || res[0]['jabatan_name'] == 'IT Support Staff'
        || res[0]['jabatan_name'] == 'Business Development Director'
        || res[0]['jabatan_name'] == 'Marketing Director'
        || res[0]['jabatan_name'] == 'National General Trade Manager'
        || res[0]['jabatan_name'] == 'Deputy National General Trade Manager'
        || res[0]['jabatan_name'] == 'National Sales & Promotion Manager'
        || res[0]['jabatan_name'] == 'Vice President Director'
        || res[0]['jabatan_name'] == 'Sales & Distribution Director'
        || res[0]['jabatan_name'] == 'Group Brand Manager'
        || res[0]['jabatan_name'] == 'National Key Account Manager'
      ) {

        this.items = [
          //{ 'NamaCabang': 'Regbar', 'KdCabang': '30' },
          { 'NamaCabang': 'All Outlets', 'KdCabang': '' },
          { 'NamaCabang': 'Jakarta 1', 'KdCabang': '31' },
          { 'NamaCabang': 'Jakarta 2', 'KdCabang': '32' },
          { 'NamaCabang': 'Bandung', 'KdCabang': '33' },
          //{ 'NamaCabang': 'Regtim', 'KdCabang': '40' },
          { 'NamaCabang': 'Surabaya', 'KdCabang': '41' },
          { 'NamaCabang': 'Semarang', 'KdCabang': '42' },
          { 'NamaCabang': 'Denpasar', 'KdCabang': '43' }
        ];

      } else {
        if (res[0]['cabang_id'] == '31') { //JK1
          this.items = [
            { 'NamaCabang': 'Jakarta 1', 'KdCabang': '31' }
          ];
        } else if (res[0]['cabang_id'] == '32') { //JK2
          this.items = [
            { 'NamaCabang': 'Jakarta 2', 'KdCabang': '32' }
          ];
        } else if (res[0]['cabang_id'] == '41') { //SBY
          this.items = [
            { 'NamaCabang': 'Surabaya', 'KdCabang': '41' }
          ];
        } else if (res[0]['cabang_id'] == '43') { //DPS
          this.items = [
            { 'NamaCabang': 'Denpasar', 'KdCabang': '43' }
          ];
        } else if (res[0]['cabang_id'] == '40') { //RG
          this.items = [
            { 'NamaCabang': 'Regional Timur', 'KdCabang': '40' }
          ];
        } else if (res[0]['cabang_id'] == '30') { //RB
          this.items = [
            { 'NamaCabang': 'Regional Barat', 'KdCabang': '30' }
          ];
        } else if (res[0]['cabang_id'] == '33') { //BDG
          this.items = [
            { 'NamaCabang': 'Bandung', 'KdCabang': '33' }
          ];
        } else if (res[0]['cabang_id'] == '42') { //SMG
          this.items = [
            { 'NamaCabang': 'Semarang', 'KdCabang': '42' }
          ];
        }
      }




    });
  }

  itemSelected(kode, name) {
    this.viewCtrl.dismiss({ name: name, chosee: kode });
  }

}

@Component({
  templateUrl: 'saleslist.html'
})
export class SaleslistPage {

  cabang: any;
  items: any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public postPvdr: PostProvider, public alertCtrl: AlertController) {
    this.cabang = navParams.get("kdcabang");
    this.loadsales();
  }

  loadsales() {
    let body = {
      kdcabang: this.cabang,
      action: 'getNameSalesman'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      if (data.success) {

        this.items = [];
        for (let i = 0; i < data.result.length; i++) {
          this.items.push(
            {
              kdsalesman: data.result[i]['kdsalesman'],
              salesname: data.result[i]['salesname']
            });
        }

      } else {

        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();

      }

    }, error => {

      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connection to serve',
        buttons: ['OK']
      });
      alert.present();

    });
  }

  itemSelected(kode, name, sales) {
    this.viewCtrl.dismiss({ name: name, chosee: kode, sales: sales });
  }

}


@Component({
  templateUrl: 'saleslist.html'
})
export class SalesmanlistPage {
  cabang_id: any;
  cabang_name: any;
  tanggal: any;
  listSalesman = [];

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public postPvdr: PostProvider,
    public alertCtrl: AlertController) {
    this.getCurrentData(navParams.get("cabang_id"), navParams.get("cabang_name"), navParams.get("tanggal"));
  }

  getCurrentData(cabang_id, cabang_name, tanggal) {
    this.cabang_id = cabang_id;
    this.cabang_name = cabang_name;
    this.tanggal = tanggal;
  }

  ionViewDidLoad() {
    document.getElementById('loading').style.display = '';
    document.getElementById('sales').style.display = 'none';
    let body = {
      kdcabang: this.cabang_id,
      tanggal: this.tanggal,
      action: 'getLastlocationsales'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('sales').style.display = '';
      if (data.success) {
        for (let i = 0; i < data.result.length; i++) {
          this.listSalesman.push(
            {
              salesman_id: data.result[i]['kdsalesman'],
              salesman_nama: data.result[i]['namasalesman']
            });
        }

      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('sales').style.display = '';
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connect To Server',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  detailsalesman(salesman_id, cabang_id) {
    this.viewCtrl.dismiss({ salesman_id: salesman_id, cabang_id: cabang_id });
  }
}


@Component({
  templateUrl: 'alloutlet.html'
})
export class AlloutletPage {

  cabang: any = 'Choose Cabang';
  kdcabang: any;
  salesman: any = 'Choose Salesman';
  lat: Number = -7.4863585;
  lng: Number = 110.6901085;

  kodesales:any;
  scope:any;

  constructor(
    public navCtrl: NavController,
    private app: App,
    public storage: Storage,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public postPvdr: PostProvider
  ) {
  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    var myLatlng = { lat: this.lat, lng: this.lng };
    var map = new google.maps.Map(document.getElementById('wilayah'), {
      zoom: 7.7,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

  }

  loadmaps() {

    var myLatlng = { lat: this.lat, lng: this.lng };
    var map = new google.maps.Map(document.getElementById('wilayah'), {
      zoom: 7.7,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    //loading
    document.getElementById('loading').style.display = '';

    let body = {
      action: 'getAllOutlets'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      //loading
      document.getElementById('loading').style.display = 'none';

      if (data.success) {

        var image;

        for (let i = 0; i < data.result.length; i++) {

          if (data.result[i]['kdcabang'] == '31') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['kdcabang'] == '32') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['kdcabang'] == '33') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['kdcabang'] == '41') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['kdcabang'] == '42') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['kdcabang'] == '43') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          }
          var latlng = { lat: parseFloat(data.result[i]['lat']), lng: parseFloat(data.result[i]['long']) }
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: image
          });

          var contentString =
            '<h4>' + data.result[i]['outletname'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
            '<div>' +
            '<p>' + data.result[i]['alm1toko'] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
            '</p>' +
            '</div>';

          marker.content = contentString;

          var infoWindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.setContent(this.content);
            infoWindow.open(this.getMap(), this);
          });
        }

      } else {

        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }
    }, error => {
      //loading
      document.getElementById('loading').style.display = 'none';
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Lost Connections',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  addOutlet() {
    const modal = this.modalCtrl.create(FormoutletPage);
    modal.present();
  }

  menu(ev) {
    let popover = this.popoverCtrl.create(MenusPage);
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {

      if (data) {
        if (data.menu == 'tracking_sales') {
          this.app.getRootNav().setRoot(TrackingsalesPage);
        }
        if (data.menu == 'data_analytics') {
          this.app.getRootNav().setRoot(HomePage);
        }
        if (data.menu == 'all_outlets') {
          this.app.getRootNav().setRoot(AlloutletPage);
        }
        if (data.menu == 'all_counters') {
          this.app.getRootNav().setRoot(AllcountertPage);
        }
        if (data.menu == 'product_mapping') {
          this.app.getRootNav().setRoot(ProductdistributionPage);
        }
        if (data.menu == 'expansion') {
          this.app.getRootNav().setRoot(ExpansionPage);
        }
        if (data.menu == 'settings') {
          const modal = this.modalCtrl.create(SettingPage);
          modal.present();
        }
        if (data.menu == 'logout') {
          this.storage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        }
      }

    });
  }

  cabanglist(ev) {
    let popover = this.popoverCtrl.create(CabangslistPage);
    popover.present({
      ev: ev
    });

    popover.onDidDismiss(data => {

      if (data) {

        if (data.chosee == '') { //all Outlet
          this.kdcabang = '';
          this.cabang = 'All Outlets';
          document.getElementById('salesman').style.display = 'none';
          this.loadmaps();
        } else if (data.chosee == '31') { //JK1
          this.kdcabang = '31';
          this.cabang = 'Jakarta 1';
          this.lat = -6.2147318;
          this.lng = 106.7106443;
          document.getElementById('salesman').style.display = '';
          //this.initMap(-6.2147318, 106.7106443, 12, 31, 'Jakarta 1', this.date);
        } else if (data.chosee == '32') { //JK2
          this.kdcabang = '32';
          this.cabang = 'Jakarta 2';
          this.lat = -6.4166;
          this.lng = 106.8352;
          document.getElementById('salesman').style.display = '';
          //this.initMap(-6.4166, 106.8352, 11, 32, 'Jakarta 2', this.date);
        } else if (data.chosee == '41') { //SBY
          this.kdcabang = '41';
          this.cabang = 'Surabaya';
          this.lat = -7.6497;
          this.lng = 112.6401;
          document.getElementById('salesman').style.display = '';
          //this.initMap(-7.6497, 112.6401, 9, 41, 'Surabaya', this.date);
        } else if (data.chosee == '43') { //DPS
          this.kdcabang = '43';
          this.cabang = 'Denpasar';
          this.lat = -8.4181237;
          this.lng = 115.1879839;
          document.getElementById('salesman').style.display = '';
          //this.initMap(-8.4181237, 115.1879839, 10, 43, 'Denpasar', this.date);
        } else if (data.chosee == '40') { //RG
          this.kdcabang = '40';
          this.cabang = 'Regional Timur';
          this.lat = 1.5161;
          this.lng = 124.8483;
          document.getElementById('salesman').style.display = '';
          //this.initMap(1.5161, 124.8483, 12, 40, 'Regional Timur', this.date);
        } else if (data.chosee == '30') { //RB
          this.kdcabang = '30';
          this.cabang = 'Regional Barat';
          this.lat = 1.1049;
          this.lng = 104.0422;
          document.getElementById('salesman').style.display = '';
          //this.initMap(1.1049, 104.0422, 12, 30, 'Regional Barat', this.date);
        } else if (data.chosee == '33') { //BDG
          this.kdcabang = '33';
          this.cabang = 'Bandung';
          this.lat = -6.9259;
          this.lng = 107.6186;
          document.getElementById('salesman').style.display = '';
          //this.initMap(-6.9259, 107.6186, 12, 33, 'Bandung', this.date);
        } else if (data.chosee == '42') { //SMG
          this.kdcabang = '42';
          this.cabang = 'Semarang';
          this.lat = -7.1544;
          this.lng = 110.4188;
          document.getElementById('salesman').style.display = '';
          //this.initMap(-7.1544, 110.4188, 11, 42, 'Semarang', this.date);
        }
      }

    });

  }

  salesmanlist(ev, kdcabang) {

    let popover = this.popoverCtrl.create(SaleslistPage, { kdcabang: kdcabang });
    popover.present({
      ev: ev
    });

    popover.onDidDismiss(data => {

      if (data) {
        document.getElementById('legend').style.display='none';

        this.salesman = data.sales;
        this.kodesales = data.name;

        var myLatlng = { lat: this.lat, lng: this.lng };
        var map = new google.maps.Map(document.getElementById('wilayah'), {
          zoom: 10,
          center: myLatlng,
          rotateControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: true,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
          }
        });


        let body = {
          kdsalesman: data.name,
          kdcabang: data.chosee,
          action: 'getOutletSalesmanNew'
        };

        this.postPvdr.postData(body, 'read').subscribe((data) => {

          var icon;
          if (data.success) {
            for (let i = 0; i < data.result.length; i++) {

              //pilih icon
              if (data.result[i]['color'] == '1') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
              } else if (data.result[i]['color'] == '2') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
              } else if (data.result[i]['color'] == '3') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
              } else if (data.result[i]['color'] == '4') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
              } else if (data.result[i]['color'] == '5') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
              } else if (data.result[i]['color'] == '6') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
              } else if (data.result[i]['color'] == '7') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
              } else if (data.result[i]['color'] == '8') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
              } else if (data.result[i]['color'] == '9') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
              } else if (data.result[i]['color'] == '10') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
              } else if (data.result[i]['color'] == '11') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
              } else if (data.result[i]['color'] == '12') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
              } else if (data.result[i]['color'] == '13') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
              } else if (data.result[i]['color'] == '14') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
              } else if (data.result[i]['color'] == '15') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
              } else if (data.result[i]['color'] == '16') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
              } else if (data.result[i]['color'] == '17') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
              } else if (data.result[i]['color'] == '18') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
              } else if (data.result[i]['color'] == '19') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
              } else if (data.result[i]['color'] == '20') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
              } else if (data.result[i]['color'] == '21') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
              } else if (data.result[i]['color'] == '22') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
              } else if (data.result[i]['color'] == '23') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
              } else if (data.result[i]['color'] == '24') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
              } else if (data.result[i]['color'] == '25') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
              } else if (data.result[i]['color'] == '26') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png';
              } else if (data.result[i]['color'] == '27') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
              } else if (data.result[i]['color'] == '28') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
              } else if (data.result[i]['color'] == '29') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
              } else if (data.result[i]['color'] == '30') {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
              } else {
                icon = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
              }

              var latlng = { lat: parseFloat(data.result[i]['lat']), lng: parseFloat(data.result[i]['long']) }
              var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: icon

              });

              var contentString =
                '<h4>' + data.result[i]['outletname'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
                '<div>' +
                '<p>' + data.result[i]['address'] + '&nbsp;&nbsp;&nbsp;&nbsp;<br>' +
                'Nama Salesman : ' + data.result[i]['salesname'] + '&nbsp;&nbsp;&nbsp;&nbsp;<br>' +
                'True Location : ' + data.result[i]['TrueLocation'] + '&nbsp;&nbsp;&nbsp;&nbsp;<br>' +
                'Last Check In : ' + data.result[i]['WaktuIn'] + '&nbsp;&nbsp;&nbsp;&nbsp;<br>' +
                'Last Check Out : ' + data.result[i]['WaktuOut'] + '&nbsp;&nbsp;&nbsp;&nbsp;<br>' +
                '</p>' +
                '</div>';

              marker.content = contentString;

              var infoWindow = new google.maps.InfoWindow();
              google.maps.event.addListener(marker, 'mouseover', function () {
                infoWindow.setContent(this.content);
                infoWindow.open(this.getMap(), this);
              });
            }


            
            this.scope = data.scope;
            document.getElementById('legend').style.display='';


          } else {
            const alert = this.alertCtrl.create({
              title: 'Opps I am Sorry',
              subTitle: 'Data Not Found.',
              buttons: ['OK']
            });
            alert.present();
          }

        }, error => {

          const alert = this.alertCtrl.create({
            title: 'Opps I am Sorry',
            subTitle: 'Not Connection to serve',
            buttons: ['OK']
          });
          alert.present();
        });

      }

    });

  }

}


@Component({
  templateUrl: 'allcounter.html'
})
export class AllcountertPage {

  counter: String = 'All Counters';

  constructor(
    public navCtrl: NavController,
    private app: App,
    public storage: Storage,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public postPvdr: PostProvider
  ) {
  }

  ionViewDidLoad() {
    this.initMap(0, 'all');
  }

  initMap(ctrg, type) {
    var myLatlng = { lat: -1.6915103, lng: 113.7465565 };
    var map = new google.maps.Map(document.getElementById('daerah'), {
      zoom: 5.9,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    //loading
    document.getElementById('loading').style.display = '';

    let body = {
      category: ctrg,
      type: type,
      action: 'getAllCounters'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      //loading
      document.getElementById('loading').style.display = 'none';

      if (data.success) {

        var image;

        for (let i = 0; i < data.result.length; i++) {

          var category;
          var statuz;
          var closedate;

          if (data.result[i]['c_category'] == '1') {
            category = 'Oemah Herborist';
          } else if (data.result[i]['c_category'] == '2') {
            category = 'Fragrance Bar';
          } else {
            category = 'Others';
          }

          if (data.result[i]['flag'] == '2') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
            statuz = 'Close';
          } else if (data.result[i]['flag'] == '1') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
            statuz = 'Open';
          } else if (data.result[i]['flag'] == '0') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png';
            statuz = 'Coming Soon';
          }

          if (data.result[i]['close_date'] == '0000-00-00') {
            closedate = '-';
          } else {
            closedate = data.result[i]['close_date'];
          }


          var latlng = { lat: parseFloat(data.result[i]['lat']), lng: parseFloat(data.result[i]['long']) }
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: image
          });

          var contentString =
            '<h4>' + data.result[i]['namacounter'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
            '<div>Category : ' + category + '&nbsp;&nbsp;&nbsp;<br> Status :' + statuz + '&nbsp;&nbsp;&nbsp;<br>Open Date : ' + data.result[i]['open_date'] +
            '&nbsp;&nbsp;&nbsp;<br>Close Date : ' + closedate + '&nbsp;&nbsp;&nbsp;<br>Note : ' + data.result[i]['note'] + '&nbsp;&nbsp;&nbsp;' +
            '</div><br><br>';

          marker.content = contentString;

          var infoWindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.setContent(this.content);
            infoWindow.open(this.getMap(), this);
          });
        }

      } else {

        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }
    }, error => {
      //loading
      document.getElementById('loading').style.display = 'none';
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Lost Connections',
        buttons: ['OK']
      });
      alert.present();
    });


  }

  category_counter(ev) {
    let popover = this.popoverCtrl.create(CategorycounterPage);
    popover.present({
      ev: ev
    });

    popover.onDidDismiss(val => {

      if (val) {
        this.counter = val.name;

        let alert = this.alertCtrl.create();
        alert.setTitle('Type Category');

        alert.addInput({
          type: 'radio',
          label: 'All Type',
          value: 'all',
          checked: true
        });

        alert.addInput({
          type: 'radio',
          label: 'Open',
          value: 'open'
        });

        alert.addInput({
          type: 'radio',
          label: 'Close',
          value: 'close'
        });

        alert.addInput({
          type: 'radio',
          label: 'Comming Soon',
          value: 'comming_soon'
        });

        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            this.initMap(val.chosee, data);
          }
        });
        alert.present();

      }

    });
  }

  addCounter() {
    const modal = this.modalCtrl.create(FormcounterPage);
    modal.present();
  }

  setupAllCounter() {
    const modal = this.modalCtrl.create(SetupAllCounterPage);
    modal.present();
  }

  menu(ev) {
    let popover = this.popoverCtrl.create(MenusPage);
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {

      if (data) {
        if (data.menu == 'tracking_sales') {
          this.app.getRootNav().setRoot(TrackingsalesPage);
        }
        if (data.menu == 'data_analytics') {
          this.app.getRootNav().setRoot(HomePage);
        }
        if (data.menu == 'all_outlets') {
          this.app.getRootNav().setRoot(AlloutletPage);
        }
        if (data.menu == 'all_counters') {
          this.app.getRootNav().setRoot(AllcountertPage);
        }
        if (data.menu == 'product_mapping') {
          this.app.getRootNav().setRoot(ProductdistributionPage);
        }
        if (data.menu == 'expansion') {
          this.app.getRootNav().setRoot(ExpansionPage);
        }
        if (data.menu == 'settings') {
          const modal = this.modalCtrl.create(SettingPage);
          modal.present();
        }
        if (data.menu == 'logout') {
          this.storage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        }
      }

    });
  }

}


@Component({
  templateUrl: 'setting.html'
})
export class SettingPage {

  constructor(
    public navCtrl: NavController, public alertCtrl: AlertController, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {

  }

  close() {
    this.viewCtrl.dismiss();
  }

}

@Component({
  selector: 'page-home',
  templateUrl: 'expansion.html'
})
export class ExpansionPage {

  cabang: any = 'Choose Cabang';

  lat : any;
  lng : any;

  constructor(
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController, 
    public viewCtrl: ViewController,
    public postPvdr: PostProvider,
    public modalCtrl: ModalController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private app: App
    ) {
  }

  ionViewDidLoad() {
    this.initMap(-6.1579074, 106.7190608, 13, 'Jakarta 1');
  }

  initMap(x, y, zoom, cabang_name) {
    this.cabang = cabang_name;
    this.lat = x;
    this.lng = y;

    var myLatlng = { lat: x, lng: y };
    var map = new google.maps.Map(document.getElementById('expansion'), {
      zoom: zoom,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });
  }

  menu(ev) {
    let popover = this.popoverCtrl.create(MenusPage);
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {

      if (data) {
        if (data.menu == 'tracking_sales') {
          this.app.getRootNav().setRoot(TrackingsalesPage);
        }
        if (data.menu == 'data_analytics') {
          this.app.getRootNav().setRoot(HomePage);
        }
        if (data.menu == 'all_outlets') {
          this.app.getRootNav().setRoot(AlloutletPage);
        }
        if (data.menu == 'all_counters') {
          this.app.getRootNav().setRoot(AllcountertPage);
        }
        if (data.menu == 'product_mapping') {
          this.app.getRootNav().setRoot(ProductdistributionPage);
        }
        if (data.menu == 'expansion') {
          this.app.getRootNav().setRoot(ExpansionPage);
        }
        if (data.menu == 'settings') {
          const modal = this.modalCtrl.create(SettingPage);
          modal.present();
        }
        if (data.menu == 'logout') {
          this.storage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        }
      }

    });
  }

  cabanglist(ev) {
    let popover = this.popoverCtrl.create(CabanglistPage);
    popover.present({
      ev: ev
    });

    //setup wilayah sesuai dengan wilayah cabang
    popover.onDidDismiss(data => {

      if (data) {

        if (data.chosee == '31') { //JK1
          this.initMap(-6.2147318, 106.7106443, 12, 'Jakarta 1');
        } else if (data.chosee == '32') { //JK2
          this.initMap(-6.4166, 106.8352, 11, 'Jakarta 2');
        } else if (data.chosee == '41') { //SBY
          this.initMap(-7.6497, 112.6401, 9, 'Surabaya');
        } else if (data.chosee == '43') { //DPS
          this.initMap(-8.4181237, 115.1879839, 10, 'Denpasar');
        } else if (data.chosee == '40') { //RG
          this.initMap(1.5161, 124.8483, 12, 'Regional Timur');
        } else if (data.chosee == '30') { //RB
          this.initMap(1.1049, 104.0422, 12, 'Regional Barat');
        } else if (data.chosee == '33') { //BDG
          this.initMap(-6.9259, 107.6186, 12, 'Bandung');
        } else if (data.chosee == '42') { //SMG
          this.initMap(-7.1544, 110.4188, 11, 'Semarang');
        }
      }
    });
  }

  bussines_expansion(x,y){
    const modal = this.modalCtrl.create(TypebusinessPage, { lat: x, long: y });
      modal.present();
      modal.onDidDismiss(vue => {
        if (vue) {
          this.outlet_radius(vue.lat, vue.long, vue.radius, vue.place_type);
        }
      });
  }

  modal_be(x,y){
    this.navCtrl.push(SearchplacesPage, { lat: x, long: y });
  }

  outlet_radius(x, y, r, place_type) {

    var rad = parseFloat(r);  //meters
    var theLat = parseFloat(x);  //decimal degrees
    var theLng = parseFloat(y);  //decimal degrees

    var yMin = theLat - (0.0000065 * rad);
    var xMin = theLng - (-0.0000065 * rad);

    var yMax = theLat + (0.0000065 * rad);
    var xMax = theLng + (-0.0000065 * rad);

    this.allRadiusRectangleOutletsales(yMin, yMax, xMin, xMax, x, y, r, place_type);
  }

  allRadiusRectangleOutletsales(j, k, l, m, x, y, r, place_type) {
   
        this.circle(x, y, r, '', place_type);
 
  }

  circle(x, y, r, alloutlet, place_type) {

    var service;
    var myLatlng = { lat: x, lng: y };
    var map = new google.maps.Map(document.getElementById('expansion'), {
      zoom: 11,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    var cityCircle = new google.maps.Circle({
      strokeColor: 'transparent',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'transparent',
      fillOpacity: 0.35,
      map: map,
      center: myLatlng,
      radius: r
    });

    google.maps.event.addListener(cityCircle, 'click', () => {
      //percobaan call other function
      //this.getAnalytics(x, y, r, place_type);
    });


    if (place_type.length > 0) {

      var request = {
        location: myLatlng,
        radius: r,
        type: place_type
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function (results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

          for (var i = 0; i < results.length; i++) {
            var place = results[i];

            var inputElement = <HTMLInputElement>document.getElementById('places');
             inputElement.value += place.name+'#'+place.vicinity+'##';

            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              icon: image
            });

            var contentString =
              '<h4>' + place.name + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
              '<div>' +
              '<p>' + place.types[0] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
              '<p>' + place.vicinity + '&nbsp;&nbsp;&nbsp;&nbsp;' +
              '</p>' +
              '</div>';

            marker.content = contentString;

            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'mouseover', function () {
              infoWindow.setContent(this.content);
              infoWindow.open(this.getMap(), this);
            });

          }
        }
      });

    }

    setTimeout(() => {
      document.getElementById('export_excel_button').style.display='';
    }, 3000)

  }

  export_excel(){

    const loader = this.loadingCtrl.create({
      content: "Exporting To Excel And Sending Email..."
    });
    loader.present();
    
    var list=(document.getElementById('places') as HTMLInputElement).value;
    
    this.storage.get('session_storage').then((res) => {


      const prompt = this.alertCtrl.create({
        title: 'Info',
        message: "Masukan alamat email, agar file export excel langsung dikirim ke email ini.",
        inputs: [
          {
            name: 'email',
            placeholder: 'email@email.com'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              
              let body = {
                data: list,
                username:res[0]['employee_name'],
                email:data.email,
                action: 'exportExcel'
              };
          
              this.postPvdr.postData(body, 'create').subscribe((data) => {
                loader.dismiss();
                if (data.success) {
          
                  const alert = this.alertCtrl.create({
                    title: 'Info',
                    subTitle: data.msg+' '+data.email,
                    buttons: ['OK']
                  });
                  alert.present();
          
                } else {
          
                  const alert = this.alertCtrl.create({
                    title: 'Opps I am Sorry',
                    subTitle: data.msg,
                    message: data.error,
                    buttons: ['OK']
                  });
                  alert.present();
                }
              }, error => {
                loader.dismiss();
                const alert = this.alertCtrl.create({
                  title: 'Info',
                  subTitle: 'Check Your Email. Please Press Send Or Receive Button.',
                  buttons: ['OK']
                });
                alert.present();
              });

            }
          }
        ]
      });
      prompt.present();

  });

  }


}

@Component({
  templateUrl: 'typebussinez.html'
})
export class TypebusinessPage {

  radius: number = 50000;
  lat: any;
  long: any;
  place_type: any;
  langs;
  langForm;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.getCurrentData(navParams.get("lat"), navParams.get("long"));

    this.langForm = new FormGroup({
      "langs": new FormControl({ value: 'none', disabled: false })
    });

  }

  getCurrentData(lat, long) {
    this.lat = lat;
    this.long = long;
  }

  doSubmit(event) {
    event.preventDefault();
  }

  apply() {
    var place_type;
    if (this.place_type == 'none') {
      place_type = []
    } else {
      place_type = [this.place_type]
    }

    this.viewCtrl.dismiss({ lat: this.lat, long: this.long, radius: this.radius, place_type: place_type });
  }

  close() {
    this.viewCtrl.dismiss();
  }

}


@Component({
  selector: 'page-home',
  templateUrl: 'searchplaces.html'
})
export class SearchplacesPage {

  lat: any;
  long: any;

  constructor(
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public modalCtrl: ModalController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private app: App,
    public viewCtrl: ViewController, 
    public navParams: NavParams) {
    this.getCurrentData(navParams.get("lat"), navParams.get("long"));
  }

  getCurrentData(lat, long) {
    this.lat = lat;
    this.long = long;
  }

  
  ionViewDidLoad() {
    this.initAutocomplete();
  }
  
  
  initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('placez'), {
      center: {lat: parseFloat(this.lat), lng: parseFloat(this.long)},
      zoom: 13,
      mapTypeId: 'roadmap',
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }

    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-inputs');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      console.log('testing : ',places);
      if (places.length == 0) {
        return;
      }

      setTimeout(() => {
        document.getElementById('export_excel_buttons').style.display='';
      }, 1000)

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {

        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        var inputElement = <HTMLInputElement>document.getElementById('plazes');
        inputElement.value += place.name+'#'+place.formatted_address+'##';

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

  }

  export_excel(){

    const loader = this.loadingCtrl.create({
      content: "Exporting To Excel And Sending Email..."
    });
    loader.present();
    
    var list=(document.getElementById('plazes') as HTMLInputElement).value;
    
    this.storage.get('session_storage').then((res) => {


      const prompt = this.alertCtrl.create({
        title: 'Info',
        message: "Masukan alamat email, agar file export excel langsung dikirim ke email ini.",
        inputs: [
          {
            name: 'email',
            placeholder: 'email@email.com'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              
              let body = {
                data: list,
                username:res[0]['employee_name'],
                email:data.email,
                action: 'exportExcel'
              };
          
              this.postPvdr.postData(body, 'create').subscribe((data) => {
                loader.dismiss();
                if (data.success) {
          
                  const alert = this.alertCtrl.create({
                    title: 'Info',
                    subTitle: data.msg+' '+data.email,
                    buttons: ['OK']
                  });
                  alert.present();
          
                } else {
          
                  const alert = this.alertCtrl.create({
                    title: 'Opps I am Sorry',
                    subTitle: data.msg,
                    message: data.error,
                    buttons: ['OK']
                  });
                  alert.present();
                }
              }, error => {
                loader.dismiss();
                const alert = this.alertCtrl.create({
                  title: 'Info',
                  subTitle: 'Check Your Email. Please Press Send Or Receive Button.',
                  buttons: ['OK']
                });
                alert.present();
              });

            }
          }
        ]
      });
      prompt.present();

  });

  }

}


@Component({
  templateUrl: 'listproduct.html'
})
export class ListproductPage {

  j: any; k: any; l: any; m: any;
  pcode_product_outlets: any = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public postPvdr: PostProvider
  ) {
    this.j = navParams.get("j");
    this.k = navParams.get("k");
    this.l = navParams.get("l");
    this.m = navParams.get("m");
  }

  ionViewDidLoad() {
    this.loadListProduct();
  }

  loadListProduct() {

    let body = {
      j: this.j,
      k: this.k,
      l: this.l,
      m: this.m,
      action: 'allRadiusCircleRectangleOutletsales'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      if (data.success) {

        for (let k = 0; k < data.data_detail_pcode_outlet.result.length; k++) {

          if (parseInt(data.data_detail_pcode_outlet.result[k]['quantity3month']) > 0) {
            this.pcode_product_outlets.push({
              namabarang: data.data_detail_pcode_outlet.result[k]['namabarang'],
              sales: data.data_detail_pcode_outlet.result[k]['quantity3month']
            }
            );
          }

        }

      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  close() {
    this.viewCtrl.dismiss();
  }


}


@Component({
  templateUrl: 'listsalesoutlet.html'
})
export class ListsalesoutletPage {

  j: any; k: any; l: any; m: any;
  salesoutlets: any = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public postPvdr: PostProvider
  ) {
    this.j = navParams.get("j");
    this.k = navParams.get("k");
    this.l = navParams.get("l");
    this.m = navParams.get("m");
  }

  ionViewDidLoad() {
    this.loadSalesOutlet();
  }

  loadSalesOutlet() {

    let body = {
      j: this.j,
      k: this.k,
      l: this.l,
      m: this.m,
      action: 'allRadiusCircleRectangleOutletsales'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      if (data.success) {

        for (let j = 0; j < data.data_detail_sales_outlet.result.length; j++) {

          this.salesoutlets.push({
            outlet: data.data_detail_sales_outlet.result[j]['nameoutlet'],
            sales: data.data_detail_sales_outlet.result[j]['netto3month']
          });

        }

      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  close() {
    this.viewCtrl.dismiss();
  }

}


@Component({
  templateUrl: 'menuspage.html'
})
export class MenusPage {

  tampilLogout:String='Y';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public storage: Storage) {
  }

  ionViewDidLoad() {

    this.storage.get('seasson_user_auto_login').then((res) => {
      if (res != null) {
        this.tampilLogout='N';
      }
    });

  }

  tracking_sales() {
    this.viewCtrl.dismiss({ menu: 'tracking_sales' });
  }

  data_analytics() {
    this.viewCtrl.dismiss({ menu: 'data_analytics' });
  }

  all_outlets() {
    this.viewCtrl.dismiss({ menu: 'all_outlets' });
  }

  product_mapping() {
    this.viewCtrl.dismiss({ menu: 'product_mapping' });
  }

  expansion() {
    this.viewCtrl.dismiss({ menu: 'expansion' });
  }

  all_counters() {

    this.storage.get('session_storage').then((res) => {

      if (res[0]['jabatan_name'] == 'IT Manager'
        || res[0]['jabatan_name'] == 'IT Senior Manager'
        || res[0]['jabatan_name'] == 'IT Programmer Coordinator'
        || res[0]['jabatan_name'] == 'IT Programmer Staff'
        || res[0]['jabatan_name'] == 'IT Implementator Staff'
        || res[0]['jabatan_name'] == 'IT Support Staff'
        || res[0]['jabatan_name'] == 'Business Development Director'
        || res[0]['jabatan_name'] == 'Marketing Director'
        || res[0]['jabatan_name'] == 'National General Trade Manager'
        || res[0]['jabatan_name'] == 'Deputy National General Trade Manager'
        || res[0]['jabatan_name'] == 'National Sales & Promotion Manager'
        || res[0]['jabatan_name'] == 'Vice President Director'
        || res[0]['jabatan_name'] == 'Sales & Distribution Director'
        || res[0]['jabatan_name'] == 'Group Brand Manager'
        || res[0]['jabatan_name'] == 'National Key Account Manager'
      ) {
        this.viewCtrl.dismiss({ menu: 'all_counters' });
      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Access Denied',
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  settings() {
    this.viewCtrl.dismiss({ menu: 'settings' });
  }

  logout() {
    this.viewCtrl.dismiss({ menu: 'logout' });
  }

}


@Component({
  selector: 'page-home',
  templateUrl: 'formcounter.html'
})
export class FormcounterPage {

  outletname: any;
  address: any;
  note: any;
  latitude: any;
  longitude: any;
  opening_date: any;
  closing_date: any;
  category: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public postPvdr: PostProvider
  ) {
  }

  ionViewDidLoad() {
    this.initmap();
  }

  // initmap() {
  //   var myLatlng = { lat: -7.4863585, lng: 110.6901085 };
  //   var map = new google.maps.Map(document.getElementById('search'), {
  //     zoom: 7.7,
  //     center: myLatlng,
  //     rotateControl: false,
  //     fullscreenControl: false,
  //     mapTypeControl: false,
  //     scaleControl: false,
  //     streetViewControl: true,
  //     streetViewControlOptions: {
  //       position: google.maps.ControlPosition.LEFT_BOTTOM
  //     },
  //     zoomControl: true,
  //     zoomControlOptions: {
  //       position: google.maps.ControlPosition.LEFT_BOTTOM
  //     }
  //   });
  // }

  initmap() {
    var map = new google.maps.Map(document.getElementById('search'), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);

    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      draggable: true
    });

    google.maps.event.addListener(marker, 'dragend', () => {
      this.latitude = marker.getPosition().lat();
      this.longitude = marker.getPosition().lng();

      // find address draggable
      var geocoder = new google.maps.Geocoder;
      var latlng = { lat: this.latitude, lng: this.longitude };
      geocoder.geocode({ 'location': latlng }, function (results, status) {
        var inputElement = <HTMLInputElement>document.getElementById('addresses');
        inputElement.value = results[0].formatted_address;
      });

    });

    // find address non draggable
    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: this.latitude, lng: this.longitude };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
      var inputElement = <HTMLInputElement>document.getElementById('addresses');
      inputElement.value = results[0].formatted_address;
    });

    autocomplete.addListener('place_changed', function () {
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      console.log('lat : ', place.geometry.location);
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

    });
  }

  formadd() {
    document.getElementById('formadd').style.display = '';
    document.getElementById('pac-card').style.display = 'none';
    document.getElementById('search').style.display = 'none';
    document.getElementById('addform').style.display = 'none';
    document.getElementById('addmap').style.display = '';
    document.getElementById('savemap').style.display = '';
    this.address = (document.getElementById('addresses') as HTMLInputElement).value;
  }

  mapadd() {
    document.getElementById('formadd').style.display = 'none';
    document.getElementById('pac-card').style.display = '';
    document.getElementById('search').style.display = '';
    document.getElementById('addform').style.display = '';
    document.getElementById('addmap').style.display = 'none';
    document.getElementById('savemap').style.display = 'none';
  }

  save() {


    //tanggal
    if ((typeof (this.outletname) === "undefined" || this.outletname == null || this.outletname == '')) {
      const alert = this.alertCtrl.create({
        title: 'Info!',
        subTitle: 'Nama Outlet Harus Diisi.',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }

    if ((typeof (this.address) === "undefined" || this.address == null || this.address == '')) {
      const alert = this.alertCtrl.create({
        title: 'Info!',
        subTitle: 'Alamat Harus Diisi.',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }
    
    if ((typeof (this.latitude) === "undefined" || this.latitude == null || this.latitude == '') || (typeof (this.longitude) === "undefined" || this.longitude == null || this.longitude == '')) {
      const alert = this.alertCtrl.create({
        title: 'Info!',
        subTitle: 'Latitude Atau Longitude Harus Diisi dengan cara balik ke maps dan geser sedikit saja pin marker.',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }

    if ((typeof (this.opening_date) === "undefined" || this.opening_date == null || this.opening_date == '')) {
      const alert = this.alertCtrl.create({
        title: 'Info!',
        subTitle: 'Opening Date Harus Disini',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }

    if ((typeof (this.category) === "undefined" || this.category == null || this.category == '')) {
      const alert = this.alertCtrl.create({
        title: 'Info!',
        subTitle: 'Category Harus Dipilih.',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }

    let body = {
      outletname: this.outletname,
      address: this.address,
      note: this.note,
      latitude: this.latitude,
      longitude: this.longitude,
      opening_date: this.opening_date,
      closing_date: this.closing_date,
      category: this.category,
      action: 'createCounter'
    };

    this.postPvdr.postData(body, 'create').subscribe((data) => {

      let prompt = this.alertCtrl.create({
        title: data.success,
        message: data.msg,
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.close();
            }
          }
        ]
      });
      prompt.present();

    }, error => {
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  close() {
    this.viewCtrl.dismiss();
  }

}


@Component({
  templateUrl: 'formeditcounter.html'
})
export class FormeditcounterPage {

  id: any;
  outletname: any;
  address: any;
  note: any;
  latitude: any;
  longitude: any;
  opening_date: any;
  closing_date: any;
  category: any;
  pilihan1 = false;
  pilihan2 = false;
  pilihan9 = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public postPvdr: PostProvider,
    public navParams: NavParams
  ) {
    this.id = navParams.get("id");
  }

  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    let body = {
      id: this.id,
      src: '',
      action: 'allCounterList'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      if (data.success) {

        this.outletname = data.result[0]['namacounter'];
        this.address = data.result[0]['address'];
        this.note = data.result[0]['notes'];
        this.latitude = data.result[0]['lat'];
        this.longitude = data.result[0]['lng'];
        this.opening_date = data.result[0]['open_date'];
        this.closing_date = data.result[0]['close_date'];
        this.category = data.result[0]['c_category'];

        if (this.category == '1') {
          this.pilihan1 = true;
          this.pilihan2 = false;
          this.pilihan9 = false;
        } else if (this.category == '2') {
          this.pilihan1 = false;
          this.pilihan2 = true;
          this.pilihan9 = false;
        } else if (this.category == '9') {
          this.pilihan1 = false;
          this.pilihan2 = false;
          this.pilihan9 = true;
        }

      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  save() {

    const confirm = this.alertCtrl.create({
      title: 'Info',
      message: 'Are You Sure Save Edit This Counter?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Save',
          handler: () => {
            let body = {
              outletname: this.outletname,
              address: this.address,
              note: this.note,
              id: this.id,
              latitude: this.latitude,
              longitude: this.longitude,
              opening_date: this.opening_date,
              closing_date: this.closing_date,
              category: this.category,
              action: 'editCounter'
            };

            this.postPvdr.postData(body, 'create').subscribe((data) => {

              let prompt = this.alertCtrl.create({
                title: data.success,
                message: data.msg,
                buttons: [
                  {
                    text: 'Ok',
                    handler: data => {
                      this.close();
                    }
                  }
                ]
              });
              prompt.present();

            }, error => {
              const alert = this.alertCtrl.create({
                title: 'Opps I am Sorry',
                subTitle: 'Not Connected To Server',
                buttons: ['OK']
              });
              alert.present();
            });
          }
        }
      ]
    });
    confirm.present();

  }


  delete(id) {

    const confirm = this.alertCtrl.create({
      title: 'Info',
      message: 'Are You Sure Delete This Counter?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            let body = {
              id: id,
              action: 'deleteCounter'
            };

            this.postPvdr.postData(body, 'create').subscribe((data) => {

              let prompt = this.alertCtrl.create({
                title: data.success,
                message: data.msg,
                buttons: [
                  {
                    text: 'Ok',
                    handler: data => {
                      this.close();
                    }
                  }
                ]
              });
              prompt.present();

            }, error => {
              const alert = this.alertCtrl.create({
                title: 'Opps I am Sorry',
                subTitle: 'Not Connected To Server',
                buttons: ['OK']
              });
              alert.present();
            });
          }
        }
      ]
    });
    confirm.present();

  }

  close() {
    this.viewCtrl.dismiss();
  }

}


@Component({
  templateUrl: 'formoutlet.html'
})
export class FormoutletPage {

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {

  }

  waiting_verified() {
    document.getElementById('waiting_verified').style.display = '';
    document.getElementById('not_verified').style.display = 'none';
    document.getElementById('verified').style.display = 'none';
  }

  not_verified() {
    document.getElementById('waiting_verified').style.display = 'none';
    document.getElementById('not_verified').style.display = '';
    document.getElementById('verified').style.display = 'none';
  }

  verified() {
    document.getElementById('waiting_verified').style.display = 'none';
    document.getElementById('not_verified').style.display = 'none';
    document.getElementById('verified').style.display = '';
  }

  close() {
    this.viewCtrl.dismiss();
  }

}

@Component({
  templateUrl: 'productdistribution.html'
})
export class ProductdistributionPage {


  cabang: any = 'Choose Outlet';
  kdcabang: any;
  lat: Number = -7.4863585;
  lng: Number = 110.6901085;

  pcode: any;
  product_name: any;
  cabang_name: String = 'All';
  total_outlets: Number = 0;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public app: App,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public postPvdr: PostProvider
  ) {

  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    var myLatlng = { lat: this.lat, lng: this.lng };
    var map = new google.maps.Map(document.getElementById('produk'), {
      zoom: 7.7,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

  }

  loadmaps() {

    var myLatlng = { lat: -7.4863585, lng: 110.6901085 };
    var map = new google.maps.Map(document.getElementById('produk'), {
      zoom: 7.7,
      center: myLatlng,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });


    let body = {
      action: 'getAllOutlets'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {


      if (data.success) {

        var image;

        for (let i = 0; i < data.result.length; i++) {

          if (data.result[i]['kdcabang'] == '31') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
          } else if (data.result[i]['kdcabang'] == '32') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
          } else if (data.result[i]['kdcabang'] == '33') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
          } else if (data.result[i]['kdcabang'] == '41') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
          } else if (data.result[i]['kdcabang'] == '42') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
          } else if (data.result[i]['kdcabang'] == '43') {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
          } else {
            image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
          }
          var latlng = { lat: parseFloat(data.result[i]['lat']), lng: parseFloat(data.result[i]['long']) }
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: image
          });

          var contentString =
            '<h4>' + data.result[i]['outletname'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
            '<div>' +
            '<p>' + data.result[i]['alm1toko'] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
            '</p>' +
            '</div>';

          marker.content = contentString;

          var infoWindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.setContent(this.content);
            infoWindow.open(this.getMap(), this);
          });
        }

      } else {

        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }
    }, error => {
      //loading
      document.getElementById('loading').style.display = 'none';
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Lost Connections',
        buttons: ['OK']
      });
      alert.present();
    });

  }

  cabanglist(ev) {
    document.getElementById('legend').style.display = 'none';
    let popover = this.popoverCtrl.create(CabangslistPage);
    popover.present({
      ev: ev
    });

    popover.onDidDismiss(data => {

      if (data) {

        this.cabang = data.name;
        this.cabang_name = data.name;

        const modal = this.modalCtrl.create(ListprodukPage, { cabang: data.chosee });
        modal.present();

        modal.onDidDismiss(vue => {
          console.log('vue : ', vue)
          if (vue) {

            this.pcode = vue.pcode;
            this.product_name = vue.product_name;

            //loading
            const loader = this.loadingCtrl.create({
              //content: "Loading...",
              spinner: 'hide',
              content: `
              <div class="custom-spinner-container">
                <div class="custom-spinner-box">
                  <img src="assets/imgs/loader.gif" width='50' height='50'/>
                </div>
              </div>`,
            });
            loader.present();

            var myLatlng;
            if (data.chosee == '') { //all Outlet
              myLatlng = { lat: -7.4863585, lng: 110.6901085 };
            } else if (data.chosee == '31') { //JK1
              myLatlng = { lat: -6.2147318, lng: 106.7106443 };
            } else if (data.chosee == '32') { //JK2
              myLatlng = { lat: -6.4166, lng: 106.8352 };
            } else if (data.chosee == '41') { //SBY
              myLatlng = { lat: -7.6497, lng: 112.6401 };
            } else if (data.chosee == '43') { //DPS
              myLatlng = { lat: -8.4181237, lng: 115.1879839 };
            } else if (data.chosee == '40') { //RG
              myLatlng = { lat: 1.5161, lng: 124.8483 };
            } else if (data.chosee == '30') { //RB
              myLatlng = { lat: 1.1049, lng: 104.0422 };
            } else if (data.chosee == '33') { //BDG
              myLatlng = { lat: -6.9259, lng: 107.6186 };
            } else if (data.chosee == '42') { //SMG
              myLatlng = { lat: -7.1544, lng: 110.4188 };
            }

            var map = new google.maps.Map(document.getElementById('produk'), {
              zoom: 7.7,
              center: myLatlng,
              rotateControl: false,
              fullscreenControl: false,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: true,
              streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
              },
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
              }
            });


            let body = {
              pcode: vue.pcode,
              cabang: vue.cabang,
              action: 'getKoordinatListProduk'
            };

            this.postPvdr.postData(body, 'read').subscribe((data) => {

              console.log(data)
              if (data.success) {
                loader.dismiss();

                //view legend
                document.getElementById('legend').style.display = '';

                let jml_outlet = 0;
                for (let i = 0; i < data.result.length; i++) {

                  var latlng = { lat: parseFloat(data.result[i]['latitude']), lng: parseFloat(data.result[i]['longitude']) }
                  // var image = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
                  var image = 'http://maps.google.com/mapfiles/kml/pal2/icon13.png';
                  var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    icon: image
                  });

                  var contentString =
                    '<h4>' + data.result[i]['namabarang'] + '&nbsp;&nbsp;&nbsp;&nbsp;</h4>' +
                    '<div>' +
                    '<p>' + data.result[i]['namaoutlet'] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<p>' + data.result[i]['namacabang'] + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '</p>' +
                    '</div>';

                  marker.content = contentString;

                  var infoWindow = new google.maps.InfoWindow();
                  google.maps.event.addListener(marker, 'mouseover', function () {
                    infoWindow.setContent(this.content);
                    infoWindow.open(this.getMap(), this);
                  });
                  jml_outlet++;
                }
                this.total_outlets = jml_outlet;
              } else {
                loader.dismiss();
                const alert = this.alertCtrl.create({
                  title: 'Opps I am Sorry',
                  subTitle: 'Tidak ada Data',
                  buttons: ['OK']
                });
                alert.present();
              }

            }, error => {
              loader.dismiss();
              const alert = this.alertCtrl.create({
                title: 'Opps I am Sorry',
                subTitle: 'Not Connected To Server',
                buttons: ['OK']
              });
              alert.present();
            });

          }
        });

        // if (data.chosee == '') { //all Outlet
        //   this.kdcabang = '';
        //   this.cabang = 'All Outlets';
        //   this.loadmaps();
        // } else if (data.chosee == '31') { //JK1
        //   this.kdcabang = '31';
        //   this.cabang = 'Jakarta 1';
        //   this.lat = -6.2147318;
        //   this.lng = 106.7106443;
        // } else if (data.chosee == '32') { //JK2
        //   this.kdcabang = '32';
        //   this.cabang = 'Jakarta 2';
        //   this.lat = -6.4166;
        //   this.lng = 106.8352;
        // } else if (data.chosee == '41') { //SBY
        //   this.kdcabang = '41';
        //   this.cabang = 'Surabaya';
        //   this.lat = -7.6497;
        //   this.lng = 112.6401;
        // } else if (data.chosee == '43') { //DPS
        //   this.kdcabang = '43';
        //   this.cabang = 'Denpasar';
        //   this.lat = -8.4181237;
        //   this.lng = 115.1879839;
        // } else if (data.chosee == '40') { //RG
        //   this.kdcabang = '40';
        //   this.cabang = 'Regional Timur';
        //   this.lat = 1.5161;
        //   this.lng = 124.8483;
        // } else if (data.chosee == '30') { //RB
        //   this.kdcabang = '30';
        //   this.cabang = 'Regional Barat';
        //   this.lat = 1.1049;
        //   this.lng = 104.0422;
        // } else if (data.chosee == '33') { //BDG
        //   this.kdcabang = '33';
        //   this.cabang = 'Bandung';
        //   this.lat = -6.9259;
        //   this.lng = 107.6186;
        // } else if (data.chosee == '42') { //SMG
        //   this.kdcabang = '42';
        //   this.cabang = 'Semarang';
        //   this.lat = -7.1544;
        //   this.lng = 110.4188;
        // }
      }

    });

  }

  menu(ev) {
    let popover = this.popoverCtrl.create(MenusPage);
    popover.present({
      ev: ev
    });
    popover.onDidDismiss(data => {

      if (data) {
        if (data.menu == 'tracking_sales') {
          this.app.getRootNav().setRoot(TrackingsalesPage);
        }
        if (data.menu == 'data_analytics') {
          this.app.getRootNav().setRoot(HomePage);
        }
        if (data.menu == 'all_outlets') {
          this.app.getRootNav().setRoot(AlloutletPage);
        }
        if (data.menu == 'all_counters') {
          this.app.getRootNav().setRoot(AllcountertPage);
        }
        if (data.menu == 'product_mapping') {
          this.app.getRootNav().setRoot(ProductdistributionPage);
        }
        if (data.menu == 'expansion') {
          this.app.getRootNav().setRoot(ExpansionPage);
        }
        if (data.menu == 'settings') {
          const modal = this.modalCtrl.create(SettingPage);
          modal.present();
        }
        if (data.menu == 'logout') {
          this.storage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        }
      }

    });
  }


}

@Component({
  templateUrl: 'listproduk.html'
})
export class ListprodukPage {

  listProduct: any;
  cabang: String = '';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

    //irfan
    this.cabang = navParams.get("cabang");
  }

  ionViewDidLoad() {
    this.form_search();
  }

  form_search() {
    const prompt = this.alertCtrl.create({
      title: 'Cari',
      message: "Masukan kata untuk mencari produk",
      inputs: [
        {
          name: 'src',
          placeholder: 'Apa yang anda cari...'
        },
      ],
      buttons: [
        {
          text: 'Batal',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Cari',
          handler: data => {
            console.log('Saved clicked');
            this.getData(data.src);
          }
        }
      ]
    });
    prompt.present();
  }

  getData(src) {

    //loading
    const loader = this.loadingCtrl.create({
      //content: "Loading...",
      spinner: 'hide',
      content: `
              <div class="custom-spinner-container">
                <div class="custom-spinner-box">
                  <img src="assets/imgs/loader.gif" width='50' height='50'/>
                </div>
              </div>`,
    });
    loader.present();

    let body = {
      src: src,
      action: 'getListProduk'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      console.log(data)
      if (data.success) {
        loader.dismiss();
        this.listProduct = [];
        for (let i = 0; i < data.result.length; i++) {
          this.listProduct.push({
            'pcode': data.result[i]['pcode'],
            'namabarang': data.result[i]['namabarang']
          })
        }
      } else {
        loader.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Tidak ada',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {
      loader.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  pilih(pcode, cabang, name) {
    this.viewCtrl.dismiss({ pcode: pcode, product_name: name, cabang: cabang });
  }

}

@Component({
  templateUrl: 'setupallcounter.html'
})
export class SetupAllCounterPage {

  counterList: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public postPvdr: PostProvider,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.getData('');
  }

  form_search() {
    const prompt = this.alertCtrl.create({
      title: 'Search Counter',
      message: "Enter a name counter",
      inputs: [
        {
          name: 'counter',
          placeholder: 'Counter'
        },
      ],
      buttons: [
        {
          text: 'Find',
          handler: data => {
            console.log('Saved clicked');
            this.getData(data.counter);
          }
        }
      ]
    });
    prompt.present();
  }

  getData(src) {
    let body = {
      id: '',
      src: src,
      action: 'allCounterList'
    };

    this.postPvdr.postData(body, 'read').subscribe((data) => {

      if (data.success) {
        this.counterList = [];
        for (let k = 0; k < data.result.length; k++) {

          this.counterList.push({
            'id': data.result[k]['id'],
            'namacounter': data.result[k]['namacounter'],
            'address': data.result[k]['address']
          });

        }

      } else {
        const alert = this.alertCtrl.create({
          title: 'Opps I am Sorry',
          subTitle: 'Data Not Found.',
          buttons: ['OK']
        });
        alert.present();
      }

    }, error => {
      const alert = this.alertCtrl.create({
        title: 'Opps I am Sorry',
        subTitle: 'Not Connected To Server',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  pilih(id) {
    this.viewCtrl.dismiss();
    const modal = this.modalCtrl.create(FormeditcounterPage, { id: id });
    modal.present();
  }

}

@Component({
  templateUrl: 'categorycounter.html'
})
export class CategorycounterPage {

  items: any;

  constructor(public viewCtrl: ViewController, public storage: Storage) {

  }

  itemSelected(kode, name) {
    this.viewCtrl.dismiss({ name: name, chosee: kode });
  }

}

