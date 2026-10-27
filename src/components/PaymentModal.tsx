import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, Clock, AlertCircle, Copy, ArrowRight, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  order: Order;
  onPaymentSuccess: (orderId: string, method: 'cash' | 'vietqr' | 'visa') => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  order,
  onPaymentSuccess,
  onClose,
}) => {
  const [method, setMethod] = useState<'cash' | 'vietqr' | 'visa'>('vietqr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes QR timeout
  const [copiedText, setCopiedText] = useState(false);

  // Visa form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('NGUYEN VAN A');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Simulated auto-payment webhook for VietQR
  useEffect(() => {
    let timer: any;
    if (isOpen && method === 'vietqr') {
      const interval = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Auto-simulate bank notification after 8 seconds of looking at QR
      timer = setTimeout(() => {
        // can auto trigger if user chooses to wait
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isOpen, method]);

  if (!isOpen) return null;

  const totalAmount = order.quote.totalPrice;
  const memoContent = `FIXNOW ${order.id.slice(-6)}`;

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(memoContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(order.id, method);
      onClose();
    }, 1500);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

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
        maxWidth: '860px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(16, 42, 67, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, #102a43, #1e3a8a)',
          color: '#ffffff'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-green" style={{ fontSize: '11px' }}>
                THANH TOÁN ĐƠN #{order.id}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                Cổng Thanh Toán Minh Bạch & Xác Nhận Tự Động
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#93c5fd', marginTop: '4px' }}>
              Hỗ trợ 3 phương thức thanh toán chuẩn hóa theo PRD Mục 8
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '24px',
          padding: '24px 28px'
        }}>
          {/* Left Column: Method Selector & Order Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
              CHỌN PHƯƠNG THỨC THANH TOÁN (PRD 8):
            </span>

            {/* VietQR Option */}
            <div
              onClick={() => setMethod('vietqr')}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: method === 'vietqr' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: method === 'vietqr' ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <QrCode size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#102a43' }}>
                    Chuyển Khoản Mã QR Ngân Hàng
                  </h4>
                  <span className="badge badge-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>
                    Napas 247
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Quét QR qua Vietcombank, MB, Techcombank tự điền số tiền
                </p>
              </div>
            </div>

            {/* Visa / MasterCard Option */}
            <div
              onClick={() => setMethod('visa')}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: method === 'visa' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: method === 'visa' ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <CreditCard size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#102a43' }}>
                    Thẻ Quốc Tế Visa / Master
                  </h4>
                  <span className="badge badge-navy" style={{ fontSize: '10px', padding: '1px 6px' }}>
                    3D Secure
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Thanh toán qua cổng thẻ chuẩn PCI DSS mã hóa token
                </p>
              </div>
            </div>

            {/* Cash on Completion Option */}
            <div
              onClick={() => setMethod('cash')}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: method === 'cash' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: method === 'cash' ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Banknote size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#102a43' }}>
                    Tiền Mặt Trực Tiếp Cho Thợ
                  </h4>
                  <span className="badge badge-green" style={{ fontSize: '10px', padding: '1px 6px' }}>
                    Nghiệm thu
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Thanh toán tiền mặt sau khi thợ sửa xong & ký xác nhận
                </p>
              </div>
            </div>

            {/* Fixed Price Note */}
            <div style={{
              background: '#f8fafc',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginTop: 'auto'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                HÓA ĐƠN CHI TIẾT ĐÃ KHÓA:
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                <span>Công kỹ thuật:</span>
                <span>{order.quote.items.find(i => i.type === 'labor')?.price.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                <span>Linh kiện / Phụ tùng:</span>
                <span>{order.quote.items.find(i => i.type === 'parts')?.price.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                <span>Phí di chuyển:</span>
                <span>{order.quote.items.find(i => i.type === 'travel')?.price.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div style={{
                borderTop: '1px solid #cbd5e1',
                paddingTop: '8px',
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '16px',
                color: '#102a43'
              }}>
                <span>Tổng phải trả:</span>
                <span style={{ color: '#16a34a' }}>{totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form according to selected method */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* 1. VIETQR VIEW */}
            {method === 'vietqr' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                  <Clock size={16} />
                  <span>Mã QR tự động hết hạn sau: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                </div>

                {/* Simulated Real QR Image matching VietQR format */}
                <div style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  marginBottom: '16px'
                }}>
                  {/* Generated SVG QR Pattern */}
                  <svg width="180" height="180" viewBox="0 0 100 100" style={{ display: 'block' }}>
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Corner Position Detection Patterns */}
                    <rect x="5" y="5" width="26" height="26" fill="#102a43" rx="4" />
                    <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                    <rect x="13" y="13" width="10" height="10" fill="#2563eb" rx="2" />

                    <rect x="69" y="5" width="26" height="26" fill="#102a43" rx="4" />
                    <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                    <rect x="77" y="13" width="10" height="10" fill="#2563eb" rx="2" />

                    <rect x="5" y="69" width="26" height="26" fill="#102a43" rx="4" />
                    <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
                    <rect x="13" y="77" width="10" height="10" fill="#2563eb" rx="2" />

                    {/* QR Code Dots */}
                    <rect x="36" y="8" width="6" height="6" fill="#102a43" />
                    <rect x="48" y="14" width="8" height="6" fill="#102a43" />
                    <rect x="36" y="24" width="6" height="6" fill="#102a43" />
                    <rect x="58" y="22" width="6" height="6" fill="#102a43" />

                    <rect x="10" y="38" width="8" height="8" fill="#102a43" />
                    <rect x="24" y="44" width="6" height="6" fill="#102a43" />
                    <rect x="38" y="38" width="24" height="24" fill="#2563eb" rx="4" />
                    {/* Logo inside QR */}
                    <text x="50" y="54" fontSize="14" fontWeight="bold" fill="#ffffff" textAnchor="middle">FN</text>

                    <rect x="68" y="40" width="8" height="8" fill="#102a43" />
                    <rect x="82" y="48" width="6" height="6" fill="#102a43" />

                    <rect x="38" y="70" width="8" height="8" fill="#102a43" />
                    <rect x="52" y="76" width="12" height="6" fill="#102a43" />
                    <rect x="72" y="70" width="8" height="8" fill="#102a43" />
                    <rect x="84" y="82" width="6" height="6" fill="#102a43" />
                  </svg>
                  <p style={{ fontSize: '11px', color: '#102a43', fontWeight: 800, marginTop: '8px' }}>
                    VIETQR • NAPAS 247
                  </p>
                </div>

                <div style={{ width: '100%', background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', textAlign: 'left', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: '#64748b' }}>Ngân hàng thụ hưởng:</span>
                    <strong style={{ color: '#102a43' }}>Vietcombank (Hội sở chính)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: '#64748b' }}>Chủ tài khoản:</span>
                    <strong style={{ color: '#102a43' }}>CONG TY CP DICH VU FIXNOW AI</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: '#64748b' }}>Số tài khoản:</span>
                    <strong style={{ color: '#2563eb' }}>1028 999 8888</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                    <span style={{ color: '#64748b' }}>Nội dung chuyển:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: '#dc2626' }}>{memoContent}</strong>
                      <button type="button" onClick={handleCopyMemo} style={{ color: '#2563eb', padding: '2px 4px' }}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: '#64748b' }}>
                  Hệ thống tự động lắng nghe Webhook ngân hàng và xác nhận giao dịch thành công ngay khi tài khoản nhận được tiền.
                </p>
              </div>
            )}

            {/* 2. VISA VIEW */}
            {method === 'visa' && (
              <div>
                <span className="badge badge-navy" style={{ marginBottom: '14px' }}>
                  CỔNG THẺ QUỐC TẾ BẢO MẬT 256-BIT SSL
                </span>

                <div style={{
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  color: '#ffffff',
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '1px' }}>FixNow Pay</span>
                    <span style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic' }}>VISA</span>
                  </div>
                  <div style={{ fontSize: '18px', letterSpacing: '2px', fontWeight: 600, marginBottom: '18px' }}>
                    {cardNumber}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div>
                      <span style={{ opacity: 0.7, display: 'block', fontSize: '9px' }}>CHỦ THẺ</span>
                      <span style={{ fontWeight: 700 }}>{cardHolder}</span>
                    </div>
                    <div>
                      <span style={{ opacity: 0.7, display: 'block', fontSize: '9px' }}>HẠN DÙNG</span>
                      <span style={{ fontWeight: 700 }}>{cardExpiry}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Số thẻ</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Ngày hết hạn</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Mã CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CASH VIEW */}
            {method === 'cash' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Banknote size={54} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>
                  Thanh Toán Tiền Mặt Sau Nghiệm Thu
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
                  Bạn sẽ đưa đúng số tiền <strong>{totalAmount.toLocaleString('vi-VN')} ₫</strong> trực tiếp cho kỹ thuật viên. Kỹ thuật viên sẽ bấm nút "Xác Nhận Đã Thu Tiền" trên ứng dụng của họ để kích hoạt mã bảo hành điện tử cho bạn.
                </p>
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#166534', textAlign: 'left' }}>
                  ✓ Cam kết minh bạch: Không đưa thêm tiền boa hoặc phụ phí phát sinh trái phép.
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(22, 163, 74, 0.4)'
                }}
              >
                {isProcessing ? (
                  <span>Đang xác thực giao dịch...</span>
                ) : (
                  <>
                    <span>
                      {method === 'cash' ? 'Xác Nhận Thanh Toán Tiền Mặt' : `Xác Nhận Thanh Toán ${totalAmount.toLocaleString('vi-VN')} ₫`}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
