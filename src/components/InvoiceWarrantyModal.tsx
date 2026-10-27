import React, { useState } from 'react';
import { Order } from '../types';
import { ShieldCheck, Star, FileText, CheckCircle2, Download, Printer, QrCode, X } from 'lucide-react';

interface InvoiceWarrantyModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onSubmitReview: (orderId: string, rating: number, comment: string) => void;
}

export const InvoiceWarrantyModal: React.FC<InvoiceWarrantyModalProps> = ({
  isOpen,
  order,
  onClose,
  onSubmitReview,
}) => {
  const [tab, setTab] = useState<'invoice' | 'warranty' | 'review'>('invoice');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Dịch vụ rất nhanh và chuyên nghiệp, quét camera báo lỗi chuẩn xác 100%!');
  const [submittedReview, setSubmittedReview] = useState(false);

  if (!isOpen) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(order.id, rating, comment);
    setSubmittedReview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const warrantyCode = order.warrantyCode || `BH-2026-${order.id.slice(-6)}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '780px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(16, 42, 67, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Tabs */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setTab('invoice')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                background: tab === 'invoice' ? '#2563eb' : '#ffffff',
                color: tab === 'invoice' ? '#ffffff' : '#64748b',
                border: tab === 'invoice' ? '1px solid #2563eb' : '1px solid #cbd5e1'
              }}
            >
              Hóa Đơn Điện Tử
            </button>
            <button
              type="button"
              onClick={() => setTab('warranty')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                background: tab === 'warranty' ? '#2563eb' : '#ffffff',
                color: tab === 'warranty' ? '#ffffff' : '#64748b',
                border: tab === 'warranty' ? '1px solid #2563eb' : '1px solid #cbd5e1'
              }}
            >
              Chứng Nhận Bảo Hành
            </button>
            <button
              type="button"
              onClick={() => setTab('review')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                background: tab === 'review' ? '#2563eb' : '#ffffff',
                color: tab === 'review' ? '#ffffff' : '#64748b',
                border: tab === 'review' ? '1px solid #2563eb' : '1px solid #cbd5e1'
              }}
            >
              Đánh Giá Thợ ⭐
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab 1: Invoice */}
        {tab === 'invoice' && (
          <div style={{ padding: '28px' }}>
            {/* Invoice Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #102a43', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#102a43', letterSpacing: '-0.5px' }}>
                  FixNow AI Services
                </h2>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Công ty Cổ phần Công nghệ & Dịch vụ Sửa chữa FixNow AI
                </p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Hotline: 1900 8899 • MST: 0109988776
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green" style={{ fontSize: '12px', marginBottom: '6px' }}>
                  ĐÃ THANH TOÁN
                </span>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#102a43' }}>
                  HÓA ĐƠN #{order.id}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Ngày: {order.completedAt || order.createdAt}
                </p>
              </div>
            </div>

            {/* Customer & Technician Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px' }}>
              <div>
                <strong style={{ color: '#102a43', display: 'block', marginBottom: '4px' }}>Khách hàng:</strong>
                <p>{order.customerName}</p>
                <p>{order.customerPhone}</p>
                <p>{order.customerAddress}</p>
              </div>
              <div>
                <strong style={{ color: '#102a43', display: 'block', marginBottom: '4px' }}>Kỹ thuật viên thực hiện:</strong>
                <p>{order.technician?.name || 'Nguyễn Văn Hùng'}</p>
                <p>SĐT: {order.technician?.phone || '0912 345 678'}</p>
                <p>Chuyên môn: {order.serviceType}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>STT</th>
                    <th style={{ padding: '10px 14px' }}>Nội dung sửa chữa / Vật tư thay thế</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {order.quote.items.map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700 }}>
                        {item.price.toLocaleString('vi-VN')} ₫
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid #102a43', background: '#f8fafc' }}>
                    <td colSpan={2} style={{ padding: '12px 14px', fontWeight: 800, fontSize: '14px' }}>
                      TỔNG THANH TOÁN (CAM KẾT CỐ ĐỊNH):
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, fontSize: '16px', color: '#16a34a' }}>
                      {order.quote.totalPrice.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={16} />
                <span>In Hóa Đơn</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Electronic Warranty */}
        {tab === 'warranty' && (
          <div style={{ padding: '28px' }}>
            <div style={{
              background: 'linear-gradient(145deg, #102a43, #1e3a8a)',
              color: '#ffffff',
              padding: '28px',
              borderRadius: '18px',
              boxShadow: '0 10px 25px rgba(16, 42, 67, 0.25)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-green" style={{ marginBottom: '8px' }}>
                    CHỨNG NHẬN BẢO HÀNH ĐIỆN TỬ
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>
                    Mã Bảo Hành: {warrantyCode}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#bfdbfe', marginTop: '4px' }}>
                    Thiết bị: {order.deviceInfo} • Lỗi đã sửa: {order.detectedDefectName || order.serviceType}
                  </p>
                </div>
                <div style={{
                  background: '#ffffff',
                  padding: '8px',
                  borderRadius: '10px',
                  color: '#102a43'
                }}>
                  <QrCode size={50} />
                </div>
              </div>

              <div style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                fontSize: '13px'
              }}>
                <div>
                  <span style={{ opacity: 0.7, fontSize: '11px', display: 'block' }}>THỜI HẠN BẢO HÀNH</span>
                  <strong>{order.quote.warrantyMonths} Tháng</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.7, fontSize: '11px', display: 'block' }}>NGÀY KÍCH HOẠT</span>
                  <strong>{order.completedAt || 'Hôm nay'}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.7, fontSize: '11px', display: 'block' }}>HÌNH THỨC</span>
                  <strong>Bảo hành tận nơi 1-1</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
              <p>• Chính sách bảo hành theo tiêu chuẩn FixNow AI: Bảo hành toàn diện linh kiện thay thế và tay nghề kỹ thuật viên trong suốt thời gian quy định.</p>
              <p>• Trường hợp tái phát lỗi tương tự, khách hàng chỉ cần quét mã QR bảo hành trên ứng dụng, thợ sẽ đến xử lý hoàn toàn miễn phí trong vòng 30 phút.</p>
            </div>
          </div>
        )}

        {/* Tab 3: Rating & Review */}
        {tab === 'review' && (
          <div style={{ padding: '28px' }}>
            {submittedReview ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={54} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>
                  Cảm Ơn Đánh Giá Của Bạn!
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Đánh giá của bạn đã được ghi nhận vào hồ sơ thợ và giúp cộng đồng ngày càng tin cậy hơn.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>
                  Đánh Giá Chất Lượng Dịch Vụ
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  Bạn đánh giá thế nào về sự hỗ trợ của thợ <strong>{order.technician?.name || 'Nguyễn Văn Hùng'}</strong>?
                </p>

                {/* Star rating selector */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <Star
                        size={32}
                        color="#f59e0b"
                        fill={rating >= star ? '#f59e0b' : 'none'}
                      />
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Nhận xét chi tiết
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}
                >
                  Gửi Đánh Giá Ngay
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
