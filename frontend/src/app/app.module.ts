import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VjsPlayerComponent } from './videojs/videojs.component';
import { UrlFrmComponent } from './url-frm/url-frm.component';
import {ReactiveFormsModule} from "@angular/forms";
import { VideoUploadComponent } from './video-upload/video-upload.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    AppComponent,
    VjsPlayerComponent,
    UrlFrmComponent,
    VideoUploadComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
