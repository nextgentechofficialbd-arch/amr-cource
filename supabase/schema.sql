-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- AmrCourse Database Schema (Supabase PostgreSQL)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable UUID extension for unique identifier generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROGRAMS: Stores course/program details
CREATE TABLE programs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  slug              text NOT NULL UNIQUE,
  description       text,
  short_description text,
  price             integer NOT NULL,
  thumbnail_url     text,
  is_active         boolean DEFAULT true,
  order_index       integer DEFAULT 0,
  created_at        timestamptz DEFAULT now()
);
COMMENT ON TABLE programs IS 'Core course/program metadata for the agency landing page.';

-- 2. VIDEOS: Stores course content links (Google Drive Embeds)
CREATE TABLE videos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id        uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title             text NOT NULL,
  drive_embed_url   text NOT NULL,
  order_index       integer DEFAULT 0,
  duration_minutes  integer,
  created_at        timestamptz DEFAULT now()
);
COMMENT ON TABLE videos IS 'Links to educational content for each program.';

-- 3. STUDENTS: Profiles linked to Supabase Auth users
CREATE TABLE students (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL UNIQUE,
  full_name   text NOT NULL,
  phone       text NOT NULL,
  created_at  timestamptz DEFAULT now()
);
COMMENT ON TABLE students IS 'User profiles extending Supabase Auth.';

-- 4. ENROLLMENTS: Tracks student access to specific programs
CREATE TABLE enrollments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  program_id   uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  status       text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  enrolled_at  timestamptz DEFAULT now(),
  approved_at  timestamptz,
  access_token text UNIQUE,
  token_used   boolean DEFAULT false
);
COMMENT ON TABLE enrollments IS 'Join table for students and programs with access control status.';

-- 5. PAYMENTS: Manual bKash transaction tracking
CREATE TABLE payments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  student_id     uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  program_id     uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  amount         integer NOT NULL,
  bkash_trx_id   text NOT NULL,
  screenshot_url text,
  status         text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at   timestamptz DEFAULT now(),
  verified_at    timestamptz
);
COMMENT ON TABLE payments IS 'Detailed record of manual bKash transaction submissions.';

-- 6. VIDEO_PROGRESS: Tracks which videos a student has completed
CREATE TABLE video_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  video_id     uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  program_id   uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(student_id, video_id)
);
COMMENT ON TABLE video_progress IS 'Per-video completion tracking for the progress bar.';

-- 7. PROMO_CODES: Discount system
CREATE TABLE promo_codes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text NOT NULL UNIQUE,
  discount_percent integer NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
  max_uses         integer NOT NULL,
  used_count       integer DEFAULT 0,
  expires_at       timestamptz,
  is_active        boolean DEFAULT true,
  created_at       timestamptz DEFAULT now()
);
COMMENT ON TABLE promo_codes IS 'Voucher system for marketing and discounts.';

-- 8. IP_LOGS: Security logging for dashboard/video access
CREATE TABLE ip_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid REFERENCES students(id) ON DELETE SET NULL,
  ip_address  text NOT NULL,
  action      text NOT NULL,
  user_agent  text,
  created_at  timestamptz DEFAULT now()
);
COMMENT ON TABLE ip_logs IS 'Audit trail for logins and course accesses.';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Row Level Security (RLS) Policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_logs ENABLE ROW LEVEL SECURITY;

-- Programs: Public viewing for active courses
CREATE POLICY "Public can view active programs" ON programs
  FOR SELECT USING (is_active = true);

-- Videos: Only for students with approved enrollment for the specific program
CREATE POLICY "Enrolled students can view videos" ON videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.program_id = videos.program_id
      AND e.student_id = auth.uid()
      AND e.status = 'approved'
    )
  );

-- Students: Own profile only
CREATE POLICY "Students can view own record" ON students
  FOR SELECT USING (id = auth.uid());

-- Enrollments: View own status
CREATE POLICY "Students can view own enrollments" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Video Progress: Manage own completion state
CREATE POLICY "Students can manage own progress" ON video_progress
  FOR ALL USING (student_id = auth.uid());

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Sample Data
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO programs (title, slug, short_description, description, price, thumbnail_url, is_active, order_index)
VALUES 
('AI কোর্স', 'ai-course', 'কৃত্রিম বুদ্ধিমত্তার জগতে প্রবেশ করুন', 'এই কোর্সে আপনি AI এর মূল বিষয়গুলো শিখবেন। জেনারেটিভ এআই থেকে শুরু করে প্রম্পট ইঞ্জিনিয়ারিং।', 2500, 'https://via.placeholder.com/400x225?text=AI+Course', true, 1),
('ওয়েব ডেভেলপমেন্ট', 'web-dev', 'প্রফেশনাল ওয়েবসাইট তৈরি করুন', 'HTML, CSS, JavaScript থেকে শুরু করে React পর্যন্ত। রিয়েল ওয়ার্ল্ড প্রজেক্ট ভিত্তিক শিক্ষা।', 3000, 'https://via.placeholder.com/400x225?text=Web+Dev', true, 2),
('ভিডিও এডিটিং', 'video-editing', 'প্রফেশনাল ভিডিও এডিট করুন', 'Premiere Pro ও After Effects দিয়ে ভিডিও এডিটিং এর জিরো থেকে হিরো গাইডলাইন।', 2000, 'https://via.placeholder.com/400x225?text=Video+Editing', true, 3),
('Figma ডিজাইন', 'figma-design', 'UI/UX ডিজাইন শিখুন', 'Figma দিয়ে প্রফেশনাল ডিজাইন করুন। মোবাইল অ্যাপ ও ওয়েব ডিজাইন প্রসেস।', 1800, 'https://via.placeholder.com/400x225?text=Figma', true, 4),
('ট্রেডিং', 'trading', 'শেয়ার ও ক্রিপ্টো ট্রেডিং শিখুন', 'স্টক মার্কেট ও ক্রিপ্টোকারেন্সি ট্রেডিং এর সম্পূর্ণ প্র্যাকটিক্যাল গাইড।', 3500, 'https://via.placeholder.com/400x225?text=Trading', true, 5);