function init() {

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    )
    if (request.greeting == "save") {
        console.log("save snapshot")
        sendResponse({ farewell: "save done" })
    }
    if (request.greeting == "load") {
        console.log(findAllChecked(names))
        sendResponse({ farewell: "load done" })
    }
  })

  let names = []
  let radios = document.querySelectorAll("input[type=radio]")
  names = Array.from(new Set([...radios].map((radio) => radio.name)))
  console.log(names)

//   chrome.runtime.sendMessage({ greeting: "names" }, function (response) {
//     console.log("content")
//     console.log(response)
    
//   })

}

function findAllChecked(nl) {
  let checked_list = []
  for (let i = 0; i < nl.length; i++) {
    let buttons = Array.from(document.getElementsByName(nl[i]))
    for (let j = 0; j < buttons.length; j++) {
      if (buttons[j].checked) {
        checked_list.push(j)
      }
    }
  }
  return checked_list
}

init()

//   chrome.storage.sync.set({ names: names }, () => console.log("saved"))
//   chrome.storage.sync.get("names", (items) => {
//     console.log(items)
//   })