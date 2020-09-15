
function init() {
    console.log("initiated!")
    let names = []
    let radios = document.querySelectorAll('input[type=radio]')
    names = Array.from(new Set([...radios].map(radio=>radio.name)))
    console.log(names)
    console.log(findAllChecked(names))
    chrome.storage.sync.set({names: names},()=>console.log("saved"))
    chrome.storage.sync.get("names", items => {
        console.log(items)
    })
    chrome.runtime.sendMessage({names: names}, response=>console.log(response.farewell))
}

function findAllChecked(nl) {
    let checked_list = []
    for (let i=0; i<nl.length; i++) {
        let buttons = Array.from(document.getElementsByName(nl[i]))
        for (let j=0; j<buttons.length; j++) {
            if (buttons[j].checked) {
                checked_list.push(j)
            }
        }
    }
    console.log(checked_list)
    return checked_list
}

function sayHello() {
    console.log("HELLO")
}


init()