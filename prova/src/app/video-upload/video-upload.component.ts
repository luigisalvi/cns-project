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
    /*[0] è l'indice nell'array FileList. Poiché l'utente può selezionare più file,
    [0] restituisce il primo file nell'elenco, cioè il file selezionato dall'utente.
    Se l'utente ha selezionato un solo file, event.target.files[0] restituirà quel file.*/
    const file = event.target.files[0];


    if (file) {
      const videoURL = URL.createObjectURL(file); /* Tipo string */
      // this.playVideo(videoURL);
      /*Display in console di alcune info del file */
      console.log("Nome del file:", file.name);
      console.log("Tipo del file:", file.type);
      console.log("Dimensione del file:", file.size, "byte");

      this.urlService.setVideo(videoURL, file.name, file.type, file.size)
    }
  }

}
