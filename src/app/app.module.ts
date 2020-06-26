import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/home/home';
import { AnalyticsPage } from '../pages/home/home';
import { MoveanddragPage } from '../pages/home/home';
import { OutletPage } from '../pages/home/home';
import { TrackingsalesPage } from '../pages/home/home';
import { DatelistPage } from '../pages/home/home';
import { CabanglistPage } from '../pages/home/home';
import { CabangslistPage } from '../pages/home/home';
import { SaleslistPage } from '../pages/home/home';
import { SalesmanlistPage } from '../pages/home/home';
import { AlloutletPage } from '../pages/home/home';
import { AllcountertPage } from '../pages/home/home';
import { SettingPage } from '../pages/home/home';
import { ListproductPage } from '../pages/home/home';
import { ListsalesoutletPage } from '../pages/home/home';
import { MenusPage } from '../pages/home/home';
import { FormcounterPage } from '../pages/home/home';
import { FormoutletPage } from '../pages/home/home';
import { ProductdistributionPage } from '../pages/home/home';
import { ListprodukPage } from '../pages/home/home';
import { SetupAllCounterPage } from '../pages/home/home';
import { CategorycounterPage } from '../pages/home/home';
import { FormeditcounterPage } from '../pages/home/home';
import { ExpansionPage } from '../pages/home/home';
import { TypebusinessPage } from '../pages/home/home';
import { SearchplacesPage } from '../pages/home/home';


import { IonicStorageModule } from '@ionic/Storage';
import { HttpModule } from '@angular/http';
import { PostProvider } from '../providers/post-provider';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AnalyticsPage,
    MoveanddragPage,
    OutletPage,
    TrackingsalesPage,
    DatelistPage,
    CabanglistPage,
    CabangslistPage,
    SaleslistPage,
    SalesmanlistPage,
    AlloutletPage,
    AllcountertPage,
    SettingPage,
    ListproductPage,
    ListsalesoutletPage,
    MenusPage,
    FormcounterPage,
    FormoutletPage,
    ProductdistributionPage,
    ListprodukPage,
    SetupAllCounterPage,
    CategorycounterPage,
    FormeditcounterPage,
    ExpansionPage,
    TypebusinessPage,
    SearchplacesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AnalyticsPage,
    MoveanddragPage,
    OutletPage,
    TrackingsalesPage,
    DatelistPage,
    CabanglistPage,
    CabangslistPage,
    SaleslistPage,
    SalesmanlistPage,
    AlloutletPage,
    AllcountertPage,
    SettingPage,
    ListproductPage,
    ListsalesoutletPage,
    MenusPage,
    FormcounterPage,
    FormoutletPage,
    ProductdistributionPage,
    ListprodukPage,
    SetupAllCounterPage,
    CategorycounterPage,
    FormeditcounterPage,
    ExpansionPage,
    TypebusinessPage,
    SearchplacesPage
  ],
  providers: [
    PostProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
