import { SecurityQuestion, ServiceCategory, DetectedDefect, Technician, Order, User } from '../types';

export const SECURITY_QUESTIONS: SecurityQuestion[] = [
  { id: 1, question: 'Bạn đã từng học ở trường nào?' },
  { id: 2, question: 'Tên thành phố nơi bạn sinh ra là gì?' },
  { id: 3, question: 'Tên người bạn thân thời thơ ấu của bạn là gì?' },
  { id: 4, question: 'Môn học yêu thích của bạn khi còn đi học là gì?' },
  { id: 5, question: 'Biệt danh thời thơ ấu của bạn là gì?' },
  { id: 6, question: 'Tên thú cưng đầu tiên của bạn là gì?' },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'xe_may',
    title: 'Sửa Xe Máy',
    icon: 'Bike',
    badge: 'Cứu hộ 24/7',
    description: 'Chết máy giữa đường, hỏng ắc quy, thủng lốp, đứt xích, bảo dưỡng tại nhà',
    basePrice: 'Từ 80.000 ₫',
    items: ['Không nổ máy', 'Thay ắc quy khô', 'Vá/thay lốp không săm', 'Hỏng phanh', 'Thay dầu & lọc gió']
  },
  {
    id: 'o_to',
    title: 'Sửa Ô Tô',
    icon: 'Car',
    badge: 'Kỹ thuật viên hãng',
    description: 'Kích nổ ắc quy, thay bánh sơ cua, kiểm tra lỗi động cơ OBD-II, nạp gas điều hòa',
    basePrice: 'Từ 150.000 ₫',
    items: ['Báo đèn Check Engine', 'Hết bình ắc quy', 'Thay lốp dự phòng', 'Mất lạnh điều hòa', 'Kêu két phanh']
  },
  {
    id: 'dien',
    title: 'Điện Dân Dụng',
    icon: 'Zap',
    badge: 'An toàn 100%',
    description: 'Xử lý chập điện nhảy CB, mất điện cục bộ, thay ổ cắm công tắc, lắp quạt đèn',
    basePrice: 'Từ 100.000 ₫',
    items: ['Nhảy Aptomat liên tục', 'Cháy khét ổ cắm', 'Mất điện một phòng', 'Lắp bảng điện mới', 'Đèn nhấp nháy']
  },
  {
    id: 'nuoc',
    title: 'Nước & Đường Ống',
    icon: 'Droplets',
    badge: 'Xử lý cấp tốc',
    description: 'Sửa rò rỉ âm tường, thông tắc bồn cầu chậu rửa, thay vòi sen vòi nước, máy bơm',
    basePrice: 'Từ 90.000 ₫',
    items: ['Bục vỡ đường ống nước', 'Rò rỉ chân vòi sen', 'Tắc nghẽn bồn cầu', 'Máy bơm không lên nước', 'Hỏng phao ngắt']
  },
  {
    id: 'dien_lanh',
    title: 'Điện Lạnh',
    icon: 'Snowflake',
    badge: 'Bảo hành 6 tháng',
    description: 'Bảo dưỡng vệ sinh điều hòa, nạp gas R32/R410, sửa tủ lạnh không mát, máy giặt không vắt',
    basePrice: 'Từ 120.000 ₫',
    items: ['Điều hòa chảy nước', 'Tủ lạnh mất mát', 'Máy giặt rung lắc/kêu to', 'Vệ sinh máy lạnh', 'Hết gas làm lạnh']
  },
  {
    id: 'do_gia_dung',
    title: 'Đồ Gia Dụng',
    icon: 'Wrench',
    badge: 'Linh kiện zin',
    description: 'Sửa bếp từ, nồi cơm cao tần, lò vi sóng, máy hút bụi, máy lọc không khí',
    basePrice: 'Từ 80.000 ₫',
    items: ['Bếp từ báo lỗi E0-E9', 'Nồi cơm không nóng', 'Lò vi sóng không quay', 'Máy lọc nước rò nước', 'Quạt kêu cọt kẹt']
  }
];

export const CAMERA_SAMPLE_DEFECTS: DetectedDefect[] = [
  {
    id: 'defect-leak-01',
    name: 'Rò rỉ nứt khớp nối ống nước PVC',
    category: 'nuoc',
    severity: 'nguy_cap',
    confidence: 96.4,
    description: 'Phát hiện vết nứt 2.5cm tại co nối T chữ nhựa PVC dẫn nước áp lực cao, nước đang thẩm thấu mạnh.',
    safetyWarning: 'Cần khóa van cấp nước tổng ngay lập tức để tránh ngấm trần và chập điện âm tường.',
    suggestedAction: 'Cắt bỏ đoạn co nứt, thay thế co nối PVC Tiền Phong D27 chịu áp lực và keo dán chuyên dụng.',
    box: { x: 28, y: 32, width: 44, height: 38 },
    estimatedCost: {
      labor: 110000,
      parts: 45000,
      travel: 20000,
      partsName: 'Co nối chữ T PVC D27 chịu áp + Keo dán chuyên dụng'
    }
  },
  {
    id: 'defect-tire-02',
    name: 'Lốp xe mòn lệch & nứt chân chim trơ lớp bố thép',
    category: 'xe_may',
    severity: 'nguy_cap',
    confidence: 94.8,
    description: 'Rãnh gai lốp dưới 0.8mm, xuất hiện vết rách màng cao su ngoài hông lốp làm lộ sợi bố chịu lực.',
    safetyWarning: 'Rất nguy hiểm khi chạy trên 40km/h hoặc đường mưa ướt, nguy cơ nổ lốp đột ngột.',
    suggestedAction: 'Thay lốp không săm Maxxis / Michelin đúng thông số kỹ thuật 90/90-14.',
    box: { x: 22, y: 20, width: 56, height: 55 },
    estimatedCost: {
      labor: 60000,
      parts: 380000,
      travel: 20000,
      partsName: 'Lốp xe máy Maxxis Tubeless 90/90-14 chính hãng'
    }
  },
  {
    id: 'defect-electrical-03',
    name: 'Dây dẫn quá tải nhiệt cháy lớp vỏ bọc cách điện',
    category: 'dien',
    severity: 'nguy_cap',
    confidence: 98.2,
    description: 'Vỏ nhựa PVC cách điện bị nóng chảy biến tính đen kịt, hai lõi đồng lộ ra tiếp xúc gần nhau.',
    safetyWarning: 'NGUY CƠ HỎA HOẠN VÀ GIẬT ĐIỆN CỰC KỲ CAO! Cúp Aptomat nhánh này ngay!',
    suggestedAction: 'Thay dây Cadivi lõi đồng 2.5mm² đôi bọc 2 lớp, đấu nối lại hộp chia kèm domino cách điện.',
    box: { x: 30, y: 25, width: 40, height: 45 },
    estimatedCost: {
      labor: 120000,
      parts: 75000,
      travel: 20000,
      partsName: 'Dây điện Cadivi CVV 2x2.5mm² + Domino chống cháy chịu nhiệt'
    }
  },
  {
    id: 'defect-brake-04',
    name: 'Mặt đĩa phanh ô tô xước sâu & cháy nhiệt ố tím',
    category: 'o_to',
    severity: 'canh_bao',
    confidence: 92.5,
    description: 'Bề mặt đĩa phanh mòn gờ quá 2mm kèm vệt xước rãnh sâu do má phanh đã mòn hết lớp ma sát.',
    safetyWarning: 'Quãng đường phanh bị kéo dài 30%, có tiếng ken két kim loại cọ sát khi rà phanh.',
    suggestedAction: 'Láng đĩa phanh bằng máy CNC chuyên dụng hoặc thay đĩa phanh mới kèm bộ má phanh Ceramic.',
    box: { x: 18, y: 15, width: 62, height: 65 },
    estimatedCost: {
      labor: 250000,
      parts: 450000,
      travel: 30000,
      partsName: 'Bộ má phanh gốm Ceramic chịu nhiệt + dịch vụ láng phẳng'
    }
  },
  {
    id: 'defect-pcb-05',
    name: 'Tụ lọc nguồn bo mạch điều hòa bị phù rách đỉnh',
    category: 'dien_lanh',
    severity: 'canh_bao',
    confidence: 93.1,
    description: 'Tụ hóa 450V 47uF trên bo dàn nóng bị phồng lưng và xì dung dịch điện phân, gây sụt áp.',
    suggestedAction: 'Vệ sinh bo mạch, thay tụ cao áp Nichicon 450V và kiểm tra diode cầu chỉnh lưu.',
    box: { x: 35, y: 30, width: 32, height: 35 },
    estimatedCost: {
      labor: 150000,
      parts: 95000,
      travel: 25000,
      partsName: 'Tụ hóa chất lượng cao Nichicon 450V + kiểm tra kiểm định bo'
    }
  },
  {
    id: 'defect-battery-06',
    name: 'Cọc bình ắc quy xe sulfat hóa & tụt áp nguồn',
    category: 'xe_may',
    severity: 'trung_binh',
    confidence: 95.7,
    description: 'Cực âm và cực dương phủ lớp muối sunfat trắng xanh dày đặc, điện áp bình sụt dưới 10.5V khi đề xe.',
    suggestedAction: 'Đánh bóng làm sạch đầu cọc, bôi mỡ bảo vệ tiếp xúc đồng thời kích sạc hoặc thay bình GS 12V-5Ah.',
    box: { x: 25, y: 22, width: 50, height: 48 },
    estimatedCost: {
      labor: 50000,
      parts: 290000,
      travel: 20000,
      partsName: 'Ắc quy khô miễn bảo dưỡng GS GTZ5S 12V-3.5Ah chính hãng'
    }
  },
  {
    id: 'defect-bumper-07',
    name: 'Vỡ cản trước (Ba-đờ-sốc) & biến dạng đầu xe sau va chạm',
    category: 'o_to',
    severity: 'nguy_cap',
    confidence: 97.2,
    description: 'Cản trước ô tô bị nứt vỡ lớn, biến dạng mặt ca-lăng, rơi biển số và hở ngàm ốp đầu xe sau va chạm. Cần kiểm tra két làm mát và cụm đèn pha.',
    safetyWarning: 'CẢNH BÁO AN TOÀN: Tránh di chuyển tốc độ cao vì mảng vỡ có thể cọ lốp hoặc két nước bị rò rỉ dẫn đến quá nhiệt động cơ.',
    suggestedAction: 'Tháo cản trước kiểm tra két nước tản nhiệt, nắn chỉnh ngàm đỡ và thay thế cụm cản trước (ba-đờ-sốc) mới đồng màu sơn.',
    box: { x: 20, y: 22, width: 60, height: 56 },
    estimatedCost: {
      labor: 280000,
      parts: 950000,
      travel: 30000,
      partsName: 'Cụm cản trước ô tô chính hãng + bộ ngàm định vị'
    }
  },
  {
    id: 'defect-inspect-08',
    name: 'Sự cố kỹ thuật cần thợ thẩm định trực tiếp (PRD 6.5)',
    category: 'o_to',
    severity: 'canh_bao',
    confidence: 82.5,
    description: 'Hệ thống AI nhận diện tổn hại có độ phức tạp cao hoặc chưa đủ góc nhìn để chẩn đoán 100%. Đề xuất cử thợ chuyên sâu đến kiểm tra đo kiểm trực tiếp.',
    safetyWarning: 'Khuyến cáo không tự ý tháo dỡ các chi tiết chịu lực khi chưa có thợ chuyên nghiệp.',
    suggestedAction: 'Kỹ thuật viên sẽ mang dụng cụ chuyên dụng đến tận nơi kiểm tra và báo giá cố định minh bạch trước khi làm.',
    box: { x: 15, y: 15, width: 70, height: 70 },
    estimatedCost: {
      labor: 50000,
      parts: 0,
      travel: 20000,
      partsName: 'Phí thẩm định & kiểm tra trực tiếp (Được trừ 100% nếu sửa chữa)'
    }
  }
];

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: 'tech-01',
    name: 'Nguyễn Văn Hùng',
    phone: '0912 345 678',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewCount: 312,
    specialty: ['Sửa Xe Máy', 'Cứu Hộ Ô Tô', 'Ắc Quy & Điện Xe'],
    distanceKm: 0.8,
    etaMinutes: 12,
    isOnline: true,
    isVerified: true,
    completedJobs: 428,
    location: { lat: 21.0031, lng: 105.8452, address: '88 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội' }
  },
  {
    id: 'tech-02',
    name: 'Trần Đình Tuấn',
    phone: '0988 765 432',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    reviewCount: 198,
    specialty: ['Điện Nước Dân Dụng', 'Thông Tắc Ống', 'Điện Lạnh'],
    distanceKm: 1.4,
    etaMinutes: 18,
    isOnline: true,
    isVerified: true,
    completedJobs: 265,
    location: { lat: 21.0075, lng: 105.8421, address: '124 Đại La, Hai Bà Trưng, Hà Nội' }
  },
  {
    id: 'tech-03',
    name: 'Phạm Minh Đức',
    phone: '0904 112 233',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewCount: 420,
    specialty: ['Điện Lạnh', 'Điều Hòa Inverter', 'Máy Giặt', 'Tủ Lạnh'],
    distanceKm: 2.1,
    etaMinutes: 24,
    isOnline: true,
    isVerified: true,
    completedJobs: 512,
    location: { lat: 21.0112, lng: 105.8524, address: '45 Phố Huế, Hoàn Kiếm, Hà Nội' }
  },
  {
    id: 'tech-04',
    name: 'Lê Hoàng Nam',
    phone: '0977 445 566',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.85,
    reviewCount: 145,
    specialty: ['Đồ Gia Dụng', 'Bếp Từ', 'Nồi Cơm Cao Tần', 'Điện Dân Dụng'],
    distanceKm: 2.7,
    etaMinutes: 29,
    isOnline: true,
    isVerified: true,
    completedJobs: 180,
    location: { lat: 20.9984, lng: 105.8398, address: '15 Giải Phóng, Đống Đa, Hà Nội' }
  }
];

export const INITIAL_USER: User = {
  id: 'usr-customer-01',
  name: 'Đặng Minh Khang',
  email: 'minhkhang@example.com',
  phone: '0989 123 456',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  address: 'Số 72 Trần Đại Nghĩa, Phường Bách Khoa, Hai Bà Trưng, Hà Nội',
  savedSecurityQuestions: [
    { questionId: 1, answerHash: 'bachkhoa' },
    { questionId: 2, answerHash: 'hanoi' }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-20261014-089',
    customerId: 'usr-customer-01',
    customerName: 'Đặng Minh Khang',
    customerPhone: '0989 123 456',
    customerAddress: 'Số 72 Trần Đại Nghĩa, Phường Bách Khoa, Hai Bà Trưng, Hà Nội',
    serviceType: 'Sửa Xe Máy',
    deviceInfo: 'Honda AirBlade 125cc (2021)',
    symptoms: 'Đề xe không lên, còi kêu yếu ớt, camera AI phát hiện cọc bình bị oxi hóa sulfat muối',
    detectedDefectName: 'Cọc bình ắc quy xe sulfat hóa & tụt áp nguồn',
    status: 'hoan_thanh',
    createdAt: '2026-10-14 14:30',
    completedAt: '2026-10-14 15:25',
    warrantyCode: 'BH-2026-AB125-992',
    technician: MOCK_TECHNICIANS[0],
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    quote: {
      id: 'QT-99201',
      version: 1,
      createdAt: '2026-10-14 14:32',
      serviceCategory: 'Sửa Xe Máy',
      symptoms: 'Đề xe không lên, còi kêu yếu',
      detectedDefects: ['Ắc quy tụt áp', 'Cọc bình oxi hóa nặng'],
      confidence: 95.7,
      alternativeCauses: ['Hỏng rơ le đề', 'Lỏng cọc dây mass'],
      safetyWarnings: ['Không cố đề liên tục gây cháy củ đề'],
      items: [
        { name: 'Công kiểm tra hệ thống sạc & làm sạch tiếp điểm', type: 'labor', price: 50000 },
        { name: 'Ắc quy khô miễn bảo dưỡng GS GTZ5S 12V-3.5Ah', type: 'parts', price: 290000 },
        { name: 'Phí di chuyển tận nơi (dưới 3km)', type: 'travel', price: 20000 }
      ],
      totalPrice: 360000,
      estimatedTimeMin: 25,
      warrantyMonths: 6,
      isLocked: true,
      customerAccepted: true,
      acceptedAt: '2026-10-14 14:33'
    },
    review: {
      rating: 5,
      comment: 'Thợ anh Hùng đến rất nhanh sau 10 phút, đúng chuẩn giá cố định không xin thêm đồng nào. Quét camera phát hiện lỗi cực chuẩn!',
      createdAt: '2026-10-14 15:35'
    }
  }
];
