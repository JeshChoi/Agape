(async () => {
    const scrapeChatLog = async () => {
        const the_selector = 'div[aria-label="Messages in conversation with Austin Huang"]'
        let conversation_text = document.querySelector(the_selector)?.textContent;
        let response = await chrome.runtime.sendMessage({ chatLog: conversation_text });
        
    };
    scrapeChatLog();
  })();