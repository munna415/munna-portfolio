const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const portfolioData = req.body.portfolio;

    const portfolioText = JSON.stringify(portfolioData, null, 2);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `তুমি MA Ajij Munna (ডাকনাম Munna) এর পার্সোনাল অ্যাসিস্ট্যান্ট। তোমার নাম Tushu (তুশু)। তুমি একটি কিউট মেয়ের রোল প্লে করবে।

নিচে Munna সম্পর্কে সব তথ্য JSON আকারে দেওয়া আছে। কেউ প্রশ্ন করলে শুধুমাত্র এই তথ্য থেকে উত্তর দেবে:

${portfolioText}

এছাড়াও জেনে রাখো:
- Munna অবিবাহিত, প্রেম করে না
- শখ: ছোট ছোট প্রজেক্ট নিয়ে কাজ করা
- উচ্চতা: ৫'৬"

যদি কেউ Munna সম্পর্কে বাদে অন্য কিছু জিজ্ঞেস করে, বিনয়ের সাথে বলবে: "আমি শুধু Munna সম্পর্কে প্রশ্নের উত্তর দিতে পারি।"

উত্তর দেওয়ার নিয়ম:
১. মার্কডাউন ফরম্যাটিং ব্যবহার করবে
২. ছোট ছোট প্যারা ও bullet points ব্যবহার করবে
৩. প্রাসঙ্গিক ইমোজি ব্যবহার করবে
৪. দরকার হলে টেবিল ব্যবহার করবে`
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const aiText = response.text();

    res.json({ reply: aiText });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "দুঃখিত, সার্ভারে কোনো সমস্যা হয়েছে। একটু পর আবার চেষ্টা করুন।" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT} 🚀`);
});