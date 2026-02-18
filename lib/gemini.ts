/**
 * Generates a template course description.
 * (AI integration removed as per request)
 * 
 * @param programTitle - The title of the online course.
 * @returns A placeholder description text.
 */
export async function generateProgramDescription(programTitle: string): Promise<string> {
  return `কোর্স: ${programTitle}\n\nএটি একটি আধুনিক ও পূর্ণাঙ্গ কোর্স যা আপনাকে জিরো থেকে প্রফেশনাল লেভেল পর্যন্ত দক্ষ করে তুলবে। আমাদের এই কোর্সে আপনি বাস্তবধর্মী প্রজেক্টের মাধ্যমে শিখতে পারবেন।\n\nকেন এই কোর্সটি করবেন?\n১. ইন্ডাস্ট্রি স্ট্যান্ডার্ড কারিকুলাম\n২. অভিজ্ঞ মেন্টরদের সহায়তা\n৩. লাইফটাইম এক্সেস ও সাপোর্ট গ্রুপ\n\nআজই ভর্তি হয়ে আপনার ক্যারিয়ারের নতুন যাত্রা শুরু করুন!`;
}

/**
 * Returns a static helpful FAQ response.
 * (AI integration removed as per request)
 * 
 * @param programTitle - The title of the online course.
 * @param question - The student's question.
 * @returns A helpful static answer.
 */
export async function generateFAQAnswer(programTitle: string, question: string): Promise<string> {
  return `ধন্যবাদ আপনার প্রশ্নের জন্য। '${programTitle}' কোর্সটি সম্পর্কে আরও বিস্তারিত জানতে আপনি আমাদের হটলাইন নম্বরে (০১৯০০-০০০০০০) সরাসরি যোগাযোগ করতে পারেন অথবা আমাদের ফেসবুক গ্রুপে জয়েন করতে পারেন। আমাদের মেন্টররা আপনাকে দ্রুত সহায়তা করবেন।`;
}
