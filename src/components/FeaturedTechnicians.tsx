import React from 'react';
import { MOCK_TECHNICIANS } from '../data/mockData';
import { Star, ShieldCheck, MapPin, Navigation, Phone, Wrench, ArrowRight } from 'lucide-react';
import { Technician } from '../types';

interface FeaturedTechniciansProps {
  onBookTechnician: (tech: Technician) => void;
}

export const FeaturedTechnicians: React.FC<FeaturedTechniciansProps> = ({ onBookTechnician }) => {
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43' }}>
              Đội Ngũ Thợ Chuyên Nghiệp Được Xác Minh Gần Bạn
            </h3>
            <span className="badge badge-green" style={{ fontSize: '11px' }}>
              Đã Xác Minh
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            100% thợ đều có chứng chỉ nghề, lý lịch rõ ràng và cam kết tuân thủ chính sách không phát sinh phí
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        {MOCK_TECHNICIANS.map((tech) => (
          <div
            key={tech.id}
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.2s'
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <img
                  src={tech.avatar}
                  alt={tech.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#102a43' }}>
                    {tech.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>
                    <Star size={13} fill="#f59e0b" />
                    <span>{tech.rating}</span>
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}>({tech.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Verified badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16a34a', fontWeight: 700, marginBottom: '8px' }}>
                <ShieldCheck size={14} />
                <span>Đã xác minh hồ sơ & tay nghề</span>
              </div>

              {/* Specialties */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                {tech.specialty.map((sp, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {sp}
                  </span>
                ))}
              </div>

              {/* Distance & ETA */}
              <div style={{
                background: '#f8fafc',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '14px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Navigation size={12} color="#2563eb" />
                  <strong>{tech.distanceKm} km</strong>
                </span>
                <span>Đến sau: <strong style={{ color: '#16a34a' }}>~{tech.etaMinutes} phút</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onBookTechnician(tech)}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#ffffff',
                padding: '9px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Đặt Thợ Này Ngay</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
