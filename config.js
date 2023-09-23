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
  },
  hls: {
    enabled: true, // Abilita la generazione dello stream HLS
    path: 'C:\\Users\\39349\\Desktop\\angular-prj\\hls-stream', // Percorso in cui verranno generati gli stream HLS
    fragment: 5, // Durata dei frammenti HLS in secondi (opzionale)
    // Altre opzioni specifiche per HLS se necessario
  },
};

const nms = new NodeMediaServer(config);
nms.run();

// npm install node-media-server //
// node config.js //