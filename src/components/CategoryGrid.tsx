import React from 'react';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { Bike, Car, Zap, Droplets, Snowflake, Wrench, ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'xe_may': return Bike;
      case 'o_to': return Car;
      case 'dien': return Zap;
      case 'nuoc': return Droplets;
      case 'dien_lanh': return Snowflake;
      default: return Wrench;
    }
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43' }}>
            Danh Mục Dịch Vụ Sửa Chữa & Cứu Hộ
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Chọn lĩnh vực để AI phân tích lỗi và kết nối kỹ thuật viên chuyên sâu gần bạn
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '18px'
      }}>
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = getIcon(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '22px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(16, 42, 67, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.12)';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 42, 67, 0.04)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}>
                    <Icon size={24} />
                  </div>
                  <span className="badge badge-blue" style={{ fontSize: '11px' }}>
                    {cat.badge}
                  </span>
                </div>

                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#102a43', marginBottom: '6px' }}>
                  {cat.title}
                </h4>

                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
                  {cat.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {cat.items.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>
                  {cat.basePrice}
                </span>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Đặt ngay</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
