import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuProvider } from '../providers/menu/menu';
import { SQLite } from '@ionic-native/sqlite';
import { DbProvider } from '../providers/db/db';
import { HttpClientModule } from '@angular/common/http';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Media } from '@ionic-native/media';
import { PlayerProvider } from '../providers/player/player';
import { HymnSearchTypeComponent } from '../components/hymn-search-type/hymn-search-type';
import { AdPopupComponent } from '../components/ad-popup/ad-popup';
import { RestProvider } from '../providers/rest/rest';
import { UtilProvider } from '../providers/util/util';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Push } from '@ionic-native/push';
import { NativeAudio } from '@ionic-native/native-audio';
import { Network } from '@ionic-native/network';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser'

@NgModule({
  declarations: [
    MyApp,
    HymnSearchTypeComponent,
    AdPopupComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicImageViewerModule,
    IonicStorageModule.forRoot({
      name: 'config_db',
      driverOrder: ['indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HymnSearchTypeComponent,
    AdPopupComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileTransfer,
    Media,
    MenuProvider,
    SQLite,
    DbProvider,
    PlayerProvider,
    RestProvider,
    UtilProvider,
    Push,
    NativeAudio,
    Network,
    GlobalVarsProvider,
    InAppBrowser
  ]
})
export class AppModule {}
