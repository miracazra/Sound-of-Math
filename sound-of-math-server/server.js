const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/ask-ai', async (req, res) => {
  const userQuestion = req.body.question;
  console.log("Received question:", userQuestion); // ✅ DEBUG

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',

      messages: [
        { role: 'system', content: 'You are a helpful tutor who explains math formulas in simple words.' },
        { role: 'user', content: userQuestion },
      ],
    });

    console.log("OpenAI reply:", completion.choices[0].message.content); // ✅ DEBUG

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({ error: 'Something went wrong with OpenAI.' });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
