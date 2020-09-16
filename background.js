// chrome.runtime.onInstalled.addListener(function () {
//   //   chrome.storage.sync.set({ urls: [location.href] }, function () {
//   //     console.log("The color is green.")
//   //   })
//   // })

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  )
  if (request.greeting == "hello") sendResponse({ farewell: "goodbye" })
})
