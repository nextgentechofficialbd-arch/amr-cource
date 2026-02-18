// Static course description generator (Replaces Gemini AI)
export const generateCourseDescription = async (programTitle: string): Promise<string> => {
  return `আপনার '${programTitle}' কোর্সটির জন্য একটি চমৎকার বর্ণনা এখানে লিখুন। আপনি চাইলে এখানে কোর্সের মডিউল, সুবিধা এবং লার্নিং আউটকাম সম্পর্কে বিস্তারিত বলতে পারেন। এটি একটি স্ট্যাটিক টেম্পলেট।`;
};

// Static FAQ assistant (Replaces Gemini AI)
export const getFaqAnswer = async (programTitle: string, question: string): Promise<string> => {
  return `আপনার '${question}' প্রশ্নটির জন্য ধন্যবাদ। এই মুহূর্তে আমাদের AI অ্যাসিস্ট্যান্ট অপশনটি বন্ধ রয়েছে। তবে '${programTitle}' সম্পর্কে যেকোনো তথ্যের জন্য আমাদের সাপোর্ট টীমের সাথে যোগাযোগ করুন।`;
};
