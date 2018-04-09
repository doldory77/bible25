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
import { RestProvider } from '../providers/rest/rest';

@NgModule({
  declarations: [
    MyApp,
    HymnSearchTypeComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HymnSearchTypeComponent
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
    RestProvider
  ]
})
export class AppModule {}
