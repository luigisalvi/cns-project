// server-api.js

//Import these function in the videojs.component.ts and use there.
import {MediaLevel, Session, SessionAnalytics, Stream, StreamAnalytics, StreamKey} from "@API/server.interface";
import {environment} from "../environment/environment";

const server = environment.httpServerUrl;

// (FOR DEV.) Server call for logging of sessions'list.
export function session_get() {

  const url = server + '/sessions'; //Server endpoint for session checking/creation

  fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });

} //session_get


// Allow the server to check if the current user already exists
// in the database with its personal session of view. If not, it
// creates one new session and user.
export function session_post(): Promise<Session> {

  const url = server + '/sessions'; //Server endpoint for session checking/creation

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json();
    });

} //session_post


// Could be used also to set the streamId value.
export function streams_get(): Promise<[Stream]> {

  const url = server + '/streams'; //Server endpoint for session checking/creation

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  }).then(
    response => {
      return response.json();
    }
  )

} //streams_get

export function stream_get(id: string): Promise<Stream> {

  const url = server + '/streams/' + id; //Server endpoint for session checking/creation

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  }).then(
    response => {
      return response.json();
    }
  )

} //streams_get

// Let the server know about a play event
export function play_call(streamId: string) {

  const url = server + `/streams/${streamId}/started`; //Server endpoint for play info

  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });

} //play_event


// Let the server know about a pause/stop event
export function pause_call(streamId: string) {

  const url = server + `/streams/${streamId}/stopped`; //Server endpoint for pause/stop info

  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })

    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });

} //pause_event


// Let the server know about the view event
export function view_post(streamId: string, resolution: string) {

  const url = server + `/streams/${streamId}/views`; //Server endpoint for streams' views

  const data = {
    resolution: resolution,
  };

  fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });

} //view_post

export function stream_analytics_get(id: string): Promise<void | StreamAnalytics> {
  const url = server + `/analytics/streams?id=${id}`; //Server endpoint for streams' views

  return fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
     .then(response => {
        if (!response.ok) {
          throw new Error('Error calling server');
        }
        return response.json() as Promise<StreamAnalytics>;
      })
      .catch(error => {
        console.error('Error:', error);
    });
}

export function session_analytics_get(id?: string): Promise<void | SessionAnalytics[]> {
  const url = server + (id ? `/analytics/sessions?id=${id}` : `/analytics/sessions`); //Server endpoint for session checking/creation
  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json() as Promise<SessionAnalytics[]>;
    })
    .catch(error => {
      console.error('Error:', error);
      //return undefined;
    });
}

// Server call for posting stream metrics
export function metrics_post(streamId: string, trigger: string, timestamp: string, screenSize: object,
                             currentMediaLevel: MediaLevel,
                             streamedTime: number, downloadedBytes: number, bufferings: [{
    timestamp: string,
    videoTimestamp: number,
    duration: number
  }?],
                             downloadRate: number, bandwidth: number) {

  const url = server + `/streams/${streamId}/metrics`; //Server endpoint for streams'metrics

  const data = {
    trigger: trigger,
    timestamp: timestamp,
    screenSize: screenSize,
    currentMediaLevel: currentMediaLevel,
    streamedTime: streamedTime,
    downloadedBytes: downloadedBytes,
    bufferings: bufferings,
    downloadRate: downloadRate,
    bandwidth: bandwidth,
  };

  fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });

} //metrics_post


// (FOR DEV. PURPOSES)
export function m3u8_get(streamId: string) {

  const url = server + `/videos/${streamId}/master.m3u8`; //Server endpoint for streams' views

  fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

export function generateStreamKey(): Promise<void | StreamKey> {
  const url = server + `/streams/key`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error calling server');
      }
      return response.json() as Promise<StreamKey>;
    })
    .catch(error => {
      console.error('Error:', error);
      //return undefined;
    });
}

//---------ADD HERE OTHER CALLS AND ENDPOINTS---------//
// To-do: Add to session_analytics_get the user agent and client IP to table them.
