import React, { useState } from 'react';
import { Order } from '../types';
import { Send, Image, Phone, MapPin, X, CheckCheck } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  const [messages, setMessages] = useState<{ sender: 'customer' | 'technician'; text: string; time: string }[]>([
    {
      sender: 'technician',
      text: `Chào bạn, tôi là thợ ${order.technician?.name || 'Nguyễn Văn Hùng'}. Tôi đã xem ảnh AI chẩn đoán lỗi "${order.detectedDefectName || order.serviceType}" và đang chuẩn bị đồ nghề di chuyển qua ngay nhé!`,
      time: 'Vừa xong'
    },
    {
      sender: 'customer',
      text: 'Vâng anh qua số 72 Trần Đại Nghĩa giúp mình nhé, tới nơi alo mình xuống mở cửa.',
      time: 'Vừa xong'
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = {
      sender: 'customer' as const,
      text: inputVal,
      time: 'Bây giờ'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Simulate tech quick reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'technician',
          text: 'Dạ vâng mình ghi nhận rồi ạ, khoảng 5-10 phút nữa tôi có mặt tận nơi!',
          time: 'Vừa xong'
        }
      ]);
    }, 1200);
  };

  const handleQuickMsg = (msg: string) => {
    setInputVal(msg);
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
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        height: '620px',
        boxShadow: '0 25px 50px -12px rgba(16, 42, 67, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, #102a43, #1e3a8a)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={order.technician?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'}
              alt="Technician"
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff' }}
            />
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800 }}>
                {order.technician?.name || 'Nguyễn Văn Hùng'}
              </h4>
              <span style={{ fontSize: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ● Đang trực tuyến • Đang di chuyển
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={`tel:${order.technician?.phone || '0912345678'}`}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Phone size={16} />
            </a>
            <button
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'customer' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <div style={{
                background: m.sender === 'customer' ? '#2563eb' : '#ffffff',
                color: m.sender === 'customer' ? '#ffffff' : '#1e293b',
                padding: '10px 14px',
                borderRadius: m.sender === 'customer' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                fontSize: '13px',
                lineHeight: 1.4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                border: m.sender === 'technician' ? '1px solid #e2e8f0' : 'none'
              }}>
                {m.text}
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '2px', textAlign: m.sender === 'customer' ? 'right' : 'left' }}>
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Quick phrases */}
        <div style={{ padding: '8px 12px', background: '#f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {['Tôi đang ở nhà đợi nhé', 'Bạn đến gọi số mình', 'Cần chuẩn bị gì trước không?'].map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickMsg(p)}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                whiteSpace: 'nowrap',
                color: '#475569'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} style={{ padding: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập tin nhắn gửi kỹ thuật viên..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
