import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {JwtHelper, AuthConfig, AuthHttp} from "angular2-jwt";
import {Http, HttpModule, RequestOptions} from "@angular/http";
import {CustomFormsModule} from 'ng2-validation'
//native
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage, IonicStorageModule} from "@ionic/storage";
import { Geolocation } from '@ionic-native/geolocation';
import { Crop } from '@ionic-native/crop';
//pages
import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {SignupPage} from "../pages/signup/signup";
//providers
import { AuthProvider } from "../providers/auth/auth";
import { UserserviceProvider } from '../providers/userservice/userservice';
import { StockserviceProvider } from '../providers/stockservice/stockservice';
import { StompService } from 'ng2-stomp-service';
import { ChatserviceProvider } from '../providers/chatservice/chatservice';
import { PictureserviceProvider } from '../providers/pictureservice/pictureservice';

export function authHttpServiceFactory(http: Http, options: RequestOptions, storage: Storage) {
  const authConfig = new AuthConfig({
    tokenGetter: (() => storage.get('jwt')),
    globalHeaders:[{'Content-Type':'application/json'}]
  });
  return new AuthHttp(authConfig, http, options);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: 'myapp',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    CustomFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Crop,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    JwtHelper, {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions, Storage]
    },
    UserserviceProvider,
    StockserviceProvider,
    StompService,
    ChatserviceProvider,
    PictureserviceProvider]
})
export class AppModule {
}
