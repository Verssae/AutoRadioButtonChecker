
document.addEventListener("DOMContentLoaded", function () {

  let save = document.getElementById("save")
  save.addEventListener("click", function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { greeting: "save" }, function (response) {
        console.log(response.farewell)
        showTable()
      })
    })
  })

  function removePair(url) {
    console.log(url)
    chrome.storage.sync.get("pairs", ({ pairs }) => {
      if (!pairs) {
        showTable()
        return
      }
      chrome.storage.sync.set(
        {
          pairs: pairs.filter(pair => pair.url != url)
        },
        () => {
          console.log("pair removed")
          showTable()
        }
      )
    })
  }

  function showTable() {
    let tbox = document.getElementById("tbox")
    let table = document.getElementsByTagName("table")[0]
    table.remove()
    let list = document.createElement("table")
    console.log(list)
    let tr = document.createElement("tr")
    let th1 = document.createElement("th")
    let th2 = document.createElement("th")
    let th3 = document.createElement("th")
    th1.textContent = "URL"
    th2.textContent = "CHECKS"
    th3.textContent = "X"
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    list.appendChild(tr)
    chrome.storage.sync.get("pairs", ({ pairs }) => {
      if (!pairs) {
        tbox.appendChild(list)
        return
      }
      pairs.forEach(({ url, checks }) => {
        console.log(url)
        let row = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")
        let rmbtn = document.createElement("button")
        rmbtn.textContent = "X"
        rmbtn.addEventListener("click", () => {
          removePair(url)
        })
        td1.textContent = url
        td2.textContent = checks
        td3.appendChild(rmbtn)
        row.appendChild(td1)
        row.appendChild(td2)
        row.appendChild(td3)
        list.appendChild(row)
      })
      tbox.appendChild(list)
    })
  }

  showTable()

})



