-- ====================================================================
-- FIXNOW AI - COMPLETE DATABASE SCHEMA (PRD Mục 14 & Bảng 616-665)
-- Dialect: PostgreSQL / Compatible with SQLite & MySQL
-- ====================================================================

-- 1. Bảng users (Tài khoản người dùng: Khách hàng, Thợ, Quản trị viên)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'technician', 'admin')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng user_security_questions (PRD 3.3 & 3.4: 2 câu hỏi bảo mật riêng biệt băm an toàn)
CREATE TABLE IF NOT EXISTS user_security_questions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id INT NOT NULL,
    question_text TEXT NOT NULL,
    answer_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng customer_addresses (Sổ địa chỉ & vị trí GPS khách hàng - PRD 525-526)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(50) DEFAULT 'Nhà riêng',
    full_address TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng technicians (Hồ sơ, chuyên môn, đánh giá & trạng thái nhận việc - PRD 302 & 624)
CREATE TABLE IF NOT EXISTS technicians (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar_url TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    completed_jobs INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    is_online BOOLEAN DEFAULT TRUE,
    current_latitude DECIMAL(10, 7),
    current_longitude DECIMAL(10, 7),
    current_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng service_categories (Danh mục dịch vụ cốt lõi - PRD 5.1 & 5.2)
CREATE TABLE IF NOT EXISTS service_categories (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    badge_text VARCHAR(50),
    base_price_text VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Bảng technician_services (Dịch vụ thợ được phép nhận - PRD 627)
CREATE TABLE IF NOT EXISTS technician_services (
    id SERIAL PRIMARY KEY,
    technician_id VARCHAR(50) NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    skill_level VARCHAR(50) DEFAULT 'Chuyên gia',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng service_price_items (Bảng giá và quy tắc tính giá cố định do hệ thống kiểm soát - PRD 631 & 6.4)
CREATE TABLE IF NOT EXISTS service_price_items (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    labor_price DECIMAL(12, 2) NOT NULL,
    parts_price_min DECIMAL(12, 2) DEFAULT 0,
    parts_price_max DECIMAL(12, 2) DEFAULT 0,
    travel_fee DECIMAL(12, 2) DEFAULT 20000,
    warranty_months INT DEFAULT 6,
    is_active BOOLEAN DEFAULT TRUE
);

-- 8. Bảng repair_requests (Yêu cầu chẩn đoán & đặt dịch vụ của khách hàng - PRD 632)
CREATE TABLE IF NOT EXISTS repair_requests (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL REFERENCES users(id),
    category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id),
    device_info VARCHAR(255) NOT NULL,
    symptoms_text TEXT NOT NULL,
    urgency_level VARCHAR(30) CHECK (urgency_level IN ('khan_cap', 'trong_ngay', 'hen_lich')),
    service_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Bảng ai_diagnoses (Kết quả nhận diện lỗi qua Camera AI & thị giác máy tính - PRD 6.3 & 634)
CREATE TABLE IF NOT EXISTS ai_diagnoses (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50) REFERENCES repair_requests(id) ON DELETE CASCADE,
    image_url TEXT,
    defect_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(30) CHECK (severity IN ('nguy_cap', 'canh_bao', 'trung_binh')),
    confidence_score DECIMAL(5, 2) NOT NULL,
    description TEXT,
    safety_warning TEXT,
    suggested_action TEXT,
    bounding_box_json TEXT, -- {x, y, width, height}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Bảng quotes (Báo giá & phiên bản báo giá khóa bất biến - PRD 6.4 & 636)
CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(50) PRIMARY KEY,
    version INT DEFAULT 1,
    request_id VARCHAR(50) REFERENCES repair_requests(id),
    ai_diagnosis_id VARCHAR(50) REFERENCES ai_diagnoses(id),
    total_price DECIMAL(12, 2) NOT NULL,
    estimated_time_min INT DEFAULT 30,
    warranty_months INT DEFAULT 6,
    is_locked BOOLEAN DEFAULT TRUE, -- Cam kết bất biến không phát sinh
    customer_accepted BOOLEAN DEFAULT FALSE,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Bảng quote_items (Chi tiết từng hạng mục trong báo giá: công thợ, vật tư, phí di chuyển - PRD 638)
CREATE TABLE IF NOT EXISTS quote_items (
    id SERIAL PRIMARY KEY,
    quote_id VARCHAR(50) NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    item_type VARCHAR(20) CHECK (item_type IN ('labor', 'parts', 'travel')),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL
);

-- 12. Bảng orders (Đơn hàng và vòng đời xử lý 11 trạng thái - PRD 4.3 & 640)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL REFERENCES users(id),
    quote_id VARCHAR(50) NOT NULL REFERENCES quotes(id),
    technician_id VARCHAR(50) REFERENCES technicians(id),
    status VARCHAR(30) NOT NULL CHECK (status IN (
        'cho_bao_gia', 'cho_xac_nhan', 'dang_tim_tho', 'tho_da_nhan',
        'tho_dang_den', 'tho_da_den', 'dang_sua', 'cho_nghiem_thu',
        'hoan_thanh', 'da_thanh_toan', 'da_huy'
    )),
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'vietqr', 'visa')),
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'processing', 'paid', 'refunded')),
    warranty_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 13. Bảng order_status_history (Nhật ký chuyển đổi trạng thái đơn - PRD 642)
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Bảng technician_assignments (Quá trình xếp hạng và điều phối thợ gần nhất - PRD 7.2 & 644)
CREATE TABLE IF NOT EXISTS technician_assignments (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    technician_id VARCHAR(50) NOT NULL REFERENCES technicians(id),
    distance_km DECIMAL(6, 2),
    eta_minutes INT,
    ranking_score DECIMAL(5, 2),
    status VARCHAR(20) CHECK (status IN ('offered', 'accepted', 'rejected', 'timeout')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Bảng payments (Giao dịch thanh toán: Tiền mặt, VietQR, Visa - PRD Mục 8 & 646)
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    method VARCHAR(20) NOT NULL CHECK (method IN ('cash', 'vietqr', 'visa')),
    amount DECIMAL(12, 2) NOT NULL,
    transaction_code VARCHAR(100),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Bảng payment_events (Sự kiện thanh toán và đối soát tự động - PRD 648)
CREATE TABLE IF NOT EXISTS payment_events (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(50) NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'webhook_received', 'verified', 'settled'
    payload_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Bảng invoices (Hóa đơn điện tử VAT & chi tiết thanh toán - PRD 650)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    tax_code VARCHAR(50) DEFAULT '0109988776',
    subtotal DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Bảng warranties (Bảo hành điện tử e-Warranty - PRD 654)
CREATE TABLE IF NOT EXISTS warranties (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    warranty_code VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    terms_text TEXT,
    qr_code_data TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed'))
);

-- 19. Bảng reviews (Đánh giá thợ 5 sao và nhận xét từ khách hàng - PRD 538 & 652)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id VARCHAR(50) NOT NULL REFERENCES users(id),
    technician_id VARCHAR(50) NOT NULL REFERENCES technicians(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. Bảng conversations & messages (Tin nhắn thời gian thực giữa khách và thợ - PRD 656-658)
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(50) NOT NULL REFERENCES users(id),
    sender_role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. Bảng support_tickets (Khiếu nại và bảo vệ quyền lợi không phát sinh phí - PRD 662)
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 22. Bảng audit_logs (Nhật ký kiểm tra hệ thống bảo mật & thay đổi giá - PRD 664)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL,
    performed_by VARCHAR(50) REFERENCES users(id),
    entity_name VARCHAR(50),
    entity_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SEED INITIAL DATA FOR FIXNOW AI
-- ====================================================================

-- 1. Users
INSERT INTO users (id, name, email, phone, password_hash, role, avatar_url) VALUES
('usr-customer-01', 'Đặng Minh Khang', 'minhkhang@example.com', '0989 123 456', '$2a$12$e5...hash', 'customer', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
('usr-tech-01', 'Nguyễn Văn Hùng', 'tho.hung@fixnow.ai', '0912 345 678', '$2a$12$e5...hash', 'technician', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'),
('usr-admin-01', 'Quản Trị Viên Hệ Thống', 'admin@fixnow.ai', '0900 888 999', '$2a$12$e5...hash', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80');

-- 2. Security questions (PRD 3.3)
INSERT INTO user_security_questions (user_id, question_id, question_text, answer_hash) VALUES
('usr-customer-01', 1, 'Bạn đã từng học ở trường nào?', 'bachkhoa_hash'),
('usr-customer-01', 2, 'Tên thành phố nơi bạn sinh ra là gì?', 'hanoi_hash');

-- 3. Technicians
INSERT INTO technicians (id, user_id, full_name, phone, avatar_url, rating, review_count, completed_jobs, is_verified, is_online, current_latitude, current_longitude, current_address) VALUES
('tech-01', 'usr-tech-01', 'Nguyễn Văn Hùng', '0912 345 678', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80', 4.95, 312, 428, TRUE, TRUE, 21.0031, 105.8452, '88 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội');

-- 4. Categories
INSERT INTO service_categories (id, title, code, description, icon_name, badge_text, base_price_text) VALUES
('xe_may', 'Sửa Xe Máy', 'MOTO_REPAIR', 'Cứu hộ chết máy, ắc quy, lốp xe, bảo dưỡng tận nơi', 'Bike', 'Cứu hộ 24/7', 'Từ 80.000 ₫'),
('o_to', 'Sửa Ô Tô', 'AUTO_REPAIR', 'Kích bình, thay lốp dự phòng, kiểm tra lỗi động cơ OBD', 'Car', 'Kỹ thuật viên hãng', 'Từ 150.000 ₫'),
('nuoc', 'Nước & Đường Ống', 'PLUMBING', 'Sửa rò rỉ âm tường, vỡ ống PVC, thông tắc cấp tốc', 'Droplets', 'Xử lý cấp tốc', 'Từ 90.000 ₫'),
('dien', 'Điện Dân Dụng', 'ELECTRICAL', 'Xử lý nhảy Aptomat, chập cháy đường dây, thay ổ cắm', 'Zap', 'An toàn 100%', 'Từ 100.000 ₫'),
('dien_lanh', 'Điện Lạnh', 'HVAC', 'Bảo dưỡng điều hòa, nạp gas R32, sửa tủ lạnh, máy giặt', 'Snowflake', 'Bảo hành 6 tháng', 'Từ 120.000 ₫'),
('do_gia_dung', 'Đồ Gia Dụng', 'APPLIANCE', 'Sửa bếp từ, nồi cơm cao tần, máy lọc không khí', 'Wrench', 'Linh kiện zin', 'Từ 80.000 ₫');
