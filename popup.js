
document.addEventListener("DOMContentLoaded", function () {

  let save = document.getElementById("save")
  console.log("save")
  console.log(save)
  save.addEventListener("click", function () {
    console.log("save clicked")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { greeting: "save" }, function (response) {
        console.log("responded")
        showTable()
        // window.location.reload()
      })

    })
  })

  function removePair(url) {

    chrome.storage.sync.get("pairs", ({ pairs }) => {
      if (!pairs) {
        // showTable()
        window.location.reload()
        return
      }
      chrome.storage.sync.set(
        {
          pairs: pairs.filter(pair => pair.url != url)
        },
        () => {
          showTable()
          // window.location.reload()
        }
      )
    })
  }


  function showTable() {
    let tbox = document.getElementById("tbox")
    let table = document.getElementsByTagName("table")[0]
    table.remove()
    let list = document.createElement("table")
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

  

  function syncizeHtmlPage() {
    //syncize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++) {
      var obj = objects[j];

      var valStrH = obj.innerHTML.toString();
      var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
        return v1 ? chrome.i18n.getMessage(v1) : "";
      });

      if (valNewH != valStrH) {
        obj.innerHTML = valNewH;
      }
    }
  }

  syncizeHtmlPage();
  showTable()

})



