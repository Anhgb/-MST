import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Wrench, DollarSign, Clock, HelpCircle } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';

export const PricingView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Commitment Banner from PRD 6.4 */}
      <div style={{
        background: 'linear-gradient(135deg, #102a43, #1e3a8a)',
        color: '#ffffff',
        padding: '32px',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(16, 42, 67, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-green" style={{ fontSize: '11px' }}>
            PRD MỤC 6.4
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900 }}>
            Nguyên Tắc Bất Biến: 100% Không Phát Sinh Chi Phí
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#bfdbfe', maxWidth: '780px', lineHeight: 1.6, marginBottom: '20px' }}>
          "Khách hàng xác nhận báo giá thì tổng tiền phải trả được khóa theo báo giá đó. Khách hàng không phải trả thêm phí công, phí di chuyển hoặc phụ phí ngoài báo giá đã chấp thuận." (Trích PRD-ĐMST.docx)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#4ade80', marginBottom: '6px' }}>
              1. Khóa Giá Điện Tử
            </h4>
            <p style={{ fontSize: '12px', color: '#e2e8f0' }}>
              Mỗi báo giá tạo ra một bản ghi bất biến (hash signature) gắn liền với đơn hàng, thợ không thể can thiệp sửa giá.
            </p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#4ade80', marginBottom: '6px' }}>
              2. Quy Trình Phát Sinh Kép
            </h4>
            <p style={{ fontSize: '12px', color: '#e2e8f0' }}>
              Nếu kiểm tra thực tế phát hiện hư hỏng mới, thợ phải tạm dừng và gửi báo giá bổ sung để khách bấm đồng ý trên ứng dụng.
            </p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#4ade80', marginBottom: '6px' }}>
              3. Bảo Vệ Người Dùng
            </h4>
            <p style={{ fontSize: '12px', color: '#e2e8f0' }}>
              Không tự động coi sự im lặng là đồng ý. Không có xác nhận bổ sung, hệ thống chặn không cho phép ghi nhận phụ phí vào hóa đơn.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Matrix Reference Table */}
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43', marginBottom: '14px' }}>
          Biểu Phí Tham Khảo Từng Hạng Mục Tiêu Chuẩn
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {SERVICE_CATEGORIES.map(cat => (
            <div key={cat.id} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ fontSize: '15px', color: '#102a43' }}>{cat.title}</strong>
                <span className="badge badge-green">{cat.basePrice}</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569' }}>
                {cat.items.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
