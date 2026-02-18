import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a dark-themed HTML email to the student with their course access link.
 * 
 * @param params - Recipient details, course title, and unique access URL.
 */
export async function sendAccessEmail({
  studentEmail,
  studentName,
  programTitle,
  accessLink,
}: {
  studentEmail: string;
  studentName: string;
  programTitle: string;
  accessLink: string;
}): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600&display=swap');
        body {
          margin: 0;
          padding: 0;
          background-color: #0F172A;
          color: #FFFFFF;
          font-family: 'Hind Siliguri', Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #1E293B;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .header {
          padding: 30px;
          text-align: center;
          border-bottom: 1px solid #334155;
        }
        .logo {
          color: #2563EB;
          font-size: 28px;
          font-weight: bold;
          text-decoration: none;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #2563EB;
          color: #FFFFFF !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          display: inline-block;
        }
        .note {
          color: #94A3B8;
          font-size: 14px;
          margin-top: 20px;
          border-top: 1px solid #334155;
          padding-top: 20px;
        }
        .warning {
          color: #64748B;
          font-size: 12px;
          margin-top: 10px;
        }
        .footer {
          padding: 20px;
          text-align: center;
          background-color: #0F172A;
          color: #64748B;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="https://amrcourse.com" class="logo">AmrCourse</a>
        </div>
        <div class="content">
          <div class="greeting">প্রিয় ${studentName},</div>
          <p>অভিনন্দন! আপনার '${programTitle}' কোর্সের পেমেন্ট সফলভাবে যাচাই হয়েছে।</p>
          <div class="button-container">
            <a href="${accessLink}" class="button">কোর্সে প্রবেশ করুন</a>
          </div>
          <div class="note">
            এই লিঙ্কটি একবারই ব্যবহার করা যাবে। লিঙ্কে ক্লিক করার পর আপনার পাসওয়ার্ড সেট করুন।
          </div>
          <p class="warning">যদি আপনি এই ইমেইলের জন্য আবেদন না করে থাকেন, অনুগ্রহ করে উপেক্ষা করুন।</p>
        </div>
        <div class="footer">
          © 2026 AmrCourse | Bangladesh
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: `AmrCourse <${process.env.FROM_EMAIL}>`,
      to: studentEmail,
      subject: "AmrCourse - আপনার কোর্সের অ্যাক্সেস লিঙ্ক পাঠানো হয়েছে 🎉",
      html,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Resend Email Error:", error);
    throw new Error("Failed to send access email.");
  }
}
