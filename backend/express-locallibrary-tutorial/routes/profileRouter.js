const express = require('express');
const { db } = require('../server/db');

const profileRouter = express.Router();
const apiKey = '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';
const OpenAI = require('openai');

const openai = new OpenAI({apiKey: apiKey});
const aiModel = "gpt-3.5-turbo";


// value Router is previous routes from yctc lol dont use them but you can change them to profileRouter and then edit the functions.
// I think we need a get id, a post, and a put
// very basic would be to get the name from a person and display it on a page (GET)
// to update the name of a person based on their id (PUT)
// and to create a new person with a new name and id (POST)

// GET all items
profileRouter.get('/', async (req, res) => {
  try {
    const allItems = await db.query(`SELECT * FROM profiles;`);
    res.status(200).send(allItems);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET all values by item id
profileRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.query('SELECT * FROM users WHERE id=$(id)', {
      id,
    });

    res.status(200).send(item);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.get('/chat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const item = await db.query('SELECT chat FROM profiles WHERE id=$(id)', {
      id,
    });
    console.log(item);

    res.status(200).send(item);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.query('SELECT id, name, mood, last_checked FROM profiles WHERE id=$(id)', {
      id,
    });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.query('SELECT * FROM profiles WHERE id=$(id)', {
      id,
    });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.put('/newchat/:id', async (req, res) => {
  try {
    console.log(1);
    const { id, chat } = req.params;
    await db.query('UPDATE profiles SET chat=$(chat) WHERE id=$(id)', {
      chat,
      id,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CHAT GPT

profileRouter.post('/openai/mood/:id', async (req, res, next) => {
  if (!req.body.user_prompt) {
    //console.log(req);
    return res.status(400).send("Invalid user prompt");
  }

  const all_messages = [
    { role: "system", content: "tell the user what they want" },
    { role: "user", content: req.body.user_prompt } // Fix here
  ];

  try {
    const response = await openai.chat.completions.create({
      model: aiModel, // Assuming aiModel is defined
      messages: all_messages,
      temperature: 0.05,
      max_tokens: 2000, // Assuming MAX_TOKENS is defined
    });

    return res.status(200).json({
      gpt_response: response
    });
  } catch (error) {
    // console.error(error);
    return next(error);
  }
});
module.exports = profileRouter;
