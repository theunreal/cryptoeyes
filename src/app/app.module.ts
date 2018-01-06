import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { CryptoProvider } from '../providers/crypto/crypto';
import {HttpClientModule} from "@angular/common/http";
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const config: SocketIoConfig = { url: 'wss://streamer.cryptocompare.com', options: {} };

  @NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      locationStrategy: 'path'
    }),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CryptoProvider
  ]
})
export class AppModule {}
