(function() {
    const scrapeChatLog = async () => {
        const the_selector = 'div[aria-label="Messages in conversation with Austin Huang"]'
        let conversation_text = await document.querySelector(the_selector)?.textContent;
        alert(conversation_text)
        //chrome.runtime.sendMessage({ chatLog: conversation_text });
    };
    scrapeChatLog();
  })();