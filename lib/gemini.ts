import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL_NAME = "gemini-2.0-flash";

/**
 * Internal helper to handle exponential backoff and retries for Gemini API calls.
 */
async function callWithRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        console.error(`Gemini API failed after ${retries} retries:`, error);
        throw new Error("Gemini API failed after 3 retries");
      }
      const delay = Math.pow(2, attempt - 1) * 1000; // 1000, 2000, 4000
      console.warn(`Gemini API attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Gemini API failed after 3 retries");
}

/**
 * Generates an engaging course description in a mix of Bangla and English using Gemini.
 * 
 * @param programTitle - The title of the online course.
 * @returns A promise that resolves to the generated description text.
 */
export async function generateProgramDescription(programTitle: string): Promise<string> {
  const prompt = `তুমি একজন অভিজ্ঞ কোর্স কপিরাইটার। '${programTitle}' নামক একটি অনলাইন কোর্সের জন্য বাংলা ও ইংরেজি মিশিয়ে একটি আকর্ষণীয় ৩ প্যারাগ্রাফের বিবরণ লেখো। বাংলাদেশের তরুণ শিক্ষার্থীদের উদ্দেশে লেখো। কোর্সটির সুবিধা, শিক্ষার্থী কী শিখবে এবং কেন এই কোর্সটি তাদের জীবন বদলে দেবে তা উল্লেখ করো।`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });
    return response.text || "";
  });
}

/**
 * Generates an encouraging FAQ answer in Bangla for a specific course question.
 * 
 * @param programTitle - The title of the online course.
 * @param question - The student's question.
 * @returns A promise that resolves to the generated answer.
 */
export async function generateFAQAnswer(programTitle: string, question: string): Promise<string> {
  const prompt = `তুমি AmrCourse-এর একজন বন্ধুত্বপূর্ণ কোর্স উপদেষ্টা। '${programTitle}' কোর্স সম্পর্কে একজন শিক্ষার্থী জিজ্ঞেস করেছে: '${question}'. বাংলায় সহজ ও উৎসাহমূলকভাবে ২-৩ বাক্যে উত্তর দাও।`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });
    return response.text || "";
  });
}
