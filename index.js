import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express(); 

// إعدادات الـ CORS
const corsOptions = {
  origin: "http://localhost:5173", // استبدل هذا برابط موقعك (الفرونت أند)
  methods: ["POST", "GET"], // السماح بالعمليات التي تحتاجها فقط
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app; 
