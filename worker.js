importScripts('videoconverter.js/ffmpeg.js');

function getVideo(url) {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function(oEvent) {
    var arrayBuffer = oReq.response;
    if (arrayBuffer) {
      videoData = new Uint8Array(arrayBuffer);
      convertVideo(videoData);
    }
  }

  oReq.send();
}

function convertVideo(video) {
  var Module = {
    arguments: ["-i", "twitgif", "-nostdin", "-strict", "-2", "twitgif.gif"],
    files: [{data: video, name: "twitgif"}],
    TOTAL_MEMORY: 268435456
  }

  var results = ffmpeg_run(Module);

  results.forEach(function(file) {
    console.log("File recieved", file.name, file.data);
    var data = new Uint8Array(file.data);
    postMessage({
      fileName: file.name,
      data: data
    });
  });
}

onmessage = function(event) {
  var message = event.data;

  getVideo(message);
}
