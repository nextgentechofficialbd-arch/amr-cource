
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  thumbnail_url: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface Video {
  id: string;
  program_id: string;
  title: string;
  drive_embed_url: string;
  order_index: number;
  duration_minutes?: number;
}

export interface Student {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  program_id: string;
  status: PaymentStatus;
  enrolled_at: string;
  approved_at?: string;
  access_token?: string;
  token_used: boolean;
}

export interface Payment {
  id: string;
  enrollment_id: string;
  student_id: string;
  program_id: string;
  amount: number;
  bkash_trx_id: string;
  screenshot_url?: string;
  status: PaymentStatus;
  submitted_at: string;
  admin_notes?: string;
}

export interface VideoProgress {
  id: string;
  student_id: string;
  video_id: string;
  program_id: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
}

export interface AdminNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  is_read: boolean;
}
