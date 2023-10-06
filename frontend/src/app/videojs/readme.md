# VideoJS Angular Component

This is an Angular component that utilizes the [Video.js](https://videojs.com/) library for video playback in a web application. The component offers features for monitoring streaming metrics and interacts with a server through provided API calls.

## Main Files

### videojs.component.ts

This file contains the main Angular component `VjsPlayerComponent`, responsible for managing the video.js video player and monitoring streaming metrics. Some of the key functionalities include:

- **Initialization of video.js player**: Initializes the Video.js video player with custom options for playback control and viewability.
  
- **Monitoring Streaming Metrics functions**:
  - `rebuffering()`: Calculates buffering events during playback.
  - `user_metrics()`: Collects streaming metrics (download bitrate, bandwidth and downladed bytes).
  - `detectMediaChange()`: Detects quality level changes during video playback.

- **Handling Video Player Events**:
  - `view_event()`: Implements the view policy, counting video views.
  - `sendMetrics()`: Sends streaming metrics to the server, including elapsed time, bandwidth, etc.

- **Initialization and Configuration**:
  - `ngOnInit()`: Initializes the component, handles user sessions, and sets the video to play.
  - `ngAfterViewInit()`: Manages video player events and metric monitoring.

### server-api.ts

This file contains a set of functions for making  http:// server calls. Some of the key functionalities include:

- `session_get()` and `session_post()`: Managing user sessions for tracking users and sessions.
- `streams_get()`: Retrieving information about available video streams.
- `play_call()` and `pause_call()`: Reporting play and pause events to the server.
- `view_post()`: Reporting view events to the server.
- `metrics_post()`: Sending streaming metrics to the server.

## Streaming Metrics

Below is a table of streaming metrics that are collected and sent to the server:

| Metric                    | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| Timestamp (ISO)            | Date and time in ISO format                          |
| Screen Size                | User's screen dimensions (width x height)            |
| Current Resolution         | Current video resolution (e.g., "1920x1080")         |
| Elapsed Time               | Time elapsed in the video (in seconds)               |
| Downloaded Bytes           | Number of bytes downloaded during playback           |
| Buffering Times            | Timestamp, video-time, and duration of pauses         |
| Download Rate              | Average download speed (in Mbps)                     |
| Bandwidth                  | Available bandwidth (in Mbps)                        |

## How to Use the Component

To use this Angular component in your project, follow these steps:

1. Ensure you have Angular and Video.js installed in your project.
2. Add the `VjsPlayerComponent` to your module and use it in your template.
3. Configure the component with desired options for the Video.js player.
4. Customize metric monitoring and API calls according to your needs.

