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

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function getDownloadLink(fileName, fileData) {
  var pom = document.createElement('a');
  var b64encoded = btoa(Uint8ToString(fileData));
  var blob = b64toBlob(b64encoded, "image/gif");
  var url = window.URL.createObjectURL(blob);
  pom.setAttribute('href', url);
  pom.setAttribute('download', fileName);

  document.body.appendChild(pom);
  pom.click();
  document.body.removeChild(pom);
  window.URL.revokeObjectURL(url);
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
  var Module = {
    arguments: ["-i", "twitgif", "-nostdin", "-strict", "-2", "twitgif.gif"],
    files: [{data: video, name: "twitgif"}],
    TOTAL_MEMORY: 268435456
  }

  var results = ffmpeg_run({Module});

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
