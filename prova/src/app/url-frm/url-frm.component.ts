import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UrlService} from "../url.service";

@Component({
  selector: 'app-url-frm',
  templateUrl: './url-frm.component.html',
  styleUrls: ['./url-frm.component.css']
})
export class UrlFrmComponent implements OnInit {
  urlForm!: FormGroup;


  constructor(private fb: FormBuilder, private urlService: UrlService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.urlForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  onSubmit() {
    if (this.urlForm?.valid) {
      const url = this.urlForm?.get('url')?.value;
      console.log('Submitted URL:', url);
      // this.urlService.setUrl(url)
      // Handle the URL (e.g., send to server or process further)
    } else {
      // Handle form validation errors
    }
  }
}
