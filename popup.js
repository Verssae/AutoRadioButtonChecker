document.addEventListener('DOMContentLoaded', function() {
    var save = document.getElementById('save')
    save.addEventListener('click', function() {
        console.log("hllo")
        let names = []
        chrome.storage.sync.get("names", items => {
            names = itemsß
        })
        findAllChecked(names)
        sayHello()
    })

    chrome.runtime.onMessage.addListener(
        function
    )
})

