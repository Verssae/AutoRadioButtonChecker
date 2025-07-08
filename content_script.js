const currentUrl = `${location.origin}${location.pathname}`;
console.log("🌐 Content script loaded for URL:", currentUrl);

/**
 * Get all unique radio button names on the page
 * @returns {string[]} Array of radio button names
 */
function getRadioButtonNames() {
  const radioButtons = document.querySelectorAll("input[type=radio]");
  const names = [...radioButtons].map(radio => radio.name);
  const uniqueNames = [...new Set(names)];
  
  console.log("🔘 Found radio buttons:", radioButtons.length);
  console.log("📋 Unique radio button names:", uniqueNames);
  
  return uniqueNames;
}

/**
 * Check radio buttons based on stored configuration
 * @param {string[]} names - Array of radio button names
 * @param {string} url - Current page URL
 */
async function checkStoredRadioButtons(names, url) {
  console.log("🔍 Checking stored radio buttons...");
  
  try {
    const { pairs } = await chrome.storage.sync.get("pairs");
    console.log("📊 Retrieved pairs from storage:", pairs);
    
    if (!pairs || pairs.length === 0) {
      console.log("ℹ️ No stored pairs found");
      return;
    }

    let foundMatch = false;
    pairs.forEach(({ url: storedUrl, checks }) => {
      console.log(`🔗 Checking if '${url}' includes '${storedUrl}'`);
      
      if (url.includes(storedUrl)) {
        console.log("✅ URL match found! Applying stored selections...");
        console.log("📋 Stored checks:", checks);
        
        applyCheckedState(names, checks);
        foundMatch = true;
      }
    });
    
    if (!foundMatch) {
      console.log("❌ No matching URL found in stored pairs");
    }
    
  } catch (error) {
    console.error("💥 Error checking stored radio buttons:", error);
  }
}

/**
 * Save current radio button state to storage
 * @param {string[]} names - Array of radio button names
 * @param {string} url - Current page URL
 */
async function saveRadioButtonState(names, url) {
  console.log("💾 Saving radio button state for URL:", url);
  console.log("📋 Radio button names:", names);
  
  try {
    const { pairs = [] } = await chrome.storage.sync.get("pairs");
    console.log("📊 Current pairs in storage:", pairs);
    
    const checkedIndices = findCheckedIndices(names);
    console.log("🎯 Found checked indices:", checkedIndices);
    
    if (checkedIndices.length === 0) {
      console.warn("⚠️ No radio buttons are currently selected");
    }
    
    // Check if URL already exists and update, otherwise add new entry
    const existingIndex = pairs.findIndex(pair => pair.url.includes(url));
    
    if (existingIndex !== -1) {
      console.log("🔄 Updating existing entry at index:", existingIndex);
      // Update existing entry
      pairs[existingIndex] = {
        url: url,
        checks: checkedIndices
      };
    } else {
      console.log("➕ Adding new entry");
      // Add new entry
      pairs.push({
        url: url,
        checks: checkedIndices
      });
    }
    
    await chrome.storage.sync.set({ pairs });
    console.log("✅ Radio button state saved successfully");
    console.log("📊 Final pairs:", pairs);
    
  } catch (error) {
    console.error("💥 Error saving radio button state:", error);
  }
}

/**
 * Find indices of checked radio buttons for each name group
 * @param {string[]} names - Array of radio button names
 * @returns {number[]} Array of checked indices
 */
function findCheckedIndices(names) {
  console.log("🔍 Finding checked indices for names:", names);
  
  const checkedIndices = [];
  
  for (let i = 0; i < names.length; i++) {
    const buttons = document.getElementsByName(names[i]);
    console.log(`📋 Checking group '${names[i]}' with ${buttons.length} buttons`);
    
    let foundChecked = false;
    for (let j = 0; j < buttons.length; j++) {
      if (buttons[j].checked) {
        console.log(`✅ Found checked button at index ${j} for group '${names[i]}'`);
        checkedIndices.push(j);
        foundChecked = true;
        break; // Only one radio button per name group can be checked
      }
    }
    
    if (!foundChecked) {
      console.log(`❌ No checked button found for group '${names[i]}'`);
      checkedIndices.push(-1); // -1 indicates no selection
    }
  }
  
  console.log("📋 Final checked indices:", checkedIndices);
  return checkedIndices;
}

/**
 * Apply checked state to radio buttons
 * @param {string[]} names - Array of radio button names
 * @param {number[]} checkedIndices - Array of indices to check
 */
function applyCheckedState(names, checkedIndices) {
  console.log("🎯 Applying checked state...");
  console.log("📋 Names:", names);
  console.log("📋 Checked indices:", checkedIndices);
  
  if (!checkedIndices || checkedIndices.length !== names.length) {
    console.warn("⚠️ Checked indices don't match radio button names");
    console.log(`Expected ${names.length} indices, got ${checkedIndices ? checkedIndices.length : 0}`);
    return;
  }
  
  let appliedCount = 0;
  
  for (let i = 0; i < names.length; i++) {
    const buttons = document.getElementsByName(names[i]);
    const indexToCheck = checkedIndices[i];
    
    console.log(`🔘 Processing group '${names[i]}' (${buttons.length} buttons)`);
    console.log(`🎯 Index to check: ${indexToCheck}`);
    
    if (indexToCheck >= 0 && buttons[indexToCheck]) {
      buttons[indexToCheck].checked = true;
      console.log(`✅ Checked button at index ${indexToCheck} for group '${names[i]}'`);
      appliedCount++;
    } else if (indexToCheck === -1) {
      console.log(`ℹ️ No selection for group '${names[i]}'`);
    } else {
      console.warn(`⚠️ Invalid index ${indexToCheck} for group '${names[i]}' (max: ${buttons.length - 1})`);
    }
  }
  
  console.log(`✅ Applied ${appliedCount} radio button selections`);
}

// Message listener for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Message received from popup:", request);
  
  if (request.greeting === "save") {
    console.log("💾 Processing save request from popup");
    
    (async () => {
      try {
        const names = getRadioButtonNames();
        
        if (names.length === 0) {
          console.warn("⚠️ No radio buttons found on this page");
          sendResponse({ error: "No radio buttons found on this page" });
          return;
        }
        
        await saveRadioButtonState(names, currentUrl);
        console.log("✅ Save request completed successfully");
        sendResponse({ farewell: "save done" });
        
      } catch (error) {
        console.error("💥 Error processing save request:", error);
        sendResponse({ error: error.message });
      }
    })();
    
    return true; // Keep message channel open for async response
  }
  
  console.log("❓ Unknown message greeting:", request.greeting);
  sendResponse({ error: "Unknown message type" });
});

// Initialize auto-checking functionality
(async () => {
  console.log("🚀 Initializing auto-checking functionality...");
  
  try {
    const names = getRadioButtonNames();
    
    if (names.length === 0) {
      console.log("ℹ️ No radio buttons found on this page");
      return;
    }
    
    // Check stored radio buttons with a delay to ensure page is fully loaded
    const checkWithDelay = async () => {
      await checkStoredRadioButtons(names, currentUrl);
    };
    
    // Check multiple times with intervals to handle dynamic content
    console.log("⏰ Starting periodic checks...");
    const timer = setInterval(checkWithDelay, 100);
    setTimeout(() => {
      clearInterval(timer);
      console.log("⏰ Periodic checks completed");
    }, 2000);
    
    console.log("🎯 [AUTO RADIO BUTTON CHECKER is activated]");
    console.log("📋 Found radio buttons in this page:", names);
    console.log("🌐 Current URL:", currentUrl);
    
  } catch (error) {
    console.error("💥 Error during initialization:", error);
  }
})();





