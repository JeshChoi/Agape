chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // Handle the message
    const chatLog = message.chatLog
    const response = (await callGPT(message.chatLog))["gpt_response"];

    console.log(response)
    chrome.runtime.sendMessage({ chatGPTResponse: JSON.stringify(response) });

    // // Send a response if necessary
    // sendResponse({ response: response });

    // // Return true to indicate you wish to send a response asynchronously
    // return true;
});
/*
expected response structure:
{
  message: 'Your loved one, Austin, reached out to you expressing sadness but unsent the message.',
  options: [
    "Hey Austin, I noticed you sent a message earlier but unsent it. I just want you to know that I'm here for you and ready to listen whenever you're ready to talk.",
    "Austin, I can sense that something is bothering you. Remember that you don't have to face it alone. I'm here to support you through whatever you're going through.",
    "I'm sorry to hear that you're feeling sad, Austin. If you're comfortable sharing, I'm here to listen and offer any help or advice I can.",
    "Austin, it's okay to not be okay sometimes. If you need someone to talk to or if there's anything specific you'd like support with, please don't hesitate to reach out. I care about you."
  ]
}
*/


async function callGPT(chatLog) {
    const apiUrl = 'http://localhost:5050/api/gpt/get_feedback';
    const requestBody = { chatLog: chatLog };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // or process data as needed
    } catch (error) {
        console.error('Error calling the API:', error);
        return null;
    }
}

