var client = AgoraRTC.createClient({mode: 'live', codec: "h264"});

client.init('069f570d02484c6d9a7ad12e55091268', function () {
    console.log("AgoraRTC client initialized");
  
  }, function (err) {
    console.log("AgoraRTC client init failed", err);
  });