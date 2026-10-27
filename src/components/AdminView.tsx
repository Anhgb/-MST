import React, { useState } from 'react';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { ShieldCheck, BarChart3, Users, DollarSign, Wrench, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Plus, Edit } from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'technicians' | 'disputes'>('overview');

  // Managed price items from PRD line 630-631
  const [priceItems, setPriceItems] = useState([
    { id: 'PI-01', service: 'Sửa Xe Máy', name: 'Công kiểm tra & sửa hệ thống điện/sạc', price: 50000, partsMin: 80000, partsMax: 290000, travel: 20000 },
    { id: 'PI-02', service: 'Sửa Xe Máy', name: 'Thay lốp không săm Tubeless tận nơi', price: 60000, partsMin: 320000, partsMax: 480000, travel: 20000 },
    { id: 'PI-03', service: 'Nước & Đường Ống', name: 'Xử lý rò rỉ nứt vỡ co ống PVC âm/nổi', price: 110000, partsMin: 35000, partsMax: 90000, travel: 20000 },
    { id: 'PI-04', service: 'Điện Dân Dụng', name: 'Khắc phục chập cháy Aptomat/dây dẫn', price: 120000, partsMin: 50000, partsMax: 150000, travel: 20000 },
    { id: 'PI-05', service: 'Sửa Ô Tô', name: 'Kích nổ ắc quy & kiểm tra dòng sạc tận nơi', price: 150000, partsMin: 0, partsMax: 0, travel: 30000 },
    { id: 'PI-06', service: 'Điện Lạnh', name: 'Vệ sinh & nạp gas điều hòa R32/R410', price: 180000, partsMin: 120000, partsMax: 250000, travel: 25000 }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b1d30 0%, #1e3a8a 100%)',
        color: '#ffffff',
        padding: '24px 28px',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(16, 42, 67, 0.15)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-navy" style={{ background: '#dc2626', color: '#fff', fontSize: '11px' }}>
              ADMIN CONSOLE
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
              Bảng Quản Trị Hệ Thống FixNow AI
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#93c5fd', marginTop: '4px' }}>
            Giám sát thời gian thực: Điều phối thợ, quản lý bảng giá cố định, độ chính xác AI & đối soát thanh toán
          </p>
        </div>

        {/* Tab navigation pills */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '14px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'overview' ? '#ffffff' : 'transparent',
              color: activeTab === 'overview' ? '#102a43' : '#ffffff'
            }}
          >
            Tổng Quan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'pricing' ? '#ffffff' : 'transparent',
              color: activeTab === 'pricing' ? '#102a43' : '#ffffff'
            }}
          >
            Bảng Giá Cố Định (PRD 630)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('disputes')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'disputes' ? '#ffffff' : 'transparent',
              color: activeTab === 'disputes' ? '#102a43' : '#ffffff'
            }}
          >
            Khiếu Nại & Đối Soát
          </button>
        </div>
      </div>

      {/* Tab 1: Overview Dashboard */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                <span>Doanh thu tháng này</span>
                <DollarSign size={18} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#102a43', margin: '8px 0 4px' }}>
                142.850.000 ₫
              </h3>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>↑ 18.4% so với tháng trước</span>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                <span>Tổng đơn cứu hộ & sửa chữa</span>
                <Wrench size={18} color="#2563eb" />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#102a43', margin: '8px 0 4px' }}>
                1.420 đơn
              </h3>
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>Tỷ lệ hoàn thành: 98.6%</span>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                <span>Độ chính xác Camera AI</span>
                <Sparkles size={18} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#102a43', margin: '8px 0 4px' }}>
                96.8%
              </h3>
              <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>Chẩn đoán đúng lỗi trực quan</span>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                <span>Thợ trực tuyến sẵn sàng</span>
                <Users size={18} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#102a43', margin: '8px 0 4px' }}>
                86 thợ
              </h3>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>Thời gian đến TB: 14.2 phút</span>
            </div>
          </div>

          {/* Real-time Order Log */}
          <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#102a43', marginBottom: '14px' }}>
              Nhật Ký Điều Phối & Đơn Hàng Mới Nhất (Audit Logs - PRD 665)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: '14:32:10', event: 'Khách hàng Đặng Minh Khang xác nhận khóa giá báo giá QT-99201 (360.000 ₫)' },
                { time: '14:32:45', event: 'Thuật toán điều phối gán đơn cho Thợ Nguyễn Văn Hùng (khoảng cách 0.8km, ETA 12p)' },
                { time: '14:33:02', event: 'Thợ Nguyễn Văn Hùng xác nhận nhận đơn và bắt đầu di chuyển qua GPS' },
                { time: '14:48:15', event: 'Thợ đã đến điểm hẹn số 72 Trần Đại Nghĩa và chụp ảnh xác nhận hiện trường' },
                { time: '15:25:30', event: 'Khách hàng nghiệm thu đạt chuẩn và thanh toán VietQR thành công 360.000 ₫' }
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '13px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>{log.time}</span>
                  <span style={{ color: '#334155' }}>{log.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fixed Price Matrix (PRD line 630-631) */}
      {activeTab === 'pricing' && (
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43' }}>
                Bảng Giá Dịch Vụ Cố Định Chuẩn Hóa Toàn Hệ Thống (service_price_items)
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Tuân thủ PRD 6.4 & 6.5: Tổng tiền đơn hàng được tính hoàn toàn từ bảng giá do hệ thống kiểm soát, mô hình AI không được tự ý đặt giá.
              </p>
            </div>
            <button
              type="button"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} />
              <span>Thêm Hạng Mục Giá Mới</span>
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Mã</th>
                <th style={{ padding: '12px 14px' }}>Dịch vụ</th>
                <th style={{ padding: '12px 14px' }}>Hạng mục công việc</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Công thợ</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Vật tư tham chiếu</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Phí di chuyển</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {priceItems.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2563eb' }}>{item.id}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.service}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#102a43' }}>{item.name}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>
                    {item.price.toLocaleString('vi-VN')} ₫
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                    {item.partsMin.toLocaleString('vi-VN')} - {item.partsMax.toLocaleString('vi-VN')} ₫
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                    {item.travel.toLocaleString('vi-VN')} ₫
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button type="button" style={{ color: '#2563eb', padding: '4px' }}>
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Disputes & Support Tickets (PRD 663) */}
      {activeTab === 'disputes' && (
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>
            Quản Lý Khiếu Nại & Đối Soát Giao Dịch (support_tickets)
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
            Chính sách không phát sinh chi phí: Nếu thợ tự ý vòi thêm tiền ngoài giá cố định, hệ thống sẽ hoàn tiền 100% cho khách và xử lý kỷ luật thợ.
          </p>

          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} color="#16a34a" />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>
                Hệ Thống Đang Vận Hành Ổn Định
              </h4>
              <p style={{ fontSize: '12px', color: '#15803d' }}>
                Hiện tại không có tranh chấp hay khiếu nại nào chưa xử lý trong 24 giờ qua. Tỷ lệ hài lòng đạt 99.2%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
