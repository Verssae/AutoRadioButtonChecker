console.log("🚀 Popup script file loaded!");

// 즉시 실행되는 테스트 코드
console.log("🧪 Testing basic functionality...");

// 전역 함수 정의
async function removePair(url) {
  console.log("🗑️ Removing pair for URL:", url);
  
  try {
    const { pairs } = await chrome.storage.sync.get("pairs");
    console.log("📊 Current pairs:", pairs);
    
    if (!pairs) {
      console.log("ℹ️ No pairs found, reloading...");
      window.location.reload();
      return;
    }
    
    const filteredPairs = pairs.filter(pair => pair.url !== url);
    console.log("🔄 Filtered pairs:", filteredPairs);
    
    await chrome.storage.sync.set({ pairs: filteredPairs });
    console.log("✅ Pair removed successfully");
    
    await showTable();
  } catch (error) {
    console.error("💥 Error removing pair:", error);
  }
}

async function showTable() {
  console.log("📊 Showing table...");
  
  const tbox = document.getElementById("tbox");
  const existingTable = document.getElementsByTagName("table")[0];
  if (existingTable) {
    existingTable.remove();
  }
  
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  
  // Create header
  const headers = [
    chrome.i18n.getMessage("headerUrl"),
    chrome.i18n.getMessage("headerChecks"),
    chrome.i18n.getMessage("headerDel")
  ];
  headers.forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  try {
    const { pairs } = await chrome.storage.sync.get("pairs");
    console.log("📋 Retrieved pairs:", pairs);
    
    if (!pairs || pairs.length === 0) {
      console.log("ℹ️ No pairs found");
      tbox.appendChild(table);
      return;
    }

    pairs.forEach(({ url, checks }) => {
      console.log(`📄 Adding row: ${url} -> ${checks}`);
      
      const row = document.createElement("tr");
      
      // URL cell
      const urlCell = document.createElement("td");
      urlCell.textContent = url;
      urlCell.style.maxWidth = "200px";
      urlCell.style.wordBreak = "break-all";
      
      // Checks cell
      const checksCell = document.createElement("td");
      if (Array.isArray(checks)) {
        // 각 인덱스에 +1을 더해서 표시 (사용자 친화적)
        const displayChecks = checks.map(index => index === -1 ? chrome.i18n.getMessage("noSelection") : index + 1);
        checksCell.textContent = displayChecks.join(", ");
      } else {
        // 단일 값인 경우에도 +1을 더해서 표시, -1인 경우 "X" 표시
        checksCell.textContent = checks === -1 ? chrome.i18n.getMessage("noSelection") : (checks + 1).toString();
      }
      
      // Remove button cell
      const removeCell = document.createElement("td");
      const removeButton = document.createElement("button");
      removeButton.textContent = chrome.i18n.getMessage("deleteButton");
      removeButton.style.background = "#f44336";
      removeButton.style.color = "white";
      removeButton.style.border = "none";
      removeButton.style.padding = "5px 10px";
      removeButton.style.borderRadius = "3px";
      removeButton.style.cursor = "pointer";
      removeButton.addEventListener("click", () => removePair(url));
      removeCell.appendChild(removeButton);
      
      row.appendChild(urlCell);
      row.appendChild(checksCell);
      row.appendChild(removeCell);
      table.appendChild(row);
    });
    
    tbox.appendChild(table);
    console.log("✅ Table displayed successfully");
    
  } catch (error) {
    console.error("💥 Error displaying table:", error);
  }
}

function syncizeHtmlPage() {
  console.log("🌍 Synchronizing HTML page...");
  
  // Synchronize by replacing __MSG_***__ meta tags
  const htmlElements = document.getElementsByTagName('html');
  
  for (const element of htmlElements) {
    const originalHtml = element.innerHTML;
    const updatedHtml = originalHtml.replace(/__MSG_(\w+)__/g, (match, key) => {
      const message = chrome.i18n.getMessage(key);
      console.log(`🔄 Replacing ${match} with: ${message}`);
      return message || match;
    });

    if (updatedHtml !== originalHtml) {
      element.innerHTML = updatedHtml;
    }
  }
  
  console.log("✅ HTML page synchronized");
}

// 페이지 완전 로드 후 실행되는 코드
window.addEventListener('load', function() {
  console.log("📄 Window loaded");
  
  const saveButton = document.getElementById("save");
  console.log("🔍 Save button check:", saveButton);
  
  if (saveButton) {
    console.log("✅ Save button found, adding save functionality...");
    
    // 저장 기능
    saveButton.addEventListener("click", async function() {
      console.log("🎯 SAVE BUTTON CLICKED!");
      
      try {
        // 현재 활성 탭 가져오기
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log("📋 Active tabs:", tabs);
        
        if (!tabs || tabs.length === 0) {
          console.error("❌ No active tab found");
          return;
        }
        
        const activeTab = tabs[0];
        console.log("🌐 Active tab:", activeTab.url);
        
        // 콘텐츠 스크립트에 메시지 전송
        console.log("📤 Sending message to content script...");
        const response = await chrome.tabs.sendMessage(activeTab.id, { greeting: "save" });
        console.log("📨 Response from content script:", response);
        
        if (response && response.farewell === "save done") {
          console.log("✅ Save operation completed successfully");
          
          // 테이블 업데이트
          await showTable();
        } else {
          console.error("❌ Unexpected response:", response);
        }
        
      } catch (error) {
        console.error("💥 Error during save operation:", error);
      }
    });
    
    console.log("✅ Save functionality added");
  } else {
    console.error("❌ Save button not found!");
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  console.log("🎯 Popup script DOM loaded");
  
  // 초기화
  try {
    console.log("🚀 Initializing popup...");
    syncizeHtmlPage();
    await showTable();
    console.log("✅ Popup initialized successfully");
  } catch (error) {
    console.error("💥 Error during initialization:", error);
  }
});



