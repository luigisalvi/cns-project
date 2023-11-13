import {Component, OnInit} from '@angular/core';
import {generateStreamKey, session_post, streams_get} from "@API/server-api";
import {Stream, StreamKey} from "@API/server.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.css']
})
export class StreamListComponent implements OnInit {

  streams$: Promise<Array<Stream>> | undefined;
  streamKey: string = "";
  streamKeyVisible: boolean = false;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    //Server call for session set up
    session_post();

    //Get the list of available streams and show it through a clickable menu
    this.streams$ = streams_get()
  }

  public selectStream(stream: Stream): void {
    this.router.navigate(['streaming', stream.id])
  }

  public selectDashboard() : void {
    this.router.navigate(['session-dashboard'])
  }

  public generateStreamKey(): void {
    this.streamKeyVisible = !this.streamKeyVisible;
    generateStreamKey().then((streamKey: void | StreamKey) => {
      this.streamKey = streamKey?.key!;
    })
  }
}
