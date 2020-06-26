import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/home/home';
import { TrackingsalesPage } from '../pages/home/home';
import { AlloutletPage } from '../pages/home/home';
import { AllcountertPage } from '../pages/home/home';
import { SettingPage } from '../pages/home/home';
import { Storage } from '@ionic/Storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(platform: Platform, public storage: Storage) {

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Tracking Sales', icon: 'map', component: TrackingsalesPage },
      { title: 'Data Analytics', icon: 'stats', component: HomePage },
      { title: 'All Outlets', icon: 'list-box', component: AlloutletPage },
      { title: 'All Counters', icon: 'clipboard', component: AllcountertPage },
      { title: 'Settings', icon: 'settings', component: SettingPage },
    ];

    platform.ready().then(() => {
      this.storage.get('session_storage').then((res) => {
        if (res == null) {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = TrackingsalesPage;
        }
      });
    });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot(LoginPage);
  }

}
