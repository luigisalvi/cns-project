import {Component, OnInit} from '@angular/core';
import {session_post, streams_get} from "@API/server-api";
import {Stream} from "@API/server.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.css']
})
export class StreamListComponent implements OnInit {

  streams$: Promise<Array<Stream>> | undefined;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Server call for session set up
    session_post();

    this.streams$ = streams_get()
  }

  public selectStream(stream: Stream): void {
    this.router.navigate(['streaming', stream.id])
  }


}
