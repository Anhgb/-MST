import React from 'react';
import { Home, Camera, Wrench, Navigation, FileText, ShieldCheck, DollarSign, HelpCircle, Star, CreditCard, Database } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLiveCamera: () => void;
  onOpenDiagnosis: () => void;
  onOpenDatabase: () => void;
  activeOrderCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLiveCamera,
  onOpenDiagnosis,
  onOpenDatabase,
  activeOrderCount
}) => {
  // PRD 4.2: Sidebar menu items
  const navItems = [
    { id: 'home', label: 'Trang Chủ', icon: Home },
    { id: 'camera', label: 'Camera AI Quét Lỗi', icon: Camera, highlight: true },
    { id: 'book', label: 'Đặt Dịch Vụ', icon: Wrench },
    { id: 'tracking', label: 'Theo Dõi Thợ', icon: Navigation, badge: activeOrderCount > 0 ? activeOrderCount : undefined },
    { id: 'history', label: 'Lịch Sử Sửa Chữa', icon: FileText },
    { id: 'warranty', label: 'Bảo Hành Điện Tử', icon: ShieldCheck },
    { id: 'pricing', label: 'Thanh Toán', icon: CreditCard },
    { id: 'reviews', label: 'Đánh Giá', icon: Star },
    { id: 'support', label: 'Hỗ Trợ 24/7', icon: HelpCircle },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.id === 'camera') {
      onOpenLiveCamera();
    } else if (item.id === 'book') {
      onOpenDiagnosis();
    } else if (item.id === 'database') {
      onOpenDatabase();
    } else {
      onSelectTab(item.id);
    }
  };

  return (
    <aside style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 68px)',
      position: 'sticky',
      top: '68px',
      boxShadow: '2px 0 8px rgba(0,0,0,0.02)',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px', padding: '0 12px 8px' }}>
          DANH MỤC ĐIỀU HƯỚNG
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: isActive || item.highlight ? 700 : 500,
                background: item.highlight
                  ? 'linear-gradient(135deg, #fff7ed, #ffedd5)'
                  : isActive
                  ? '#eff6ff'
                  : 'transparent',
                color: item.highlight
                  ? '#ea580c'
                  : isActive
                  ? '#2563eb'
                  : (item as any).dimmed
                  ? '#94a3b8'
                  : '#334155',
                border: item.highlight ? '1px solid #fed7aa' : '1px solid transparent',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon
                  size={18}
                  color={
                    item.highlight ? '#f97316'
                    : isActive ? '#2563eb'
                    : (item as any).dimmed ? '#94a3b8'
                    : '#64748b'
                  }
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '1px 7px',
                  borderRadius: '999px'
                }}>
                  {item.badge}
                </span>
              )}

              {item.highlight && !item.badge && (
                <span className="badge badge-warning" style={{ fontSize: '9px', padding: '1px 5px' }}>
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Guarantee Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #102a43, #1e3a8a)',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '14px',
        fontSize: '12px',
        lineHeight: 1.4,
        marginTop: '16px'
      }}>
        {/* FIX247 logo mini */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img
              src="/logo-fix247.png"
              alt="FIX247"
              style={{ width: '30px', height: '30px', objectFit: 'contain' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #102a43, #1e3a8a)';
                  parent.innerHTML = '<span style="color:#f97316;font-weight:900;font-size:9px">FIX247</span>';
                }
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#f97316' }}>FIX<span style={{ color: '#ffffff' }}>247</span></div>
            <div style={{ fontSize: '10px', color: '#bfdbfe' }}>Cam kết chất lượng</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#4ade80', marginBottom: '4px' }}>
          <ShieldCheck size={14} />
          <span>Minh bạch chi phí 100%</span>
        </div>
        <p style={{ color: '#bfdbfe', fontSize: '11px' }}>
          Báo giá cố định trước khi thợ xuất phát. Tuyệt đối không phát sinh chi phí ngoài.
        </p>
      </div>
    </aside>
  );
};
