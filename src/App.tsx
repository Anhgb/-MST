import React, { useState } from 'react';
import { User, UserRole, Order, OrderStatus, DetectedDefect, Quote, Technician } from './types';
import { INITIAL_USER, INITIAL_ORDERS, MOCK_TECHNICIANS, SERVICE_CATEGORIES } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SliderBanner } from './components/SliderBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedTechnicians } from './components/FeaturedTechnicians';
import { AICameraScanner } from './components/AICameraScanner';
import { AIDiagnosisModal } from './components/AIDiagnosisModal';
import { TechnicianDispatch } from './components/TechnicianDispatch';
import { PaymentModal } from './components/PaymentModal';
import { InvoiceWarrantyModal } from './components/InvoiceWarrantyModal';
import { ChatModal } from './components/ChatModal';
import { OrdersListView } from './components/OrdersListView';
import { TechnicianView } from './components/TechnicianView';
import { AdminView } from './components/AdminView';
import { PricingView } from './components/PricingView';
import { AuthModal } from './components/AuthModal';
import { DatabaseViewerModal } from './components/DatabaseViewerModal';
import { dbInstance } from './database/db';

export const App: React.FC = () => {
  // Current user state (starts with default customer account for instant demonstration)
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Orders repository
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order>(INITIAL_ORDERS[0]);

  // Modal open states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Data passed from Camera AI to Diagnosis
  const [detectedDefect, setDetectedDefect] = useState<DetectedDefect | null>(null);
  const [detectedPhotoUrl, setDetectedPhotoUrl] = useState<string | null>(null);

  // Role switching
  const handleSwitchRole = (role: UserRole) => {
    if (role === 'customer') {
      setUser(INITIAL_USER);
    } else if (role === 'technician') {
      setUser({
        id: 'usr-tech-01',
        name: 'Nguyễn Văn Hùng (Kỹ Thuật Viên)',
        email: 'hung.nguyen@fixnow.ai',
        phone: '0912 345 678',
        role: 'technician',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        address: '88 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội'
      });
    } else {
      setUser({
        id: 'usr-admin-01',
        name: 'Quản Trị Viên Hệ Thống',
        email: 'admin@fixnow.ai',
        phone: '0900 888 999',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        address: 'Tòa nhà FixNow AI, Cầu Giấy, Hà Nội'
      });
    }
  };

  // 1. Camera AI callback when defect is recognized
  const handleApplyDefectFromCamera = (defect: DetectedDefect, photoUrl: string) => {
    setDetectedDefect(defect);
    setDetectedPhotoUrl(photoUrl);
    setIsDiagnosisOpen(true);
  };

  // 2. Open diagnosis for a specific category
  const handleSelectCategory = (categoryId?: string) => {
    if (categoryId) {
      setDetectedDefect(null);
    }
    setDetectedPhotoUrl(null);
    setIsDiagnosisOpen(true);
  };

  // 3. User agrees to Fixed-Price Quote -> Create Order & Start Dispatch
  const handleConfirmAndFindTechnician = (
    quote: Quote,
    details: {
      category: string;
      deviceInfo: string;
      symptoms: string;
      address: string;
      urgency: string;
      photoUrl?: string;
    }
  ) => {
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerId: user?.id || 'usr-customer-01',
      customerName: user?.name || 'Đặng Minh Khang',
      customerPhone: user?.phone || '0989 123 456',
      customerAddress: details.address,
      serviceType: quote.serviceCategory,
      deviceInfo: details.deviceInfo,
      symptoms: details.symptoms,
      imageProofUrl: details.photoUrl,
      detectedDefectName: quote.detectedDefects[0],
      status: 'dang_tim_tho',
      quote: quote,
      technician: MOCK_TECHNICIANS[0],
      paymentStatus: 'unpaid',
      createdAt: new Date().toLocaleString('vi-VN')
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);

    // Synchronize to Database (PRD Section 14)
    dbInstance.insertRecord('repair_requests', {
      id: `REQ-${newOrder.id.slice(-6)}`,
      customer_id: newOrder.customerId,
      category_id: details.category,
      device_info: details.deviceInfo,
      symptoms_text: details.symptoms,
      urgency_level: details.urgency,
      service_address: details.address,
      created_at: newOrder.createdAt
    });

    if (quote.detectedDefects.length > 0) {
      dbInstance.insertRecord('ai_diagnoses', {
        id: `AI-DIAG-${newOrder.id.slice(-6)}`,
        request_id: `REQ-${newOrder.id.slice(-6)}`,
        defect_name: quote.detectedDefects[0],
        category: details.category,
        severity: detectedDefect?.severity || 'canh_bao',
        confidence_score: quote.confidence,
        description: details.symptoms,
        safety_warning: quote.safetyWarnings[0] || '',
        created_at: newOrder.createdAt
      });
    }

    dbInstance.insertRecord('quotes', {
      id: quote.id,
      version: quote.version,
      total_price: quote.totalPrice,
      estimated_time_min: quote.estimatedTimeMin,
      warranty_months: quote.warrantyMonths,
      is_locked: quote.isLocked,
      customer_accepted: true,
      accepted_at: newOrder.createdAt,
      created_at: quote.createdAt
    });

    dbInstance.insertRecord('orders', {
      id: newOrder.id,
      customer_id: newOrder.customerId,
      quote_id: quote.id,
      technician_id: 'tech-01',
      status: newOrder.status,
      total_amount: quote.totalPrice,
      payment_status: 'unpaid',
      created_at: newOrder.createdAt
    });

    setIsDiagnosisOpen(false);
    setIsDispatchOpen(true);
  };

  // 4. Update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          completedAt: newStatus === 'hoan_thanh' || newStatus === 'da_thanh_toan' ? new Date().toLocaleString('vi-VN') : o.completedAt
        };
      }
      return o;
    }));

    if (selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({
        ...prev,
        status: newStatus,
        completedAt: newStatus === 'hoan_thanh' || newStatus === 'da_thanh_toan' ? new Date().toLocaleString('vi-VN') : prev.completedAt
      }));
    }

    dbInstance.updateRecord('orders', 'id', orderId, { status: newStatus });
    dbInstance.insertRecord('order_status_history', {
      id: Date.now(),
      order_id: orderId,
      to_status: newStatus,
      changed_by: user?.name || 'system',
      created_at: new Date().toLocaleString('vi-VN')
    });
  };

  // 5. Payment success callback
  const handlePaymentSuccess = (orderId: string, method: 'cash' | 'vietqr' | 'visa') => {
    const warrantyCode = `BH-2026-${orderId.slice(-6)}`;
    const nowStr = new Date().toLocaleString('vi-VN');

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'da_thanh_toan',
          paymentMethod: method,
          paymentStatus: 'paid',
          warrantyCode: warrantyCode,
          completedAt: nowStr
        };
      }
      return o;
    }));

    setSelectedOrder(prev => ({
      ...prev,
      status: 'da_thanh_toan',
      paymentMethod: method,
      paymentStatus: 'paid',
      warrantyCode: warrantyCode,
      completedAt: nowStr
    }));

    // Synchronize to Database tables (PRD Section 14)
    dbInstance.updateRecord('orders', 'id', orderId, {
      status: 'da_thanh_toan',
      payment_method: method,
      payment_status: 'paid',
      warranty_code: warrantyCode,
      completed_at: nowStr
    });

    dbInstance.insertRecord('payments', {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      order_id: orderId,
      method: method,
      amount: selectedOrder.quote.totalPrice,
      status: 'completed',
      paid_at: nowStr
    });

    dbInstance.insertRecord('payment_events', {
      id: Date.now(),
      payment_id: `PAY-${Date.now().toString().slice(-6)}`,
      event_type: 'settled',
      payload_json: JSON.stringify({ method, amount: selectedOrder.quote.totalPrice, verified: true }),
      created_at: nowStr
    });

    dbInstance.insertRecord('invoices', {
      id: `INV-${orderId.slice(-6)}`,
      order_id: orderId,
      invoice_number: `HD-FN-${orderId.slice(-5)}`,
      tax_code: '0109988776',
      subtotal: selectedOrder.quote.totalPrice,
      total: selectedOrder.quote.totalPrice,
      issued_at: nowStr
    });

    dbInstance.insertRecord('warranties', {
      id: `WAR-${orderId.slice(-6)}`,
      order_id: orderId,
      warranty_code: warrantyCode,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
      terms_text: 'Bảo hành tận nơi 1-1 cho toàn bộ hạng mục đã sửa',
      status: 'active'
    });

    setIsPaymentOpen(false);
    setIsDispatchOpen(false);
    setIsInvoiceOpen(true);
  };

  // 6. Review callback
  const handleSubmitReview = (orderId: string, rating: number, comment: string) => {
    const nowStr = new Date().toLocaleString('vi-VN');
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          review: { rating, comment, createdAt: nowStr }
        };
      }
      return o;
    }));

    dbInstance.insertRecord('reviews', {
      id: Date.now(),
      order_id: orderId,
      customer_id: user?.id || 'usr-customer-01',
      technician_id: 'tech-01',
      rating,
      comment,
      created_at: nowStr
    });
  };

  // 7. Booking a specific technician directly
  const handleBookTechnician = (tech: Technician) => {
    setSelectedOrder(prev => ({
      ...prev,
      technician: tech
    }));
    setIsDiagnosisOpen(true);
  };

  const activeOrders = orders.filter(o => o.status !== 'hoan_thanh' && o.status !== 'da_thanh_toan' && o.status !== 'da_huy');

  return (
    <div className="app-layout">
      {/* Sticky Header */}
      <Header
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setUser(null)}
        onOpenLiveCamera={() => setIsCameraOpen(true)}
        onOpenDatabase={() => setIsDbOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      <div className="main-content-wrapper">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenLiveCamera={() => setIsCameraOpen(true)}
          onOpenDiagnosis={() => setIsDiagnosisOpen(true)}
          onOpenDatabase={() => setIsDbOpen(true)}
          activeOrderCount={activeOrders.length}
        />

        {/* Content Body */}
        <main className="content-body">
          {/* Technician Role View */}
          {user?.role === 'technician' ? (
            <TechnicianView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenChat={(order) => { setSelectedOrder(order); setIsChatOpen(true); }}
            />
          ) : user?.role === 'admin' ? (
            <AdminView />
          ) : (
            /* Customer Main View */
            <>
              {currentTab === 'home' && (
                <>
                  {/* Hero Slider Banner with AI Camera Highlight */}
                  <SliderBanner
                    onOpenLiveCamera={() => setIsCameraOpen(true)}
                    onOpenDiagnosis={handleSelectCategory}
                  />

                  {/* 6 Service Categories Grid (PRD 5) */}
                  <CategoryGrid onSelectCategory={handleSelectCategory} />

                  {/* Featured Verified Technicians (PRD 7) */}
                  <FeaturedTechnicians onBookTechnician={handleBookTechnician} />
                </>
              )}

              {currentTab === 'tracking' && (
                <OrdersListView
                  orders={orders}
                  filterType="active"
                  onTrackOrder={(order) => { setSelectedOrder(order); setIsDispatchOpen(true); }}
                  onOpenPayment={(order) => { setSelectedOrder(order); setIsPaymentOpen(true); }}
                  onOpenInvoiceWarranty={(order) => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                />
              )}

              {currentTab === 'history' && (
                <OrdersListView
                  orders={orders}
                  filterType="history"
                  onTrackOrder={(order) => { setSelectedOrder(order); setIsDispatchOpen(true); }}
                  onOpenPayment={(order) => { setSelectedOrder(order); setIsPaymentOpen(true); }}
                  onOpenInvoiceWarranty={(order) => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                />
              )}

              {currentTab === 'warranty' && (
                <OrdersListView
                  orders={orders}
                  filterType="warranty"
                  onTrackOrder={(order) => { setSelectedOrder(order); setIsDispatchOpen(true); }}
                  onOpenPayment={(order) => { setSelectedOrder(order); setIsPaymentOpen(true); }}
                  onOpenInvoiceWarranty={(order) => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                />
              )}

              {currentTab === 'pricing' && <PricingView />}

              {currentTab === 'reviews' && (
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>
                    Đánh Giá Dịch Vụ & Kỹ Thuật Viên
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                    Hãy chia sẻ trải nghiệm của bạn để giúp thợ khác cải thiện chất lượng dịch vụ.
                  </p>
                  <OrdersListView
                    orders={orders}
                    filterType="history"
                    onTrackOrder={(order) => { setSelectedOrder(order); setIsDispatchOpen(true); }}
                    onOpenPayment={(order) => { setSelectedOrder(order); setIsPaymentOpen(true); }}
                    onOpenInvoiceWarranty={(order) => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                  />
                </div>
              )}

              {currentTab === 'support' && (
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>
                    Trung Tâm Trợ Giúp & Giải Quyết Khiếu Nại 24/7
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                    Đội ngũ chăm sóc khách hàng <strong style={{ color: '#f97316' }}>FIX</strong><strong style={{ color: '#102a43' }}>247</strong> luôn túc trực hỗ trợ bạn mọi lúc mọi nơi.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e40af', marginBottom: '6px' }}>
                        Hotline Cứu Hộ & Khiếu Nại
                      </h4>
                      <p style={{ fontSize: '22px', fontWeight: 900, color: '#2563eb' }}>
                        1900 8899 (Miễn cước)
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                        Phục vụ 24/7 kể cả ngày lễ tết, tiếp nhận phản ánh trong 30 giây.
                      </p>
                    </div>

                    <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>
                        Chính Sách Hoàn Tiền 100%
                      </h4>
                      <p style={{ fontSize: '13px', color: '#15803d', lineHeight: 1.5 }}>
                        Nếu kỹ thuật viên thu vượt quá giá đã khóa hoặc không thực hiện đúng cam kết bảo hành, <strong>FIX247</strong> bồi hoàn 100% chi phí đơn hàng.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Auth Modal (Login / Register with 2 Security Questions / Forgot Password Steps 1-4) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      {/* 2. Real-time AI Camera Defect Detection Scanner */}
      <AICameraScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onApplyDefectToDiagnosis={handleApplyDefectFromCamera}
      />

      {/* 3. AI Diagnosis & Fixed-Price Quotation Modal */}
      <AIDiagnosisModal
        isOpen={isDiagnosisOpen}
        onClose={() => setIsDiagnosisOpen(false)}
        initialDefect={detectedDefect}
        initialPhotoUrl={detectedPhotoUrl}
        onOpenLiveCamera={() => {
          setIsDiagnosisOpen(false);
          setIsCameraOpen(true);
        }}
        onConfirmAndFindTechnician={handleConfirmAndFindTechnician}
      />

      {/* 4. Technician Dispatch, ETA & Progress Tracking Modal */}
      {isDispatchOpen && (
        <TechnicianDispatch
          order={selectedOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onOpenPayment={(ord) => {
            setSelectedOrder(ord);
            setIsPaymentOpen(true);
          }}
          onOpenChat={(ord) => {
            setSelectedOrder(ord);
            setIsChatOpen(true);
          }}
          onClose={() => setIsDispatchOpen(false)}
        />
      )}

      {/* 5. Payment Modal (VietQR, Visa, Cash) */}
      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          order={selectedOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}

      {/* 6. Invoice, Electronic Warranty & Reviews Modal */}
      {isInvoiceOpen && (
        <InvoiceWarrantyModal
          isOpen={isInvoiceOpen}
          order={selectedOrder}
          onClose={() => setIsInvoiceOpen(false)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* 7. Chat Modal with Technician */}
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          order={selectedOrder}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* 8. Full Database Explorer (22 Tables from PRD Section 14) */}
      <DatabaseViewerModal
        isOpen={isDbOpen}
        onClose={() => setIsDbOpen(false)}
      />
    </div>
  );
};
