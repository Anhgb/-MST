import React, { useState, useEffect } from 'react';
import { Order, Technician, OrderStatus } from '../types';
import { MOCK_TECHNICIANS } from '../data/mockData';
import { CheckCircle2, Phone, MessageSquare, MapPin, Navigation, ShieldCheck, Clock, Star, AlertCircle, Wrench, ChevronRight, X } from 'lucide-react';

interface TechnicianDispatchProps {
  order: Order;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenPayment: (order: Order) => void;
  onOpenChat: (order: Order) => void;
  onClose: () => void;
}

export const TechnicianDispatch: React.FC<TechnicianDispatchProps> = ({
  order,
  onUpdateOrderStatus,
  onOpenPayment,
  onOpenChat,
  onClose
}) => {
  const [assignedTech, setAssignedTech] = useState<Technician>(order.technician || MOCK_TECHNICIANS[0]);
  const [dispatchStage, setDispatchStage] = useState<OrderStatus>(order.status);
  const [etaRemaining, setEtaRemaining] = useState(assignedTech.etaMinutes);
  const [distanceRemaining, setDistanceRemaining] = useState(assignedTech.distanceKm);

  // Status mapping list for progress bar (PRD 4.3)
  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'dang_tim_tho', label: 'Tìm thợ' },
    { key: 'tho_da_nhan', label: 'Thợ đã nhận' },
    { key: 'tho_dang_den', label: 'Đang di chuyển' },
    { key: 'tho_da_den', label: 'Đã đến nơi' },
    { key: 'dang_sua', label: 'Đang sửa chữa' },
    { key: 'cho_nghiem_thu', label: 'Nghiệm thu' },
    { key: 'hoan_thanh', label: 'Hoàn thành' },
    { key: 'da_thanh_toan', label: 'Đã thanh toán' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === dispatchStage);

  // Real-time automated progression simulation for demo
  useEffect(() => {
    let timer: any;
    if (dispatchStage === 'dang_tim_tho') {
      timer = setTimeout(() => {
        setDispatchStage('tho_da_nhan');
        onUpdateOrderStatus(order.id, 'tho_da_nhan');
      }, 2500);
    } else if (dispatchStage === 'tho_da_nhan') {
      timer = setTimeout(() => {
        setDispatchStage('tho_dang_den');
        onUpdateOrderStatus(order.id, 'tho_dang_den');
      }, 3000);
    } else if (dispatchStage === 'tho_dang_den') {
      const interval = setInterval(() => {
        setEtaRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setDispatchStage('tho_da_den');
            onUpdateOrderStatus(order.id, 'tho_da_den');
            return 0;
          }
          return prev - 2;
        });
        setDistanceRemaining(prev => Math.max(0, Number((prev - 0.2).toFixed(1))));
      }, 2000);
      return () => clearInterval(interval);
    }
    return () => clearTimeout(timer);
  }, [dispatchStage]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9997,
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
        {/* Top Header */}
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
                ĐƠN HÀNG #{order.id}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                Theo Dõi Tiến Độ & Điều Phối Thợ Trực Tiếp
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#93c5fd', marginTop: '4px' }}>
              Dịch vụ: <strong>{order.serviceType}</strong> • {order.deviceInfo}
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

        {/* 11 Business Statuses Progress Tracker Bar (PRD 4.3 & line 154-171) */}
        <div style={{ background: '#f8fafc', padding: '16px 28px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '20px',
              right: '20px',
              height: '3px',
              background: '#e2e8f0',
              zIndex: 1
            }} />
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '20px',
              width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
              height: '3px',
              background: '#2563eb',
              transition: 'width 0.5s ease',
              zIndex: 2
            }} />

            {steps.map((st, idx) => {
              const isPastOrCurrent = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;
              return (
                <div key={st.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isPastOrCurrent ? '#2563eb' : '#ffffff',
                    border: isPastOrCurrent ? '2px solid #2563eb' : '2px solid #cbd5e1',
                    color: isPastOrCurrent ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    boxShadow: isCurrent ? '0 0 12px rgba(37, 99, 235, 0.5)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: isCurrent ? 800 : 500,
                    color: isCurrent ? '#2563eb' : '#64748b',
                    marginTop: '6px',
                    textAlign: 'center'
                  }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content: Map Tracking Radar Simulation (Left) + Technician Profile & Actions (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '24px',
          padding: '24px 28px'
        }}>
          {/* Left: Map Radar Simulation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              height: '320px',
              background: '#1e293b',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.6)',
              border: '1px solid #334155'
            }}>
              {/* Stylized Map Grid */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), radial-gradient(rgba(59, 130, 246, 0.1) 1px, #0f172a 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }} />

              {/* Radar sweep when searching */}
              {dispatchStage === 'dang_tim_tho' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(15, 23, 42, 0.7)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '3px solid #3b82f6',
                    borderTopColor: 'transparent',
                    animation: 'spin 1.2s linear infinite'
                  }} />
                  <p style={{ color: '#93c5fd', fontSize: '14px', fontWeight: 700 }}>
                    Đang quét tìm thợ có chuyên môn cao gần bạn nhất...
                  </p>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                    Áp dụng thuật toán xếp hạng khoảng cách, đánh giá 5 sao & ETA (PRD 7.2)
                  </span>
                </div>
              )}

              {/* Customer Pin */}
              <div style={{
                position: 'absolute',
                bottom: '35%',
                left: '30%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  marginBottom: '4px'
                }}>
                  Vị trí của bạn
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  border: '3px solid #ffffff',
                  boxShadow: '0 0 15px #3b82f6'
                }} />
              </div>

              {/* Technician Pin with GPS movement */}
              {dispatchStage !== 'dang_tim_tho' && (
                <div style={{
                  position: 'absolute',
                  bottom: dispatchStage === 'tho_da_den' || dispatchStage === 'dang_sua' || dispatchStage === 'cho_nghiem_thu' ? '35%' : '65%',
                  left: dispatchStage === 'tho_da_den' || dispatchStage === 'dang_sua' || dispatchStage === 'cho_nghiem_thu' ? '30%' : '70%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <div style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Navigation size={12} />
                    <span>Thợ {assignedTech.name.split(' ')[0]} ({etaRemaining}p)</span>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '3px solid #ffffff',
                    boxShadow: '0 0 20px #22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    <Wrench size={16} />
                  </div>
                </div>
              )}

              {/* Map Info Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(6px)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontWeight: 700 }}>
                  <Navigation size={14} />
                  <span>Khoảng cách: {distanceRemaining} km</span>
                  <span>•</span>
                  <span>Dự kiến đến: {etaRemaining} phút</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  Điểm đến: {order.customerAddress}
                </div>
              </div>
            </div>

            {/* Quick Actions during repair */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onOpenChat(order)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <MessageSquare size={16} color="#2563eb" />
                <span>Nhắn Tin Với Thợ</span>
              </button>

              <a
                href={`tel:${assignedTech.phone}`}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none'
                }}
              >
                <Phone size={16} color="#16a34a" />
                <span>Gọi Điện Trực Tiếp</span>
              </a>
            </div>
          </div>

          {/* Right: Assigned Technician Profile & Step Controller */}
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
              <span className="badge badge-blue" style={{ marginBottom: '12px' }}>
                KỸ THUẬT VIÊN ĐƯỢC ĐIỀU PHỐI (PRD 7)
              </span>

              {/* Technician Info Card */}
              <div style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <img
                  src={assignedTech.avatar}
                  alt={assignedTech.name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#102a43' }}>
                      {assignedTech.name}
                    </h4>
                    <span className="badge badge-green" style={{ padding: '2px 6px', fontSize: '10px' }}>
                      ĐÃ XÁC MINH
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={14} fill="#f59e0b" />
                      <span style={{ marginLeft: '2px' }}>{assignedTech.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{assignedTech.completedJobs} đơn thành công</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, marginTop: '4px' }}>
                    Chuyên môn: {assignedTech.specialty.join(', ')}
                  </div>
                </div>
              </div>

              {/* Current Job Status Notification */}
              <div style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  TRẠNG THÁI HIỆN TẠI:
                </span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} />
                  <span>
                    {dispatchStage === 'dang_tim_tho' && 'Hệ thống đang điều phối thợ phù hợp...'}
                    {dispatchStage === 'tho_da_nhan' && 'Thợ đã tiếp nhận đơn hàng!'}
                    {dispatchStage === 'tho_dang_den' && `Thợ đang di chuyển đến địa chỉ (còn ${etaRemaining} phút)`}
                    {dispatchStage === 'tho_da_den' && 'Thợ đã đến điểm hẹn & bắt đầu kiểm tra hiện trường'}
                    {dispatchStage === 'dang_sua' && 'Thợ đang tiến hành sửa chữa theo báo giá cố định'}
                    {dispatchStage === 'cho_nghiem_thu' && 'Công việc sửa chữa đã xong! Mời bạn nghiệm thu'}
                    {dispatchStage === 'hoan_thanh' && 'Đã nghiệm thu xong, sẵn sàng thanh toán'}
                    {dispatchStage === 'da_thanh_toan' && 'Đơn hàng đã hoàn tất & thanh toán thành công'}
                  </span>
                </div>
              </div>

              {/* Price Reminder */}
              <div style={{
                background: '#eff6ff',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', display: 'block' }}>
                    GIÁ TRỌN GÓI ĐÃ KHÓA:
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a8a' }}>
                    {order.quote.totalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <span className="badge badge-green" style={{ fontSize: '11px' }}>
                  100% KHÔNG PHÁT SINH
                </span>
              </div>
            </div>

            {/* Stage Transition Simulation Buttons (allowing user to test progression smoothly) */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dispatchStage === 'tho_da_den' && (
                <button
                  type="button"
                  onClick={() => {
                    setDispatchStage('dang_sua');
                    onUpdateOrderStatus(order.id, 'dang_sua');
                  }}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}
                >
                  Xác Nhận Thợ Bắt Đầu Sửa Chữa
                </button>
              )}

              {dispatchStage === 'dang_sua' && (
                <button
                  type="button"
                  onClick={() => {
                    setDispatchStage('cho_nghiem_thu');
                    onUpdateOrderStatus(order.id, 'cho_nghiem_thu');
                  }}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}
                >
                  Hoàn Tất Sửa Chữa – Mời Nghiệm Thu
                </button>
              )}

              {(dispatchStage === 'cho_nghiem_thu' || dispatchStage === 'hoan_thanh') && (
                <button
                  type="button"
                  onClick={() => onOpenPayment(order)}
                  style={{
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
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                  }}
                >
                  <span>Nghiệm Thu Hài Lòng & Thanh Toán Ngay</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
