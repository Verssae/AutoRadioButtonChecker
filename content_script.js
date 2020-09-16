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
            savePair(names, current_url)
            sendResponse({ farewell: "save done" })
        }
        if (request.greeting == "load") {
            showPairs()
            sendResponse({ farewell: "load done" })
        }
    })

    let names = []
    let radios = document.querySelectorAll("input[type=radio]")
    names = Array.from(new Set([...radios].map((radio) => radio.name)))
    console.log(names)
    let current_url = `${location.origin}${location.pathname}`

    chrome.storage.local.get("pairs", ({ pairs }) => {
        pairs.forEach(({url, checks})=> {
            if (current_url == url) {
                checkBy(names, checks)
            }
        })
    })
}

function savePair(names, url) {
    console.log(url)
    chrome.storage.local.get("pairs", ({ pairs }) => {
        if (pairs == undefined) {
            pairs = []
        }
        let updated = false
        pairs = pairs.map((pair) => {
            if (pair.url == url) {
                pair = {
                    url: url,
                    checks: findAllChecked(names),
                }
                updated = true
            }
            return pair
        })
        if (updated) {
            chrome.storage.local.set({ pairs: pairs }, () =>
                console.log("pairs updated")
            )
        } else {
            chrome.storage.local.set(
                {
                    pairs: [
                        ...pairs,
                        {
                            url: url,
                            checks: findAllChecked(names),
                        },
                    ],
                },
                () => console.log("pairs added")
            )
        }
    })
}

function showPairs() {
    chrome.storage.local.get("pairs", ({ pairs }) => {
        console.log(pairs)
    })
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

function checkBy(names, checks) {
    if (checks && checks.length == names.length) {
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
