
import { GoogleGenAI } from "@google/genai";

// Generate course description using Gemini 3 Flash
export const generateCourseDescription = async (programTitle: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `তুমি একজন অভিজ্ঞ কোর্স কপিরাইটার। '${programTitle}' নামক একটি অনলাইন কোর্সের জন্য বাংলা ও ইংরেজি মিশিয়ে একটি আকর্ষণীয় ৩ প্যারাগ্রাফের বিবরণ লেখো। বাংলাদেশের তরুণ শিক্ষার্থীদের উদ্দেশে লেখো। কোর্সটির সুবিধা, শিক্ষার্থী কী শিখবে এবং কেন এই কোর্সটি তাদের জীবন বদলে দেবে তা উল্লেখ করো।`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    // Use .text property directly as per guidelines
    return response.text || "বর্ননা তৈরি করা সম্ভব হয়নি।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating content.";
  }
};

// Get FAQ answer using Gemini 3 Flash
export const getFaqAnswer = async (programTitle: string, question: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `তুমি AmrCourse-এর একজন বন্ধুত্বপূর্ণ কোর্স উপদেষ্টা। '${programTitle}' কোর্স সম্পর্কে একজন শিক্ষার্থী জিজ্ঞেস করেছে: '${question}'. বাংলায় সহজ ও উৎসাহমূলকভাবে ২-৩ বাক্যে উত্তর দাও।`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    // Use .text property directly as per guidelines
    return response.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong with AI assistance.";
  }
};
