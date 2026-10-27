import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Wrench, Power, CheckCircle, Navigation, Phone, MessageSquare, AlertCircle, DollarSign, Clock, Camera, ShieldCheck } from 'lucide-react';

interface TechnicianViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenChat: (order: Order) => void;
}

export const TechnicianView: React.FC<TechnicianViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onOpenChat
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const activeOrder = orders.find(o => o.status !== 'da_thanh_toan' && o.status !== 'da_huy') || orders[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner for Technician */}
      <div style={{
        background: 'linear-gradient(135deg, #102a43 0%, #1e3a8a 100%)',
        color: '#ffffff',
        padding: '28px',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(16, 42, 67, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
            alt="Thợ"
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #60a5fa' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Nguyễn Văn Hùng</h2>
              <span className="badge badge-green" style={{ fontSize: '11px' }}>
                ĐÃ XÁC MINH DANH TÍNH
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#93c5fd', marginTop: '2px' }}>
              Chuyên môn: Sửa xe máy • Cứu hộ ô tô • Điện dân dụng • Đánh giá 4.95 ⭐ (428 lượt)
            </p>
          </div>
        </div>

        {/* Online / Offline Toggle (PRD line 458) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: isOnline ? '#4ade80' : '#94a3b8' }}>
            {isOnline ? 'Đang Sẵn Sàng Nhận Đơn' : 'Tạm Nghỉ / Offline'}
          </span>
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            style={{
              background: isOnline ? '#16a34a' : '#64748b',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Power size={16} />
            <span>{isOnline ? 'Tắt Nhận Việc' : 'Bật Nhận Việc'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Thu nhập hôm nay</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
            1.280.000 ₫
          </h3>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Đã đối soát vào ví thợ</span>
        </div>
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Số đơn đã hoàn thành</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
            4 đơn
          </h3>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Tỷ lệ đúng giờ: 100%</span>
        </div>
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Đánh giá trung bình</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            4.95 / 5.0
          </h3>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Top 5% thợ xuất sắc</span>
        </div>
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Độ chuẩn giá cố định</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#102a43', marginTop: '4px' }}>
            100%
          </h3>
          <span style={{ fontSize: '11px', color: '#16a34a' }}>0 vi phạm phát sinh</span>
        </div>
      </div>

      {/* Active Job Management Section */}
      {activeOrder && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-blue">ĐƠN CẦN XỬ LÝ NGAY</span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43' }}>
                Đơn #{activeOrder.id} • {activeOrder.serviceType}
              </h3>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
              Trạng thái: {activeOrder.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
                  <strong>Khách hàng:</strong> {activeOrder.customerName} ({activeOrder.customerPhone})
                </p>
                <p style={{ fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
                  <strong>Địa chỉ:</strong> {activeOrder.customerAddress}
                </p>
                <p style={{ fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
                  <strong>Thiết bị:</strong> {activeOrder.deviceInfo}
                </p>
                <p style={{ fontSize: '13px', color: '#334155' }}>
                  <strong>Triệu chứng:</strong> {activeOrder.symptoms}
                </p>
              </div>

              {/* Photo preview from customer's Camera AI */}
              {activeOrder.imageProofUrl && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                    Ảnh chẩn đoán lỗi từ Camera AI của khách hàng:
                  </span>
                  <img
                    src={activeOrder.imageProofUrl}
                    alt="Proof"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              )}
            </div>

            {/* Price & Action Step Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>BẢNG GIÁ KHÓA CỐ ĐỊNH:</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', margin: '6px 0' }}>
                  {activeOrder.quote.totalPrice.toLocaleString('vi-VN')} ₫
                </div>
                <p style={{ fontSize: '11px', color: '#3b82f6' }}>
                  ✓ Đã bao gồm công thợ, vật tư và phí di chuyển. Tuyệt đối không tự ý báo thêm tiền ngoài đơn.
                </p>
              </div>

              {/* Step Action Buttons for Technician */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => onUpdateOrderStatus(activeOrder.id, 'tho_dang_den')}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  1. Tôi Đang Di Chuyển Đến
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateOrderStatus(activeOrder.id, 'tho_da_den')}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  2. Đã Có Mặt Tại Điểm Hẹn
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateOrderStatus(activeOrder.id, 'dang_sua')}
                  style={{
                    background: '#f59e0b',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  3. Bắt Đầu Tiến Hành Sửa Chữa
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateOrderStatus(activeOrder.id, 'cho_nghiem_thu')}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  4. Đã Xong – Mời Khách Nghiệm Thu
                </button>

                <button
                  type="button"
                  onClick={() => onOpenChat(activeOrder)}
                  style={{
                    background: '#ffffff',
                    color: '#1e293b',
                    border: '1px solid #cbd5e1',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageSquare size={16} color="#2563eb" />
                  <span>Nhắn Tin Với Khách</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
