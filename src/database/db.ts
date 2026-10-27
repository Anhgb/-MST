// In-App Database Engine for FixNow AI (PRD Section 14)
// Implements 22 tables with relations, persistence, and interactive query capability

export interface DatabaseState {
  users: any[];
  user_security_questions: any[];
  customer_addresses: any[];
  technicians: any[];
  technician_services: any[];
  service_categories: any[];
  service_price_items: any[];
  repair_requests: any[];
  ai_diagnoses: any[];
  quotes: any[];
  quote_items: any[];
  orders: any[];
  order_status_history: any[];
  technician_assignments: any[];
  payments: any[];
  payment_events: any[];
  invoices: any[];
  warranties: any[];
  reviews: any[];
  conversations: any[];
  messages: any[];
  support_tickets: any[];
  audit_logs: any[];
}

const STORAGE_KEY = 'fixnow_ai_db_v1';

export const INITIAL_DATABASE: DatabaseState = {
  users: [
    { id: 'usr-customer-01', name: 'Đặng Minh Khang', email: 'minhkhang@example.com', phone: '0989 123 456', role: 'customer', address: '72 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội', created_at: '2026-10-14 08:00' },
    { id: 'usr-tech-01', name: 'Nguyễn Văn Hùng', email: 'tho.hung@fixnow.ai', phone: '0912 345 678', role: 'technician', address: '88 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội', created_at: '2026-10-14 08:00' },
    { id: 'usr-admin-01', name: 'Quản Trị Viên Hệ Thống', email: 'admin@fixnow.ai', phone: '0900 888 999', role: 'admin', address: 'Tòa nhà FixNow AI, Cầu Giấy, Hà Nội', created_at: '2026-10-14 08:00' }
  ],
  user_security_questions: [
    { id: 1, user_id: 'usr-customer-01', question_id: 1, question_text: 'Bạn đã từng học ở trường nào?', answer_hash: 'bachkhoa' },
    { id: 2, user_id: 'usr-customer-01', question_id: 2, question_text: 'Tên thành phố nơi bạn sinh ra là gì?', answer_hash: 'hanoi' }
  ],
  customer_addresses: [
    { id: 1, user_id: 'usr-customer-01', title: 'Nhà riêng', full_address: 'Số 72 Trần Đại Nghĩa, Phường Bách Khoa, Hai Bà Trưng, Hà Nội', lat: 21.0045, lng: 105.8443, is_default: true }
  ],
  technicians: [
    { id: 'tech-01', user_id: 'usr-tech-01', full_name: 'Nguyễn Văn Hùng', phone: '0912 345 678', rating: 4.95, review_count: 312, completed_jobs: 428, is_verified: true, is_online: true, lat: 21.0031, lng: 105.8452, address: '88 Lê Thanh Nghị' },
    { id: 'tech-02', user_id: 'usr-tech-02', full_name: 'Trần Đình Tuấn', phone: '0988 765 432', rating: 4.88, review_count: 198, completed_jobs: 265, is_verified: true, is_online: true, lat: 21.0075, lng: 105.8421, address: '124 Đại La' },
    { id: 'tech-03', user_id: 'usr-tech-03', full_name: 'Phạm Minh Đức', phone: '0904 112 233', rating: 4.92, review_count: 420, completed_jobs: 512, is_verified: true, is_online: true, lat: 21.0112, lng: 105.8524, address: '45 Phố Huế' }
  ],
  technician_services: [
    { id: 1, technician_id: 'tech-01', category_id: 'xe_may', skill_level: 'Chuyên gia bậc 4/4' },
    { id: 2, technician_id: 'tech-01', category_id: 'o_to', skill_level: 'Kỹ thuật viên cứu hộ' },
    { id: 3, technician_id: 'tech-02', category_id: 'nuoc', skill_level: 'Thợ điện nước chính' }
  ],
  service_categories: [
    { id: 'xe_may', title: 'Sửa Xe Máy', code: 'MOTO_REPAIR', base_price: 80000 },
    { id: 'o_to', title: 'Sửa Ô Tô', code: 'AUTO_REPAIR', base_price: 150000 },
    { id: 'dien', title: 'Điện Dân Dụng', code: 'ELECTRICAL', base_price: 100000 },
    { id: 'nuoc', title: 'Nước & Đường Ống', code: 'PLUMBING', base_price: 90000 },
    { id: 'dien_lanh', title: 'Điện Lạnh', code: 'HVAC', base_price: 120000 },
    { id: 'do_gia_dung', title: 'Đồ Gia Dụng', code: 'APPLIANCE', base_price: 80000 }
  ],
  service_price_items: [
    { id: 'PI-01', category_id: 'xe_may', name: 'Công kiểm tra hệ thống sạc & làm sạch tiếp điểm', labor: 50000, parts_min: 0, parts_max: 290000, travel: 20000 },
    { id: 'PI-02', category_id: 'xe_may', name: 'Thay lốp không săm Tubeless tận nơi', labor: 60000, parts_min: 320000, parts_max: 450000, travel: 20000 },
    { id: 'PI-03', category_id: 'nuoc', name: 'Xử lý rò rỉ nứt vỡ co ống PVC D27', labor: 110000, parts_min: 35000, parts_max: 80000, travel: 20000 },
    { id: 'PI-04', category_id: 'dien', name: 'Khắc phục chập cháy Aptomat/dây dẫn', labor: 120000, parts_min: 50000, parts_max: 120000, travel: 20000 }
  ],
  repair_requests: [
    { id: 'REQ-01', customer_id: 'usr-customer-01', category_id: 'xe_may', device_info: 'Honda AirBlade 125cc (2021)', symptoms_text: 'Đề xe không lên, còi kêu yếu ớt, camera AI phát hiện cọc bình bị oxi hóa sulfat muối', urgency_level: 'khan_cap', service_address: '72 Trần Đại Nghĩa', created_at: '2026-10-14 14:30' }
  ],
  ai_diagnoses: [
    {
      id: 'AI-DIAG-01',
      request_id: 'REQ-01',
      defect_name: 'Cọc bình ắc quy xe sulfat hóa & tụt áp nguồn',
      category: 'xe_may',
      severity: 'trung_binh',
      confidence_score: 95.7,
      description: 'Cực âm và cực dương phủ lớp muối sunfat trắng xanh dày đặc, điện áp bình sụt dưới 10.5V khi đề xe.',
      safety_warning: 'Không cố đề liên tục gây cháy củ đề',
      bounding_box_json: '{"x":25,"y":22,"width":50,"height":48}',
      created_at: '2026-10-14 14:31'
    }
  ],
  quotes: [
    {
      id: 'QT-99201',
      version: 1,
      request_id: 'REQ-01',
      ai_diagnosis_id: 'AI-DIAG-01',
      total_price: 360000,
      estimated_time_min: 25,
      warranty_months: 6,
      is_locked: true,
      customer_accepted: true,
      accepted_at: '2026-10-14 14:33',
      created_at: '2026-10-14 14:32'
    }
  ],
  quote_items: [
    { id: 1, quote_id: 'QT-99201', item_type: 'labor', name: 'Công kiểm tra hệ thống sạc & làm sạch tiếp điểm', price: 50000 },
    { id: 2, quote_id: 'QT-99201', item_type: 'parts', name: 'Ắc quy khô miễn bảo dưỡng GS GTZ5S 12V-3.5Ah', price: 290000 },
    { id: 3, quote_id: 'QT-99201', item_type: 'travel', name: 'Phí di chuyển tận nơi (dưới 3km)', price: 20000 }
  ],
  orders: [
    {
      id: 'ORD-20261014-089',
      customer_id: 'usr-customer-01',
      quote_id: 'QT-99201',
      technician_id: 'tech-01',
      status: 'da_thanh_toan',
      total_amount: 360000,
      payment_method: 'vietqr',
      payment_status: 'paid',
      warranty_code: 'BH-2026-AB125-992',
      created_at: '2026-10-14 14:30',
      completed_at: '2026-10-14 15:25'
    }
  ],
  order_status_history: [
    { id: 1, order_id: 'ORD-20261014-089', from_status: 'cho_bao_gia', to_status: 'cho_xac_nhan', changed_by: 'system', created_at: '2026-10-14 14:32' },
    { id: 2, order_id: 'ORD-20261014-089', from_status: 'cho_xac_nhan', to_status: 'dang_tim_tho', changed_by: 'customer', created_at: '2026-10-14 14:33' },
    { id: 3, order_id: 'ORD-20261014-089', from_status: 'dang_tim_tho', to_status: 'tho_da_nhan', changed_by: 'tech-01', created_at: '2026-10-14 14:34' },
    { id: 4, order_id: 'ORD-20261014-089', from_status: 'dang_sua', to_status: 'hoan_thanh', changed_by: 'tech-01', created_at: '2026-10-14 15:15' },
    { id: 5, order_id: 'ORD-20261014-089', from_status: 'hoan_thanh', to_status: 'da_thanh_toan', changed_by: 'payment_gateway', created_at: '2026-10-14 15:25' }
  ],
  technician_assignments: [
    { id: 1, order_id: 'ORD-20261014-089', technician_id: 'tech-01', distance_km: 0.8, eta_minutes: 12, ranking_score: 98.5, status: 'accepted', created_at: '2026-10-14 14:33' }
  ],
  payments: [
    { id: 'PAY-99881', order_id: 'ORD-20261014-089', method: 'vietqr', amount: 360000, transaction_code: 'VCB-FT20261014988', status: 'completed', paid_at: '2026-10-14 15:25' }
  ],
  payment_events: [
    { id: 1, payment_id: 'PAY-99881', event_type: 'webhook_received', payload_json: '{"bank":"VCB","amount":360000,"memo":"FIXNOW 014089","verified":true}', created_at: '2026-10-14 15:25' }
  ],
  invoices: [
    { id: 'INV-2026-089', order_id: 'ORD-20261014-089', invoice_number: 'HD-FN-00892', tax_code: '0109988776', subtotal: 360000, discount: 0, total: 360000, issued_at: '2026-10-14 15:26' }
  ],
  warranties: [
    { id: 'WAR-992', order_id: 'ORD-20261014-089', warranty_code: 'BH-2026-AB125-992', start_date: '2026-10-14', end_date: '2027-04-14', terms_text: 'Bảo hành tận nơi 1-1 cho bình ắc quy GS 6 tháng', status: 'active' }
  ],
  reviews: [
    { id: 1, order_id: 'ORD-20261014-089', customer_id: 'usr-customer-01', technician_id: 'tech-01', rating: 5, comment: 'Thợ anh Hùng đến rất nhanh sau 10 phút, đúng chuẩn giá cố định không xin thêm đồng nào. Quét camera phát hiện lỗi cực chuẩn!', created_at: '2026-10-14 15:35' }
  ],
  conversations: [
    { id: 'CONV-01', order_id: 'ORD-20261014-089', created_at: '2026-10-14 14:34' }
  ],
  messages: [
    { id: 1, conversation_id: 'CONV-01', sender_id: 'usr-tech-01', sender_role: 'technician', content: 'Chào bạn, tôi đang di chuyển qua số 72 Trần Đại Nghĩa nhé!', created_at: '2026-10-14 14:35' },
    { id: 2, conversation_id: 'CONV-01', sender_id: 'usr-customer-01', sender_role: 'customer', content: 'Dạ vâng anh tới alo em ra mở cửa ạ.', created_at: '2026-10-14 14:36' }
  ],
  support_tickets: [
    { id: 'TKT-001', order_id: 'ORD-20261014-089', user_id: 'usr-customer-01', subject: 'Xác thực bảo hành điện tử', description: 'Kiểm tra kích hoạt bảo hành bình ắc quy 6 tháng.', status: 'resolved', created_at: '2026-10-14 15:40' }
  ],
  audit_logs: [
    { id: 1, action_type: 'QUOTE_LOCKED', performed_by: 'usr-customer-01', entity_name: 'quotes', entity_id: 'QT-99201', details: 'Khóa giá bất biến 360.000 ₫ - không cho phép sửa đổi', created_at: '2026-10-14 14:33' }
  ]
};

class FixNowDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Lỗi load DB từ localStorage, khởi tạo seed ban đầu:', e);
    }
    return INITIAL_DATABASE;
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Không thể lưu state vào localStorage:', e);
    }
  }

  public getTableNames(): (keyof DatabaseState)[] {
    return Object.keys(this.state) as (keyof DatabaseState)[];
  }

  public getTableData(table: keyof DatabaseState): any[] {
    return this.state[table] || [];
  }

  public insertRecord(table: keyof DatabaseState, record: any) {
    if (!this.state[table]) {
      this.state[table] = [];
    }
    this.state[table].unshift(record);
    this.saveState();
  }

  public updateRecord(table: keyof DatabaseState, idField: string, idValue: any, updates: any) {
    if (this.state[table]) {
      this.state[table] = this.state[table].map(item => {
        if (item[idField] === idValue) {
          return { ...item, ...updates };
        }
        return item;
      });
      this.saveState();
    }
  }

  public resetToSeed() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.saveState();
  }

  public executeSQLQuery(sql: string): any[] {
    const clean = sql.trim().toLowerCase();
    for (const tableName of this.getTableNames()) {
      if (clean.includes(`from ${tableName}`)) {
        let results = [...this.getTableData(tableName)];
        if (clean.includes('where')) {
          // simple filter
          const parts = clean.split('where')[1]?.trim();
          if (parts && parts.includes('=')) {
            const [col, val] = parts.split('=').map(s => s.trim().replace(/['";]/g, ''));
            results = results.filter(row => String(row[col]).toLowerCase() === val.toLowerCase());
          }
        }
        return results;
      }
    }
    return this.getTableData('orders');
  }

  public exportJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }
}

export const dbInstance = new FixNowDatabase();
