import {Component} from '@angular/core';
import {UrlService} from "../url.service";


@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent {

  constructor(private urlService: UrlService) { }

  onFileSelected(event: any) {
    /*[0] index allows to select from the files'list just one of them: if the user
    selects more than one file it will autocatically be assigned to the variable file
    the first selected file. */
    
    const file = event.target.files[0];


    if (file) {
      const videoURL = URL.createObjectURL(file); // string obj
      // this.playVideo(videoURL); // if needed a server call to inform about local video upload, please choose the appropirate call from ../videojs/server-api.ts
      /* Info's callbacks */
      console.log("Nome del file:", file.name);
      console.log("Tipo del file:", file.type);
      console.log("Dimensione del file:", file.size, "byte");

      this.urlService.setVideo(videoURL, file.name, file.type, file.size)
    }
  }

}
