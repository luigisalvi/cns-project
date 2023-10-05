// server-api.js

//Import these function in the videojs.component.ts and use there.
const server = 'http://localhost:3000'

// (FOR DEV.) Server call for logging of sessions'list.
export function session_get() {

  const url = server +'/sessions'; //Server endpoint for session checking/creation

  fetch(url , {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  } )
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
export function session_post() {

  const url = server +'/sessions'; //Server endpoint for session checking/creation

  fetch(url , {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  } )
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

} //session_post


  // (FOR DEV.) Server call for logging of streams'list. Could be used also to set the streamId value.
  export function streams_get(): Promise<[{
    id: string,
    name: string,
    description: string,
    ref: string,
    resolutions: [string]
  }]> {

    let r: [{
      id: string,
      name: string,
      description: string,
      ref: string,
      resolutions: [string]
    }] | undefined = undefined;
    const url = server + '/streams'; //Server endpoint for session checking/creation

    return fetch(url , {
      method: 'GET',
      credentials: 'include',
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    } ).then(
      response => {
        return response.json();
      }
    )

  } //streams_get


// Let the server know about a play event
export function play_call (streamId: string) {

    const url = server +`/streams/${streamId}/started`; //Server endpoint for play info

    /* let play_data = {
      streamId: streamId,
      resolution:'1080'
    } */

    fetch(url , {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(play_data),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    } )
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
  export function pause_call (streamId: string) {

    const url = server +`/streams/${streamId}/stopped`; //Server endpoint for pause/stop info

  /* let pause_data = {
      streamId: streamId,
      resolution:'1080'
    } */

    fetch(url , {
      method: 'POST',
      credentials: 'include',
      //body: JSON.stringify(pause_data),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    } )

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
export function view_post(streamId: string , resolution: string) {

  const url = server +`/streams/${streamId}/views`; //Server endpoint for streams' views

  const data = {
    resolution: resolution,
  };

  fetch(url , {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  } )
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


// Server call for posting stream metrics
export function metrics_post(streamId: string, trigger: string, timestamp: string, screenSize: object,
  currentMediaLevel: {resolution: string, bandwidth: number, level: number, media: string},
  streamedTime: number,  downloadedBytes: number, bufferings:[{timestamp: string,videoTimestamp: number,duration: number}?],
  downloadRate: number, bandwidth: number  ) {

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

  fetch(url , {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  } )
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


export function m3u8_get(streamId: string ) {

  const url = server +`/videos/${streamId}/master.m3u8`; //Server endpoint for streams' views

  fetch(url , {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-type': 'application/json; charset=UTF-8'}
  } )
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
  // Add other calls and endpoints //
