var videoData;

function genericOnClick(info, tab) {
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  console.log(info["srcUrl"]);
  
  getVideo(info["srcUrl"]);
}

function getVideo(url) {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function(oEvent) {
    var arrayBuffer = oReq.response;
    if (arrayBuffer) {
      videoData = new Uint8Array(arrayBuffer);
    }
  }

  oReq.send();
}

function convertVideo() {

}

chrome.contextMenus.create({
  "title": "TwitGif", 
  "contexts":["video"], 
  "onclick": genericOnClick,
  "documentUrlPatterns": ["*://twitter.com/*"]
});
