
import { GoogleGenAI } from "@google/genai";

// Use Gemini 3 Flash to generate compelling course descriptions in Bengali
export const generateCourseDescription = async (programTitle: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed and professional course description in Bengali for an online course titled "${programTitle}". Include course modules, key benefits, and expected learning outcomes to encourage student enrollment.`,
  });
  return response.text || "আপনার কোর্সের জন্য বর্ণনা তৈরি করা সম্ভব হয়নি।";
};

// Use Gemini 3 Flash to provide helpful answers to student questions in Bengali
export const getFaqAnswer = async (programTitle: string, question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a helpful AI learning assistant for the 'AmrCourse' platform. A student is asking a question about the "${programTitle}" course.
    Question: "${question}"
    Provide a polite, professional, and encouraging answer in Bengali.`,
  });
  return response.text || "দুঃখিত, এই মুহূর্তে উত্তর দেওয়া সম্ভব হচ্ছে না। বিস্তারিত জানতে আমাদের সাপোর্ট টিমে যোগাযোগ করুন।";
};
