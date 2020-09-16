function init() {
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
    if (request.greeting == "save") {
      chrome.storage.local.get("url", ({ url }) => {
        chrome.storage.local.set({ checks: findAllChecked(names) }, () =>
          console.log(`url saved: ${url} : ${findAllChecked(names)}`)
        )
      })

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

  chrome.storage.local.get("checks", (checks) => checkBy(names, checks))
}

function findAllChecked(names) {
  let checked_list = []
  for (let i = 0; i < names.length; i++) {
    let buttons = Array.from(document.getElementsByName(names[i]))
    for (let j = 0; j < buttons.length; j++) {
      if (buttons[j].checked) {
        checked_list.push(j)
      }
    }
  }
  return checked_list
}

function checkBy(names, {checks}) {
  if (checks) {
      console.log(checks)
    for (let i = 0; i < names.length; i++) {
      let buttons = Array.from(document.getElementsByName(names[i]))
    //   console.log(buttons[checks[i]])
      buttons[checks[i]].checked = true
    }
  }
}

init()

//   chrome.storage.sync.set({ names: names }, () => console.log("saved"))
//   chrome.storage.sync.get("names", (items) => {
//     console.log(items)
//   })
