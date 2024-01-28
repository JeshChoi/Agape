const asyncHandler = require('express-async-handler');
const OpenAI = require("openai");

//gpt setup
const MODEL_NAME = "gpt-3.5-turbo"; // change this before commmit, i dont have GPT 4 access lol
const MAX_TOKENS = 1024;
const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
});

exports.get_feedback = asyncHandler(async (req,res,next) => {
    if (!req.body.chatLog) {
        console.log(req);
        return res.status(400).send("no chatLog field");
    }
    const instruction = `You are a mental health assistant who will users become better listeners and guides to their loved ones struggling with mental health issues. If the text of the friend indicates a high probability of suicide and self-harm, tell the user to call the suicide hotline and professional help by calling 988. When giving a response to the user, give a concise summary followed by 4 texts for the user to use. Write a response in markdown consistently.`;
    let prompt1 = 'help me find the right words to say, also let me know at the appropriate time possible steps to take to better help my loved one, also make sure that my options are not too long or too verbose. here is our conversation log: ';

    const all_messages = [
        { role: "system", content: instruction },
        { role: "user", content: prompt1 + req.body.chatLog }
    ];
    try {
        const response = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: all_messages,
            temperature: 0.05,
            max_tokens: MAX_TOKENS,
        });

        const response_message = response.choices[0].message["content"];
        const response_object = parseResponseText(response_message)
        console.log(response_object)

        return res.status(200).json({
            gpt_response: response_object
        });

    } catch (error) {
        console.error(error);
        return next(error);
    }
})

function parseResponseText(inputString) {
    // Extract the summary message
    const summaryPattern = /^Summary: ([^.]+\.)/;
    const summaryMatch = summaryPattern.exec(inputString);
    const summary = summaryMatch ? summaryMatch[1] : 'No summary available';
  
    // Extract the response options
    const responsePattern = /\d+\.\s"([^"]+)"/g;
    let match;
    let options = [];
  
    while ((match = responsePattern.exec(inputString)) !== null) {
      options.push(match[1]);
    }
  
    return { message: summary, options: options };
  }

// gpt prompts
const PROMPT = "You are a mental health assistant"
exports.get_mood_score = asyncHandler(async (req,res,next) => {
    if (!req.body.user_input) {
        console.log(req);
        return res.status(400).send("no user_input field");
    }
    const all_messages = [
        { role: "system", content: PROMPT },
        { role: "user", content: req.body.user_input}
    ];

    try {
        const response = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: all_messages,
            temperature: 0.05,
            max_tokens: MAX_TOKENS,
        });

        const response_message = response.choices[0].message["content"];
        
        console.log(response_message)

        return res.status(200).json({
            gpt_response: response_message
        });

    } catch (error) {
        console.error(error);
        return next(error);
    }
})