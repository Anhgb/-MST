export type UserRole = 'customer' | 'technician' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  savedSecurityQuestions?: {
    questionId: number;
    answerHash: string;
  }[];
}

export interface SecurityQuestion {
  id: number;
  question: string;
}

export type OrderStatus =
  | 'cho_bao_gia'
  | 'cho_xac_nhan'
  | 'dang_tim_tho'
  | 'tho_da_nhan'
  | 'tho_dang_den'
  | 'tho_da_den'
  | 'dang_sua'
  | 'cho_nghiem_thu'
  | 'hoan_thanh'
  | 'da_thanh_toan'
  | 'da_huy';

export interface DetectedDefect {
  id: string;
  name: string;
  category: 'xe_may' | 'o_to' | 'dien' | 'nuoc' | 'dien_lanh' | 'do_gia_dung';
  severity: 'nguy_cap' | 'canh_bao' | 'trung_binh';
  confidence: number; // e.g. 94.8%
  description: string;
  safetyWarning?: string;
  suggestedAction: string;
  box: { x: number; y: number; width: number; height: number }; // normalized [0, 100] %
  estimatedCost: {
    labor: number;
    parts: number;
    travel: number;
    partsName: string;
  };
}

export interface QuoteItem {
  name: string;
  type: 'labor' | 'parts' | 'travel';
  price: number;
}

export interface Quote {
  id: string;
  version: number;
  createdAt: string;
  serviceCategory: string;
  symptoms: string;
  detectedDefects: string[];
  confidence: number;
  alternativeCauses: string[];
  safetyWarnings: string[];
  items: QuoteItem[];
  totalPrice: number;
  estimatedTimeMin: number;
  warrantyMonths: number;
  isLocked: boolean; // Immutable rule
  customerAccepted: boolean;
  acceptedAt?: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialty: string[];
  distanceKm: number;
  etaMinutes: number;
  isOnline: boolean;
  isVerified: boolean;
  completedJobs: number;
  location: { lat: number; lng: number; address: string };
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceType: string;
  deviceInfo: string;
  symptoms: string;
  imageProofUrl?: string;
  detectedDefectName?: string;
  status: OrderStatus;
  quote: Quote;
  technician?: Technician;
  paymentMethod?: 'cash' | 'vietqr' | 'visa';
  paymentStatus: 'unpaid' | 'processing' | 'paid' | 'refunded';
  createdAt: string;
  completedAt?: string;
  warrantyCode?: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  badge: string;
  description: string;
  basePrice: string;
  items: string[];
}
