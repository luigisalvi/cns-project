// server-api.js

//Import these function in the videojs.component.ts and use there. 

// Let the server know about a play event
export function play_call (streamId: string) {
    
    const url = 'https://184f-151-50-139-61.ngrok-free.app/stream/{streamId}/started'; //Server endpoint
    let play_data = {
      streamId: streamId,
      resolution:'1080' 
    }

    fetch(url , {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(play_data),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    } )
    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nella chiamata al server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Errore:', error);
    });

} //play_event

// Let the server know about a pause/stop event
  export function pause_call (streamId: string) {
    
    const url = 'https://184f-151-50-139-61.ngrok-free.app/stream/{streamId}/stopped';

    let pause_data = {
      streamId: streamId,
      resolution:'1080' 
    }
  
    fetch(url , {
      method: 'POST',
      credentials: 'include',
      //body: JSON.stringify(pause_data),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    } )

    // Error handling //
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nella chiamata al server');
      }
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error('Errore:', error);
    });

  } //pause_event


  // Add other calls and endpoints //
