import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { MapPin, Search, Camera, PhoneCall, ChevronDown, Navigation, X, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenLiveCamera: () => void;
  onOpenDatabase: () => void;
  onSwitchRole: (role: any) => void;
}

interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string;
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenLiveCamera,
}) => {
  const [locationState, setLocationState] = useState<LocationState>({
    lat: null,
    lng: null,
    address: '72 Trần Đại Nghĩa, Hai Bà Trưng',
    status: 'idle'
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const mapIframeRef = useRef<HTMLIFrameElement>(null);

  const requestLocation = () => {
    setLocationState(prev => ({ ...prev, status: 'loading' }));
    if (!navigator.geolocation) {
      setLocationState(prev => ({ ...prev, status: 'error', address: 'Trình duyệt không hỗ trợ GPS' }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode using Nominatim (free, no API key needed)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`,
            { headers: { 'Accept-Language': 'vi' } }
          );
          const data = await res.json();
          const addr = data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          // Shorten to road + district
          const parts = data.address;
          const short = [
            parts?.road,
            parts?.suburb || parts?.quarter,
            parts?.city_district || parts?.district
          ].filter(Boolean).join(', ') || addr.split(',').slice(0, 2).join(',');

          setLocationState({
            lat: latitude,
            lng: longitude,
            address: short || addr,
            status: 'granted'
          });
        } catch {
          setLocationState({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            status: 'granted'
          });
        }
      },
      (err) => {
        setLocationState(prev => ({
          ...prev,
          status: 'denied',
          address: err.code === 1 ? 'Quyền vị trí bị từ chối' : 'Không lấy được vị trí'
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleOpenLocationModal = () => {
    setShowLocationModal(true);
    if (locationState.status === 'idle') {
      requestLocation();
    }
  };

  const mapSrc = locationState.lat && locationState.lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${locationState.lng - 0.01},${locationState.lat - 0.008},${locationState.lng + 0.01},${locationState.lat + 0.008}&layer=mapnik&marker=${locationState.lat},${locationState.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=105.8315,21.0195,105.8515,21.0315&layer=mapnik`;

  return (
    <>
      <header style={{
        background: 'var(--primary-navy)',
        color: '#ffffff',
        padding: '10px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Brand Logo FIX247 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
                flexShrink: 0
              }}>
                <img
                  src="/logo-fix247.png"
                  alt="FIX247 Logo"
                  style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = 'linear-gradient(135deg, #102a43, #1e3a8a)';
                      parent.innerHTML = '<span style="color:#f97316;font-weight:900;font-size:14px;letter-spacing:-1px">FIX<span style="color:#ffffff">247</span></span>';
                    }
                  }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1 }}>
                    <span style={{ color: '#f97316' }}>FIX</span>
                    <span style={{ color: '#ffffff' }}>247</span>
                  </h1>
                  <span className="badge badge-green" style={{ fontSize: '9px', padding: '1px 5px' }}>
                    AI
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#93c5fd' }}>
                  Chụp lỗi – Biết giá – Chọn đúng thợ
                </span>
              </div>
            </div>

            {/* Location Picker with GPS - Clickable to open map */}
            <div
              onClick={handleOpenLocationModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: locationState.status === 'granted'
                  ? 'rgba(74, 222, 128, 0.1)'
                  : 'rgba(255, 255, 255, 0.1)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                cursor: 'pointer',
                border: locationState.status === 'granted'
                  ? '1px solid rgba(74, 222, 128, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.2s'
              }}
            >
              {locationState.status === 'loading' ? (
                <Loader size={16} color="#fbbf24" style={{ animation: 'spin 1s linear infinite' }} />
              ) : locationState.status === 'granted' ? (
                <Navigation size={16} color="#4ade80" />
              ) : (
                <MapPin size={16} color="#4ade80" />
              )}
              <div style={{ maxWidth: '200px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>
                  {locationState.status === 'granted' ? '📍 Vị trí GPS xác thực:' : 'Vị trí phục vụ:'}
                </span>
                <strong style={{
                  color: '#ffffff',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '12px'
                }}>
                  {locationState.address}
                </strong>
              </div>
              <ChevronDown size={14} color="#94a3b8" />
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '420px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Tìm lỗi xe, sửa đường ống nước, bảo dưỡng điều hòa..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* CAMERA AI */}
            <button
              type="button"
              onClick={onOpenLiveCamera}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                padding: '9px 16px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)',
                border: '1px solid #60a5fa'
              }}
            >
              <Camera size={18} />
              <span>Camera AI Quét Lỗi</span>
              <span style={{
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '999px',
                fontWeight: 800
              }}>
                LIVE
              </span>
            </button>

            {/* Emergency Hotline */}
            <a
              href="tel:19008899"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <PhoneCall size={14} />
              <span>SOS 1900 8899</span>
            </a>

            {/* User Profile or Login */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f97316' }}
                />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{user.name.split(' ').slice(-1)[0]}</div>
                  <button
                    type="button"
                    onClick={onLogout}
                    style={{ fontSize: '11px', color: '#fca5a5', fontWeight: 600 }}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                style={{
                  background: '#ffffff',
                  color: '#102a43',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                Đăng Nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Location Map Modal */}
      {showLocationModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          padding: '16px'
        }} onClick={() => setShowLocationModal(false)}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '540px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #102a43, #1e3a8a)',
              color: '#fff',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>📍 Xác Thực Vị Trí Của Bạn</h3>
                <p style={{ fontSize: '12px', color: '#93c5fd', marginTop: '2px' }}>
                  Giúp FIX247 tìm thợ gần bạn nhất
                </p>
              </div>
              <button onClick={() => setShowLocationModal(false)} style={{ color: '#94a3b8', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Status Banner */}
            <div style={{ padding: '16px 24px 0' }}>
              {locationState.status === 'loading' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#fffbeb', borderRadius: '10px', padding: '12px 16px',
                  border: '1px solid #fde68a', marginBottom: '12px'
                }}>
                  <Loader size={18} color="#f59e0b" />
                  <div>
                    <div style={{ fontWeight: 700, color: '#92400e', fontSize: '13px' }}>Đang định vị GPS...</div>
                    <div style={{ fontSize: '12px', color: '#78350f' }}>Vui lòng cho phép quyền truy cập vị trí trên trình duyệt</div>
                  </div>
                </div>
              )}
              {locationState.status === 'granted' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#f0fdf4', borderRadius: '10px', padding: '12px 16px',
                  border: '1px solid #bbf7d0', marginBottom: '12px'
                }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <div>
                    <div style={{ fontWeight: 700, color: '#15803d', fontSize: '13px' }}>✅ Vị trí đã xác thực thành công!</div>
                    <div style={{ fontSize: '12px', color: '#166534' }}>{locationState.address}</div>
                    {locationState.lat && (
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                        GPS: {locationState.lat.toFixed(6)}, {locationState.lng?.toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(locationState.status === 'denied' || locationState.status === 'error') && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#fef2f2', borderRadius: '10px', padding: '12px 16px',
                  border: '1px solid #fecaca', marginBottom: '12px'
                }}>
                  <AlertCircle size={18} color="#dc2626" />
                  <div>
                    <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '13px' }}>Không lấy được vị trí GPS</div>
                    <div style={{ fontSize: '12px', color: '#7f1d1d' }}>{locationState.address}</div>
                  </div>
                </div>
              )}
              {locationState.status === 'idle' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#eff6ff', borderRadius: '10px', padding: '12px 16px',
                  border: '1px solid #bfdbfe', marginBottom: '12px'
                }}>
                  <MapPin size={18} color="#2563eb" />
                  <div style={{ fontSize: '13px', color: '#1e40af', fontWeight: 600 }}>
                    Nhấn nút bên dưới để xác thực vị trí GPS của bạn
                  </div>
                </div>
              )}
            </div>

            {/* Map Iframe */}
            <div style={{ padding: '0 24px', marginBottom: '16px' }}>
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #e2e8f0',
                position: 'relative',
                height: '260px'
              }}>
                <iframe
                  ref={mapIframeRef}
                  src={mapSrc}
                  title="Bản đồ vị trí"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  loading="lazy"
                  allowFullScreen
                />
                {locationState.status === 'loading' && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,255,255,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: '8px'
                  }}>
                    <Loader size={32} color="#2563eb" />
                    <span style={{ fontSize: '13px', color: '#1e40af', fontWeight: 600 }}>Đang tải bản đồ...</span>
                  </div>
                )}
                {/* Map attribution overlay */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(16, 42, 67, 0.85)',
                  color: '#ffffff',
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)'
                }}>
                  {locationState.status === 'granted' ? '📍 Vị trí thực của bạn' : '🗺️ OpenStreetMap'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px' }}>
              {locationState.status !== 'granted' ? (
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={locationState.status === 'loading'}
                  style={{
                    flex: 1,
                    background: locationState.status === 'loading'
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: locationState.status === 'loading' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {locationState.status === 'loading' ? (
                    <><Loader size={16} />Đang định vị...</>
                  ) : (
                    <><Navigation size={16} />Xác Thực Vị Trí GPS</>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={requestLocation}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    color: '#ffffff',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Navigation size={16} />Cập Nhật Lại Vị Trí
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                style={{
                  padding: '13px 20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Đóng
              </button>
            </div>

            {/* Privacy note */}
            <div style={{
              padding: '12px 24px 20px',
              borderTop: '1px solid #f1f5f9',
              fontSize: '11px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🔒 Vị trí chỉ dùng để tìm thợ gần nhất, không lưu trữ hay chia sẻ theo chính sách FIX247.
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};
