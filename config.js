const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935, // Porta RTMP
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8000, // Porta HTTP per la visualizzazione dello stream
    allow_origin: '*',
    mediaroot: "./server/media"
  },
  trans: {
    ffmpeg: 'C:/Users/nsant/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-6.0-full_build/bin/ffmpeg.exe',
    tasks: [
        {
          app: 'live',
          vc: "copy",
          vcParam: [],
          ac: "aac",
          acParam: ['-ab', '64k', '-ac', '1', '-ar', '44100'],
          rtmp:true,
          rtmpApp:'live2',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          dash: true,
          dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
        }
    ]
  }
};

const nms = new NodeMediaServer(config);
nms.run();

// npm install node-media-server //
// node config.js //