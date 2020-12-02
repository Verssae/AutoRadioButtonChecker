



var current_url = `${location.origin}${location.pathname}`

function getNames() {
    let names = []
    let radios = document.querySelectorAll("input[type=radio]")
    names = Array.from(new Set([...radios].map((radio) => radio.name)))
    return names
}

function checkAll(names, current_url) {
    chrome.storage.sync.get("pairs", ({ pairs }) => {
        if (pairs) {
            pairs.forEach(({ url, checks }) => {
                if ((current_url).includes(url)) {
                    checkBy(names, checks)
                }
            })
        }

    })
}

function savePair(names, url) {
    console.log(url)
    chrome.storage.sync.get("pairs", ({ pairs }) => {
        if (pairs == undefined) {
            pairs = []
        }
        let updated = false
        pairs = pairs.map((pair) => {
            if ((pair.url).includes(url)) {
                pair = {
                    url: url,
                    checks: findAllChecked(names),
                }
                updated = true
            }
            return pair
        })
        if (updated) {
            chrome.storage.sync.set({ pairs: pairs }, () =>
                console.log("pairs updated")
            )
        } else {
            chrome.storage.sync.set(
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
        for (let i = 0; i < names.length; i++) {
            let buttons = Array.from(document.getElementsByName(names[i]))
            buttons[checks[i]].checked = true
        }
    }
}


chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
) {

    if (request.greeting == "save") {
        console.log("Saving start")
        savePair(getNames(), current_url)
        sendResponse({ farewell: "save done" })
    }

})


let timer = setInterval(() => checkAll(getNames(), current_url), 100)
setTimeout(() => clearInterval(timer), 2000)
console.log("[AUTO RADIO BUTTON CHEKCER is activated]\n\n")
console.log("Found radio buttons in this page:")
console.log(getNames())





