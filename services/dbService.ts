
import { 
  Program, Video, Student, Enrollment, 
  Payment, VideoProgress, PromoCode, 
  UserRole, PaymentStatus 
} from '../types';

// Initial Mock Data
const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'p1',
    title: 'Full Stack Web Development',
    slug: 'web-dev',
    short_description: 'আধুনিক ওয়েব টেকনোলজি শিখে হয়ে উঠুন একজন দক্ষ ডেভেলপার।',
    description: 'এই কোর্সে আপনি শিখবেন React, Node.js, এবং MongoDB সহ আধুনিক সব ওয়েব টেকনোলজি। কোর্সটি প্রজেক্ট ভিত্তিক এবং একদম জিরো থেকে শুরু করা হবে।',
    price: 4500,
    thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    title: 'Professional Graphic Design',
    slug: 'graphic-design',
    short_description: 'ডিজাইন সেন্স এবং টুলস শিখে ক্যারিয়ার শুরু করুন ফ্রিল্যান্সিংয়ে।',
    description: 'Photoshop, Illustrator এবং Figma ব্যবহার করে প্রফেশনাল ডিজাইন করার সম্পূর্ণ গাইডলাইন। লোগো ডিজাইন থেকে শুরু করে UI/UX সবকিছুই থাকবে এই কোর্সে।',
    price: 3500,
    thumbnail_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    title: 'Mastering Video Editing',
    slug: 'video-editing',
    short_description: 'Adobe Premiere Pro এবং After Effects দিয়ে ভিডিও এডিটিংয়ের জাদু শিখুন।',
    description: 'একজন প্রফেশনাল এডিটর হিসেবে নিজেকে গড়ে তুলতে যা যা জানা প্রয়োজন তার সবকিছুই পাবেন এখানে। কালার গ্রেডিং থেকে শুরু করে মোশন গ্রাফিক্সের বেসিক।',
    price: 4000,
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    order_index: 3,
    created_at: new Date().toISOString()
  }
];

const INITIAL_VIDEOS: Video[] = [
  { id: 'v1', program_id: 'p1', title: 'Introduction to Web Development', drive_embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order_index: 1 },
  { id: 'v2', program_id: 'p1', title: 'Setting up Environment', drive_embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order_index: 2 },
  { id: 'v3', program_id: 'p1', title: 'HTML & CSS Basics', drive_embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order_index: 3 }
];

class DbService {
  private programs: Program[] = INITIAL_PROGRAMS;
  private videos: Video[] = INITIAL_VIDEOS;
  private students: Student[] = [
    { id: 'admin-1', email: 'admin@amrcourse.com', full_name: 'Admin User', phone: '0123456789', role: UserRole.ADMIN, created_at: new Date().toISOString() }
  ];
  private enrollments: Enrollment[] = [];
  public payments: Payment[] = []; // Made public for stats access
  private videoProgress: VideoProgress[] = [];
  private promoCodes: PromoCode[] = [
    { id: 'pc1', code: 'AMR20', discount_percent: 20, max_uses: 100, used_count: 5, is_active: true }
  ];
  private ipLogs: any[] = [];

  constructor() {
    this.load();
  }

  private save() {
    localStorage.setItem('amrcourse_db', JSON.stringify({
      programs: this.programs,
      videos: this.videos,
      students: this.students,
      enrollments: this.enrollments,
      payments: this.payments,
      videoProgress: this.videoProgress,
      promoCodes: this.promoCodes,
      ipLogs: this.ipLogs
    }));
  }

  private load() {
    const data = localStorage.getItem('amrcourse_db');
    if (data) {
      const parsed = JSON.parse(data);
      this.programs = parsed.programs || INITIAL_PROGRAMS;
      this.videos = parsed.videos || INITIAL_VIDEOS;
      this.students = parsed.students || this.students;
      this.enrollments = parsed.enrollments || [];
      this.payments = parsed.payments || [];
      this.videoProgress = parsed.videoProgress || [];
      this.promoCodes = parsed.promoCodes || this.promoCodes;
      this.ipLogs = parsed.ipLogs || [];
    }
  }

  logIpAction(action: string) {
    const user = this.getCurrentUser();
    this.ipLogs.push({
      id: crypto.randomUUID(),
      student_id: user?.id || null,
      action,
      ip_address: '127.0.0.1 (Simulated)',
      created_at: new Date().toISOString()
    });
    this.save();
  }

  // Auth
  getCurrentUser() {
    const user = localStorage.getItem('amrcourse_user');
    return user ? JSON.parse(user) as Student : null;
  }

  login(email: string) {
    const student = this.students.find(s => s.email === email);
    if (student) {
      localStorage.setItem('amrcourse_user', JSON.stringify(student));
      this.logIpAction(`LOGIN: ${email}`);
      return student;
    }
    return null;
  }

  logout() {
    localStorage.removeItem('amrcourse_user');
    this.logIpAction('LOGOUT');
  }

  // Admin: Student Management
  getAllStudents() {
    return this.students.filter(s => s.role === UserRole.STUDENT);
  }

  getStudentEnrollmentCount(studentId: string) {
    return this.enrollments.filter(e => e.student_id === studentId && e.status === PaymentStatus.APPROVED).length;
  }

  // Programs
  getPrograms() { return this.programs.filter(p => p.is_active); }
  getAllPrograms() { return this.programs; }
  getProgramBySlug(slug: string) { return this.programs.find(p => p.slug === slug); }
  getProgramById(id: string) { return this.programs.find(p => p.id === id); }
  
  saveProgram(program: Program) {
    const idx = this.programs.findIndex(p => p.id === program.id);
    if (idx > -1) this.programs[idx] = program;
    else this.programs.push(program);
    this.save();
  }

  // Promo Codes
  getPromoCodes() { return this.promoCodes; }
  savePromoCode(code: PromoCode) {
    const idx = this.promoCodes.findIndex(c => c.id === code.id);
    if (idx > -1) this.promoCodes[idx] = code;
    else this.promoCodes.push(code);
    this.save();
  }
  togglePromoCode(id: string) {
    const code = this.promoCodes.find(c => c.id === id);
    if (code) {
      code.is_active = !code.is_active;
      this.save();
    }
  }

  // Videos
  getVideosForProgram(programId: string) {
    return this.videos.filter(v => v.program_id === programId).sort((a, b) => a.order_index - b.order_index);
  }
  saveVideo(video: Video) {
    const idx = this.videos.findIndex(v => v.id === video.id);
    if (idx > -1) this.videos[idx] = video;
    else this.videos.push(video);
    this.save();
  }
  deleteVideo(id: string) {
    this.videos = this.videos.filter(v => v.id !== id);
    this.save();
  }

  // Enrollment & Payment
  submitEnrollment(enrollData: { 
    name: string, email: string, phone: string, programId: string, 
    trxId: string, amount: number, screenshotUrl?: string 
  }) {
    let student = this.students.find(s => s.email === enrollData.email);
    if (!student) {
      student = {
        id: crypto.randomUUID(),
        email: enrollData.email,
        full_name: enrollData.name,
        phone: enrollData.phone,
        role: UserRole.STUDENT,
        created_at: new Date().toISOString()
      };
      this.students.push(student);
    }
    const enrollment: Enrollment = {
      id: crypto.randomUUID(),
      student_id: student.id,
      program_id: enrollData.programId,
      status: PaymentStatus.PENDING,
      enrolled_at: new Date().toISOString(),
      token_used: false
    };
    this.enrollments.push(enrollment);
    const payment: Payment = {
      id: crypto.randomUUID(),
      enrollment_id: enrollment.id,
      student_id: student.id,
      program_id: enrollData.programId,
      amount: enrollData.amount,
      bkash_trx_id: enrollData.trxId,
      screenshot_url: enrollData.screenshotUrl || 'https://via.placeholder.com/400x600?text=Manual+TrxID+Proof',
      status: PaymentStatus.PENDING,
      submitted_at: new Date().toISOString()
    };
    this.payments.push(payment);
    this.save();
    return true;
  }

  getPendingPayments() {
    return this.payments.filter(p => p.status === PaymentStatus.PENDING);
  }

  approvePayment(paymentId: string) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = PaymentStatus.APPROVED;
      const enrollment = this.enrollments.find(e => e.id === payment.enrollment_id);
      if (enrollment) {
        enrollment.status = PaymentStatus.APPROVED;
        enrollment.approved_at = new Date().toISOString();
        enrollment.access_token = crypto.randomUUID();
      }
      this.save();
    }
  }

  rejectPayment(paymentId: string) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = PaymentStatus.REJECTED;
      const enrollment = this.enrollments.find(e => e.id === payment.enrollment_id);
      if (enrollment) enrollment.status = PaymentStatus.REJECTED;
      this.save();
    }
  }

  getEnrolledPrograms(studentId: string) {
    const enrolledIds = this.enrollments
      .filter(e => e.student_id === studentId && e.status === PaymentStatus.APPROVED)
      .map(e => e.program_id);
    return this.programs.filter(p => enrolledIds.includes(p.id));
  }

  getProgress(studentId: string, programId: string) {
    return this.videoProgress.filter(vp => vp.student_id === studentId && vp.program_id === programId);
  }

  markVideoComplete(studentId: string, programId: string, videoId: string) {
    const existing = this.videoProgress.find(vp => vp.student_id === studentId && vp.video_id === videoId);
    if (!existing) {
      this.videoProgress.push({
        id: crypto.randomUUID(),
        student_id: studentId,
        program_id: programId,
        video_id: videoId,
        is_completed: true,
        completed_at: new Date().toISOString()
      });
      this.save();
    }
  }

  validatePromo(codeStr: string) {
    const code = this.promoCodes.find(pc => pc.code === codeStr && pc.is_active && pc.used_count < pc.max_uses);
    return code || null;
  }
}

export const db = new DbService();
