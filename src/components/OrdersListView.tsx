import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, Navigation, CheckCircle2, ShieldCheck, FileText, ArrowRight, Star, CreditCard } from 'lucide-react';

interface OrdersListViewProps {
  orders: Order[];
  filterType: 'active' | 'history' | 'warranty';
  onTrackOrder: (order: Order) => void;
  onOpenPayment: (order: Order) => void;
  onOpenInvoiceWarranty: (order: Order) => void;
}

export const OrdersListView: React.FC<OrdersListViewProps> = ({
  orders,
  filterType,
  onTrackOrder,
  onOpenPayment,
  onOpenInvoiceWarranty,
}) => {
  const filteredOrders = orders.filter(o => {
    if (filterType === 'active') {
      return o.status !== 'hoan_thanh' && o.status !== 'da_thanh_toan' && o.status !== 'da_huy';
    }
    if (filterType === 'warranty') {
      return o.status === 'da_thanh_toan' || o.warrantyCode;
    }
    return true; // history
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'dang_tim_tho':
        return <span className="badge badge-warning">Đang tìm thợ</span>;
      case 'tho_da_nhan':
        return <span className="badge badge-blue">Thợ đã nhận việc</span>;
      case 'tho_dang_den':
        return <span className="badge badge-blue">Thợ đang di chuyển</span>;
      case 'tho_da_den':
        return <span className="badge badge-blue">Thợ đã đến nơi</span>;
      case 'dang_sua':
        return <span className="badge badge-warning">Đang sửa chữa</span>;
      case 'cho_nghiem_thu':
        return <span className="badge badge-green">Mời nghiệm thu</span>;
      case 'hoan_thanh':
        return <span className="badge badge-green">Đã xong việc</span>;
      case 'da_thanh_toan':
        return <span className="badge badge-green">Đã thanh toán</span>;
      default:
        return <span className="badge badge-navy">Đang xử lý</span>;
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43' }}>
          {filterType === 'active' ? 'Đơn Hàng Đang Xử Lý & Theo Dõi Tiến Độ' :
           filterType === 'warranty' ? 'Sổ Bảo Hành Điện Tử Của Bạn (e-Warranty)' :
           'Lịch Sử Sửa Chữa & Hóa Đơn Điện Tử'}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b' }}>
          {filterType === 'active' ? 'Theo dõi thời gian thực vị trí thợ, bước thực hiện và nghiệm thu công việc' :
           filterType === 'warranty' ? 'Mọi linh kiện và công việc đều được bảo hành từ 6 đến 12 tháng tại nhà' :
           'Xem lại chi tiết từng hạng mục, bảng giá cố định đã duyệt và hóa đơn VAT'}
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
          <p style={{ fontSize: '14px' }}>Không có đơn hàng nào trong mục này.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '18px 20px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr',
                gap: '16px',
                alignItems: 'center',
                background: '#f8fafc'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#102a43' }}>
                    #{order.id}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
                  {order.serviceType}
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {order.deviceInfo}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>KỸ THUẬT VIÊN:</span>
                <strong style={{ fontSize: '13px', color: '#102a43' }}>
                  {order.technician?.name || 'Hệ thống đang điều phối'}
                </strong>
                <p style={{ fontSize: '11px', color: '#64748b' }}>
                  {order.customerAddress.split(',')[0]}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>TỔNG GIÁ CỐ ĐỊNH:</span>
                <strong style={{ fontSize: '16px', color: '#16a34a' }}>
                  {order.quote.totalPrice.toLocaleString('vi-VN')} ₫
                </strong>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                  PT: {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'Chưa chọn'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                {order.status !== 'hoan_thanh' && order.status !== 'da_thanh_toan' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        padding: '9px 14px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Navigation size={14} />
                      <span>Theo Dõi Thợ</span>
                    </button>
                    {order.status === 'cho_nghiem_thu' && (
                      <button
                        type="button"
                        onClick={() => onOpenPayment(order)}
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          padding: '9px 14px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        Thanh Toán
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenInvoiceWarranty(order)}
                    style={{
                      background: '#ffffff',
                      color: '#102a43',
                      border: '1px solid #cbd5e1',
                      padding: '9px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={14} color="#2563eb" />
                    <span>Xem Hóa Đơn & BH</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
