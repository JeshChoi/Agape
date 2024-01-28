const asyncHandler = require('express-async-handler');
const OpenAI = require("openai");

//gpt setup
const MODEL_NAME = "gpt-3.5-turbo"; // change this before commmit, i dont have GPT 4 access lol
const MAX_TOKENS = 1024;
const openai = new OpenAI({
    apiKey: "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"
});

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