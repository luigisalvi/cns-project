import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private urlSubject = new BehaviorSubject<{
    url: string;
    name: string;
    type: string;
    size: number;
  }>({
    url: "",
    type: "",
    name: "",
    size: 0
  });
  url$ = this.urlSubject.asObservable();

  setVideo(url: string, name: string, type: string, size: number) {
    this.urlSubject.next({url, name, type, size});
  }
}
