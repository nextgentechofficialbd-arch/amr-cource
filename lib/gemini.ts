
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a template course description using Gemini.
 * 
 * @param programTitle - The title of the online course.
 * @returns A generated description text in Bengali.
 */
export async function generateProgramDescription(programTitle: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a professional and detailed online course description in Bengali for: "${programTitle}". Highlight the core value proposition, industry relevance, and modules.`,
  });
  return response.text || "";
}

/**
 * Returns a Gemini-powered helpful FAQ response.
 * 
 * @param programTitle - The title of the online course.
 * @param question - The student's question.
 * @returns A helpful answer in Bengali.
 */
export async function generateFAQAnswer(programTitle: string, question: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Course: "${programTitle}"
    Student Question: "${question}"
    Provide a concise and supportive response in Bengali as a course advisor.`,
  });
  return response.text || "";
}
