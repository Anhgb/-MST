import React, { useState } from 'react';
import { Quote, DetectedDefect } from '../types';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { Camera, Sparkles, ShieldCheck, AlertCircle, Wrench, Clock, Check, X, ArrowRight, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

interface AIDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDefect?: DetectedDefect | null;
  initialPhotoUrl?: string | null;
  onOpenLiveCamera: () => void;
  onConfirmAndFindTechnician: (quote: Quote, serviceDetails: {
    category: string;
    deviceInfo: string;
    symptoms: string;
    address: string;
    urgency: string;
    photoUrl?: string;
  }) => void;
}

export const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({
  isOpen,
  onClose,
  initialDefect,
  initialPhotoUrl,
  onOpenLiveCamera,
  onConfirmAndFindTechnician,
}) => {
  const [category, setCategory] = useState(initialDefect?.category || 'xe_may');
  const [deviceInfo, setDeviceInfo] = useState(
    initialDefect?.category === 'xe_may' ? 'Honda AirBlade 125cc (2021)' :
    initialDefect?.category === 'nuoc' ? 'Đường ống nước cấp tầng 2 PVC D27' :
    initialDefect?.category === 'dien' ? 'Bảng điện phòng khách Aptomat 32A' :
    initialDefect?.category === 'o_to' ? 'Toyota Vios 1.5G (2020)' :
    'Thiết bị gia dụng gia đình'
  );
  const [symptoms, setSymptoms] = useState(initialDefect ? initialDefect.description : 'Xe đang đi thì bị chết máy, đề không lên, còi kêu yếu');
  const [address, setAddress] = useState('Số 72 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội');
  const [urgency, setUrgency] = useState<'khan_cap' | 'trong_ngay' | 'hen_lich'>('khan_cap');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialPhotoUrl || undefined);

  const [isGenerated, setIsGenerated] = useState(true);

  if (!isOpen) return null;

  // Build active quote based on detected defect or standard calculation
  const laborPrice = initialDefect?.estimatedCost.labor || 120000;
  const partsPrice = initialDefect?.estimatedCost.parts || 80000;
  const travelPrice = initialDefect?.estimatedCost.travel || 20000;
  const partsName = initialDefect?.estimatedCost.partsName || 'Vật tư & phụ tùng thay thế tiêu chuẩn';
  const totalPrice = laborPrice + partsPrice + travelPrice;

  const currentQuote: Quote = {
    id: `QT-${Date.now().toString().slice(-6)}`,
    version: 1,
    createdAt: new Date().toLocaleString('vi-VN'),
    serviceCategory: SERVICE_CATEGORIES.find(c => c.id === category)?.title || 'Sửa Xe Máy',
    symptoms: symptoms,
    detectedDefects: initialDefect ? [initialDefect.name] : ['Sự cố điện nguồn / hao mòn cơ khí'],
    confidence: initialDefect?.confidence || 93.5,
    alternativeCauses: ['Hỏng rơ le đóng ngắt', 'Lỏng tiếp điểm giắc cắm'],
    safetyWarnings: initialDefect?.safetyWarning ? [initialDefect.safetyWarning] : ['Không tự ý đấu nối trực tiếp tránh cháy nổ thiết bị'],
    items: [
      { name: 'Công thợ kiểm tra & xử lý kỹ thuật tận nơi', type: 'labor', price: laborPrice },
      { name: partsName, type: 'parts', price: partsPrice },
      { name: 'Phí di chuyển kỹ thuật viên (dưới 5km)', type: 'travel', price: travelPrice }
    ],
    totalPrice: totalPrice,
    estimatedTimeMin: 35,
    warrantyMonths: 6,
    isLocked: true,
    customerAccepted: false
  };

  const handleConfirmQuote = () => {
    onConfirmAndFindTechnician(currentQuote, {
      category,
      deviceInfo,
      symptoms,
      address,
      urgency,
      photoUrl
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '960px',
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
          background: 'linear-gradient(90deg, #f8fafc, #eff6ff)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43' }}>
                  AI Chẩn Đoán Lỗi & Dự Toán Báo Giá Cố Định
                </h3>
                <span className="badge badge-blue">PRD Mục 6</span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Cam kết giá chuẩn trọn gói – Tuyệt đối không phát sinh phụ phí ngoài hợp đồng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body: Two columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: '24px',
          padding: '24px 28px'
        }}>
          {/* Left Column: Input Information & Camera Scan Trigger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '14px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Camera size={20} color="#2563eb" />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', display: 'block' }}>
                    Camera AI Quét Nhận Diện Lỗi
                  </span>
                  <span style={{ fontSize: '11px', color: '#3b82f6' }}>
                    {initialDefect ? `Đã nhận diện: ${initialDefect.name}` : 'Mở camera để quét tự động'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenLiveCamera}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                Mở Camera Quét
              </button>
            </div>

            {/* Photo preview if available */}
            {photoUrl && (
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '140px' }}>
                <img src={photoUrl} alt="Defect" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Ảnh bằng chứng từ Camera AI
                </span>
              </div>
            )}

            {/* Service Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Danh mục dịch vụ
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  background: '#ffffff'
                }}
              >
                {SERVICE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Device Info */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Loại xe / Thiết bị cần sửa
              </label>
              <input
                type="text"
                value={deviceInfo}
                onChange={(e) => setDeviceInfo(e.target.value)}
                placeholder="Ví dụ: Honda SH 150i (2022) hoặc Điều hòa Daikin 1.5HP"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            {/* Symptoms Description */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Mô tả hiện trạng & triệu chứng
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Mô tả chi tiết âm thanh, mùi khét, dấu hiệu hư hỏng..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
              />
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Địa chỉ thợ đến phục vụ
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            {/* Urgency */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Mức độ khẩn cấp
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setUrgency('khan_cap')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: urgency === 'khan_cap' ? '#fef2f2' : '#f8fafc',
                    color: urgency === 'khan_cap' ? '#dc2626' : '#64748b',
                    border: urgency === 'khan_cap' ? '2px solid #ef4444' : '1px solid #e2e8f0'
                  }}
                >
                  ⚡ Cứu hộ gấp
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('trong_ngay')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: urgency === 'trong_ngay' ? '#eff6ff' : '#f8fafc',
                    color: urgency === 'trong_ngay' ? '#2563eb' : '#64748b',
                    border: urgency === 'trong_ngay' ? '2px solid #3b82f6' : '1px solid #e2e8f0'
                  }}
                >
                  Trong ngày
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('hen_lich')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: urgency === 'hen_lich' ? '#f0fdf4' : '#f8fafc',
                    color: urgency === 'hen_lich' ? '#16a34a' : '#64748b',
                    border: urgency === 'hen_lich' ? '2px solid #22c55e' : '1px solid #e2e8f0'
                  }}
                >
                  Hẹn lịch trước
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis Card & Fixed Price Guarantee */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-navy">BẢNG BÁO GIÁ CỐ ĐỊNH #{currentQuote.id}</span>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>
                  Độ chính xác: {currentQuote.confidence}%
                </span>
              </div>

              {/* Diagnosis box */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  LỖI DỰ ĐOÁN CHÍNH (AI DIAGNOSIS):
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#102a43', marginBottom: '6px' }}>
                  {currentQuote.detectedDefects[0]}
                </h4>

                <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                  <span>Dự kiến: <strong>{currentQuote.estimatedTimeMin} phút</strong></span>
                  <span>•</span>
                  <span>Bảo hành: <strong>{currentQuote.warrantyMonths} tháng</strong></span>
                </div>
              </div>

              {/* Safety warning if critical */}
              {currentQuote.safetyWarnings.length > 0 && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: '#b45309'
                }}>
                  <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
                  <span>{currentQuote.safetyWarnings[0]}</span>
                </div>
              )}

              {/* Itemized Table (PRD line 239-251) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ background: '#f1f5f9', padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hạng mục sửa chữa chi tiết</span>
                  <span>Chi phí</span>
                </div>
                {currentQuote.items.map((item, index) => (
                  <div key={index} style={{
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    borderBottom: index < currentQuote.items.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <span style={{ color: '#334155' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.price.toLocaleString('vi-VN')} ₫</span>
                  </div>
                ))}
              </div>

              {/* Total Price & Immutable Guarantee Badge */}
              <div style={{
                background: 'linear-gradient(135deg, #102a43, #1e3a8a)',
                color: '#ffffff',
                padding: '16px',
                borderRadius: '14px',
                boxShadow: '0 8px 20px rgba(16, 42, 67, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>TỔNG THANH TOÁN KHÓA GIÁ:</span>
                  <span className="badge badge-green" style={{ background: '#16a34a', color: '#fff' }}>
                    <ShieldCheck size={12} />
                    <span>KHÓA BẤT BIẾN</span>
                  </span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#4ade80' }}>
                  {currentQuote.totalPrice.toLocaleString('vi-VN')} ₫
                </div>
                <p style={{ fontSize: '11px', color: '#bfdbfe', marginTop: '6px', lineHeight: 1.4 }}>
                  ✓ Cam kết theo PRD 6.4: Thợ không được thu thêm bất kỳ khoản phí nào ngoài báo giá đã duyệt. Mọi việc phát sinh mới phải có xác nhận điện tử từ khách hàng.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  color: '#64748b',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Chưa đồng ý
              </button>

              <button
                type="button"
                onClick={handleConfirmQuote}
                style={{
                  flex: 2,
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                <span>Đồng Ý – Tìm Thợ Gần Nhất</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
