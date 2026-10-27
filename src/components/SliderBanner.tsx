import React, { useState, useEffect } from 'react';
import { Camera, Wrench, ShieldCheck, Zap, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface SliderBannerProps {
  onOpenLiveCamera: () => void;
  onOpenDiagnosis: (category?: string) => void;
}

export const SliderBanner: React.FC<SliderBannerProps> = ({
  onOpenLiveCamera,
  onOpenDiagnosis,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'CÔNG NGHỆ ĐỘT PHÁ AI 4.0',
      title: 'Nhận Diện Lỗi Kỹ Thuật Bằng Camera AI Trực Tiếp',
      description: 'Chỉ cần hướng camera vào xe máy, bảng điện hoặc đường ống nước – AI tự động khoanh vùng lỗi, cảnh báo an toàn và tính toán giá cố định trong 2 giây.',
      actionText: 'Bật Camera Quét Lỗi Ngay',
      actionIcon: Camera,
      onClick: onOpenLiveCamera,
      bgGradient: 'linear-gradient(135deg, #102a43 0%, #1e3a8a 50%, #2563eb 100%)',
      accentColor: '#60a5fa',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      badge: 'CỨU HỘ KHẨN CẤP 24/7',
      title: 'Sửa Xe Máy & Cứu Hộ Ô Tô Tận Nơi Trong 15 Phút',
      description: 'Chết máy giữa đường, hết ắc quy, thủng lốp, hỏng phanh? Hơn 500+ thợ chuyên nghiệp trực chiến khắp mọi nẻo đường, đến cứu viện thần tốc.',
      actionText: 'Gọi Cứu Hộ Xe Khẩn Cấp',
      actionIcon: Zap,
      onClick: () => onOpenDiagnosis('xe_may'),
      bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%)',
      accentColor: '#fca5a5',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      badge: 'CAM KỬT MINH BẠCH 100%',
      title: 'Sửa Điện Nước & Đồ Gia Dụng – Không Phát Sinh Phí',
      description: 'Nguyên tắc bất biến từ PRD: Khách hàng đồng ý báo giá nào thì thanh toán đúng số tiền đó. Không lo thợ tự ý vòi thêm tiền hay thay đồ kém chất lượng.',
      actionText: 'Đặt Thợ Điện Nước Tại Nhà',
      actionIcon: Wrench,
      onClick: () => onOpenDiagnosis('nuoc'),
      bgGradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)',
      accentColor: '#6ee7b7',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      badge: 'BẢO DƯỠNG ĐỊNH KỲ',
      title: 'Bảo Dưỡng Xe Định Kỳ – Đảm Bảo An Toàn Suốt Hành Trình',
      description: 'FIX247 nhắc nhở lịch bảo dưỡng, kiểm tra định kỳ động cơ, đầu, phanh và các bộ phận quan trọng. Thợ chuyên môn đến tận nơi, phụ tùng chính hãng, giá minh bạch.',
      actionText: 'Đặt Lịch Bảo Dưỡng Ngay',
      actionIcon: ShieldCheck,
      onClick: () => onOpenDiagnosis('o_to'),
      bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      accentColor: '#a5b4fc',
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=700&auto=format&fit=crop&q=80'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[currentSlide];
  const ActionIcon = active.actionIcon;

  return (
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 12px 36px rgba(16, 42, 67, 0.15)',
      marginBottom: '32px'
    }}>
      <div style={{
        background: active.bgGradient,
        color: '#ffffff',
        padding: '36px 44px',
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        alignItems: 'center',
        gap: '30px',
        minHeight: '320px',
        position: 'relative',
        transition: 'background 0.5s ease'
      }}>
        {/* Left Content */}
        <div style={{ zIndex: 2 }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: active.accentColor,
            fontSize: '11px',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '999px',
            display: 'inline-block',
            marginBottom: '14px',
            letterSpacing: '0.5px'
          }}>
            {active.badge}
          </span>

          <h2 style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1.25, marginBottom: '14px', letterSpacing: '-0.5px' }}>
            {active.title}
          </h2>

          <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6, maxWidth: '540px', marginBottom: '24px' }}>
            {active.description}
          </p>

          <button
            type="button"
            onClick={active.onClick}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              padding: '13px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
          >
            <ActionIcon size={18} color="#2563eb" />
            <span>{active.actionText}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Hero Image Card */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '380px',
            height: '240px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
            position: 'relative'
          }}>
            <img
              src={active.image}
              alt={active.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)'
            }} />
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            zIndex: 10
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            zIndex: 10
          }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots indicators */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: currentSlide === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentSlide === i ? '#ffffff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
