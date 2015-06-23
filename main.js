var videoData;

function genericOnClick(info, tab) {
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  console.log(info["srcUrl"]);
  
  getVideo(info["srcUrl"]);
}

function Uint8ToString(u8a){
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
    }
  return c.join("");
}

function getDownloadLink(fileName, fileData) {
  var pom = document.createElement('a');
  var b64encoded = btoa(Uint8ToString(fileData));
  pom.setAttribute('href', 'data:image/gif;base64,' + b64encoded);
  pom.setAttribute('download', fileName);

  document.body.appendChild(pom);
  pom.click();
  document.body.removeChild(pom);
}

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
  args = ["-i", "twitgif.webm", "-vf", "showinfo", "-nostdin", "-strict", "-2", "output.gif"];
  file = [{data: video, name: "twitgif.webm"}];

  var results = ffmpeg_run({
    arguments: args,
    files: file
  });

  results.forEach(function(file) {
    console.log("File recieved", file.name, file.data);
    var data = new Uint8Array(file.data);
    getDownloadLink(file.name, data);
  });
}

chrome.contextMenus.create({
  "title": "TwitGif", 
  "contexts":["video"], 
  "onclick": genericOnClick,
  "documentUrlPatterns": ["*://twitter.com/*"]
});
