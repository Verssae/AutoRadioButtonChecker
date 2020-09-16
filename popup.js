
document.addEventListener("DOMContentLoaded", function () {
 
  let save = document.getElementById("save")
  save.addEventListener("click", function () {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "save"}, function(response) {
        console.log(response.farewell);
      });
    });
    

  })

  let load = document.getElementById("load")
  load.addEventListener("click", function () {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "load"}, function(response) {
        console.log(response.farewell);
      });
    });
    

  })
  
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    )
    if (request.greeting == "names") {
      console.log(greeting)
      sendResponse({ farewell: "ok" })
    } 
  })

  
})
// let names = []
    // chrome.storage.sync.get("names", (items) => {
    //   names = items
    //   console.log(names)
    // })