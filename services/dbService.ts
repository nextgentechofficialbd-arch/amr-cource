
import { 
  Program, Video, Student, Enrollment, 
  Payment, VideoProgress, PromoCode, 
  UserRole, PaymentStatus, AdminNotification 
} from '../types';

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
  }
];

class DbService {
  private programs: Program[] = INITIAL_PROGRAMS;
  private videos: Video[] = [];
  private students: Student[] = [
    { id: 'admin-1', email: 'admin@amrcourse.com', full_name: 'Admin User', phone: '0123456789', role: UserRole.ADMIN, created_at: new Date().toISOString() }
  ];
  private enrollments: Enrollment[] = [];
  public payments: Payment[] = []; 
  private videoProgress: VideoProgress[] = [];
  private promoCodes: PromoCode[] = [];
  private notifications: AdminNotification[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.load();
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('amrcourse_db', JSON.stringify({
        programs: this.programs,
        videos: this.videos,
        students: this.students,
        enrollments: this.enrollments,
        payments: this.payments,
        videoProgress: this.videoProgress,
        promoCodes: this.promoCodes,
        notifications: this.notifications
      }));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('amrcourse_db');
      if (data) {
        const parsed = JSON.parse(data);
        this.programs = parsed.programs || INITIAL_PROGRAMS;
        this.videos = parsed.videos || [];
        this.students = parsed.students || this.students;
        this.enrollments = parsed.enrollments || [];
        this.payments = parsed.payments || [];
        this.videoProgress = parsed.videoProgress || [];
        this.promoCodes = parsed.promoCodes || [];
        this.notifications = parsed.notifications || [];
      }
    } catch (e) {
      // It's okay if loading fails during build or on first visit
    }
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('amrcourse_user');
    return user ? JSON.parse(user) as Student : null;
  }

  login(email: string) {
    const student = this.students.find(s => s.email === email);
    if (student && typeof window !== 'undefined') {
      localStorage.setItem('amrcourse_user', JSON.stringify(student));
      return student;
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('amrcourse_user');
    }
  }

  getAllStudents() { return this.students.filter(s => s.role === UserRole.STUDENT); }
  getPrograms() { return this.programs.filter(p => p.is_active); }
  getAllPrograms() { return this.programs; }
  getProgramBySlug(slug: string) { return this.programs.find(p => p.slug === slug); }
  getProgramById(id: string) { return this.programs.find(p => p.id === id); }
  getVideosForProgram(programId: string) { return this.videos.filter(v => v.program_id === programId).sort((a,b) => a.order_index - b.order_index); }
  
  saveVideo(v: Video) { 
    this.videos = [...this.videos.filter(x => x.id !== v.id), v];
    this.save(); 
  }
  
  deleteVideo(id: string) { this.videos = this.videos.filter(v => v.id !== id); this.save(); }
  saveProgram(p: Program) { this.programs.push(p); this.save(); }
  getPromoCodes() { return this.promoCodes; }
  savePromoCode(c: PromoCode) { this.promoCodes.push(c); this.save(); }
  validatePromo(code: string) { return this.promoCodes.find(c => c.code === code.toUpperCase() && c.is_active); }

  submitEnrollment(data: any) {
    const enrollmentId = crypto.randomUUID();
    this.enrollments.push({ 
        id: enrollmentId, 
        student_id: 'temp', 
        program_id: data.programId, 
        status: PaymentStatus.PENDING 
    } as any);
    this.payments.push({ 
        id: crypto.randomUUID(), 
        enrollment_id: enrollmentId, 
        amount: data.amount, 
        bkash_trx_id: data.trxId, 
        status: PaymentStatus.PENDING,
        submitted_at: new Date().toISOString()
    } as any);
    this.save();
    return true;
  }

  getPendingPayments() { return this.payments.filter(p => p.status === PaymentStatus.PENDING); }
  
  approvePayment(id: string) {
    const p = this.payments.find(x => x.id === id);
    if (p) {
        p.status = PaymentStatus.APPROVED;
        p.verified_at = new Date().toISOString();
    }
    this.save();
  }

  getEnrolledPrograms(studentId: string) { 
    return this.programs; 
  }
  
  getProgress(studentId: string, programId: string) { 
    return this.videoProgress.filter(vp => vp.student_id === studentId && vp.program_id === programId); 
  }
  
  markVideoComplete(sId: string, pId: string, vId: string) {
    if (!this.videoProgress.some(vp => vp.student_id === sId && vp.video_id === vId)) {
        this.videoProgress.push({ 
          id: crypto.randomUUID(),
          student_id: sId, 
          video_id: vId, 
          program_id: pId, 
          is_completed: true,
          completed_at: new Date().toISOString()
        });
        this.save();
    }
  }
  
  getAdminNotifications() { return this.notifications; }
  markNotificationsRead() { 
    this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
    this.save(); 
  }
}

export const db = new DbService();
