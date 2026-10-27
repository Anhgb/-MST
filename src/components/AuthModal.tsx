import React, { useState } from 'react';
import { User, UserRole, SecurityQuestion } from '../types';
import { SECURITY_QUESTIONS, INITIAL_USER } from '../data/mockData';
import { X, ShieldCheck, Lock, Mail, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, UserCircle2, Wrench, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('minhkhang@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regQ1, setRegQ1] = useState(1);
  const [regA1, setRegA1] = useState('');
  const [regQ2, setRegQ2] = useState(2);
  const [regA2, setRegA2] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password flow (Steps 1 to 4 from PRD 3.4)
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3 | 4>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotA1, setForgotA1] = useState('');
  const [forgotA2, setForgotA2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Email/Số điện thoại và Mật khẩu.');
      return;
    }

    // Role check logic for quick testing
    let loggedUser: User = { ...INITIAL_USER };
    if (loginIdentifier.includes('technician') || loginIdentifier.includes('tho')) {
      loggedUser = {
        id: 'usr-tech-01',
        name: 'Nguyễn Văn Hùng (Kỹ Thuật Viên)',
        email: 'tho.hung@fixnow.ai',
        phone: '0912 345 678',
        role: 'technician',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        address: '88 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội'
      };
    } else if (loginIdentifier.includes('admin')) {
      loggedUser = {
        id: 'usr-admin-01',
        name: 'Quản Trị Viên Hệ Thống',
        email: 'admin@fixnow.ai',
        phone: '0900 888 999',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        address: 'Tòa nhà FixNow AI, Cầu Giấy, Hà Nội'
      };
    }

    setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
    setTimeout(() => {
      onLoginSuccess(loggedUser);
      onClose();
    }, 400);
  };

  const handleQuickLogin = (role: UserRole) => {
    let user: User;
    if (role === 'customer') {
      user = INITIAL_USER;
    } else if (role === 'technician') {
      user = {
        id: 'usr-tech-01',
        name: 'Nguyễn Văn Hùng (Thợ Chuyên Nghiệp)',
        email: 'tho.hung@fixnow.ai',
        phone: '0912 345 678',
        role: 'technician',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        address: '88 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội'
      };
    } else {
      user = {
        id: 'usr-admin-01',
        name: 'Quản Trị Viên Điều Hành',
        email: 'admin@fixnow.ai',
        phone: '0900 888 999',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        address: 'Tòa nhà FixNow AI, Cầu Giấy, Hà Nội'
      };
    }
    onLoginSuccess(user);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setErrorMessage('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (regQ1 === regQ2) {
      setErrorMessage('Hai câu hỏi bảo mật không được trùng nhau (PRD 3.3).');
      return;
    }
    if (!regA1.trim() || !regA2.trim()) {
      setErrorMessage('Vui lòng trả lời cả 2 câu hỏi bảo mật.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: 'customer',
      address: 'Hà Nội, Việt Nam',
      savedSecurityQuestions: [
        { questionId: regQ1, answerHash: regA1.toLowerCase().trim() },
        { questionId: regQ2, answerHash: regA2.toLowerCase().trim() }
      ]
    };

    setSuccessMessage('Đăng ký tài khoản thành công! Tự động đăng nhập...');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  const handleForgotStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setErrorMessage('Vui lòng nhập Email hoặc Số điện thoại đăng ký.');
      return;
    }
    setErrorMessage('');
    setForgotStep(2);
  };

  const handleForgotStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (attemptCount >= 5) {
      setErrorMessage('Bạn đã nhập sai quá số lần quy định. Vui lòng thử lại sau 15 phút (PRD 3.4).');
      return;
    }
    // Demo verification (accepts 'bachkhoa' & 'hanoi' or any non-empty input if testing)
    if (!forgotA1.trim() || !forgotA2.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ câu trả lời cho cả hai câu hỏi.');
      return;
    }

    setErrorMessage('');
    setForgotStep(3);
  };

  const handleForgotStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Xác nhận mật khẩu mới không khớp.');
      return;
    }
    setErrorMessage('');
    setForgotStep(4);
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
        borderRadius: '20px',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: mode === 'register' ? '1fr' : '1fr 1.2fr',
        boxShadow: '0 25px 50px -12px rgba(16, 42, 67, 0.25)',
        position: 'relative'
      }}>
        {/* Left branding banner (PRD 3.2: bên trái hình ảnh thợ & thông điệp) */}
        {mode !== 'register' && (
          <div style={{
            background: 'linear-gradient(145deg, #102a43 0%, #0f2744 50%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.08)', zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.08)', zIndex: 1 }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* FIX247 Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  flexShrink: 0
                }}>
                  <img
                    src="/logo-fix247.png"
                    alt="FIX247 Logo"
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.background = 'linear-gradient(135deg, #102a43, #1e3a8a)';
                        parent.innerHTML = '<span style="color:#f97316;font-weight:900;font-size:13px;letter-spacing:-1px">FIX<span style="color:#ffffff">247</span></span>';
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>
                    <span style={{ color: '#f97316' }}>FIX</span>
                    <span style={{ color: '#ffffff' }}>247</span>
                  </h3>
                  <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 600 }}>Nền tảng sửa chữa 24/7</span>
                </div>
              </div>

              {/* Slogan from PRD / Logo */}
              <div style={{
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '24px'
              }}>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#fdba74', letterSpacing: '0.3px' }}>
                  Chụp lỗi – Biết giá – Chọn đúng thợ
                </p>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.4, marginBottom: '20px', color: '#e2e8f0' }}>
                Chẩn đoán lỗi thông minh bằng Camera AI & Báo giá minh bạch 100%
              </h2>

              {/* 4 key USPs matching logo icons */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span><strong style={{ color: '#f97316' }}>AI Chẩn Đoán Lỗi</strong> – Phát hiện sự cố trong 2 giây</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span><strong style={{ color: '#f97316' }}>Minh Bạch Chi Phí</strong> – Giá cố định, không phát sinh</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span><strong style={{ color: '#f97316' }}>Kết Nối Thợ Gần Nhất</strong> – Đến trong 15 phút</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span><strong style={{ color: '#f97316' }}>Phụ Tùng Chính Hãng</strong> – Bảo hành theo đơn</span>
                </li>
              </ul>
            </div>

            {/* Quick Demo Switcher */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#fdba74', marginBottom: '10px', letterSpacing: '0.5px' }}>
                ⚡ ĐĂNG NHẬP NHANH TRẢI NGHIỆM:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer')}
                  style={{
                    background: '#ffffff',
                    color: '#102a43',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}
                >
                  Khách Hàng
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('technician')}
                  style={{
                    background: '#f59e0b',
                    color: '#ffffff',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}
                >
                  Thợ Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right side form */}
        <div style={{ padding: '36px 32px', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>

          {errorMessage && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              border: '1px solid #fecaca'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              background: '#f0fdf4',
              color: '#16a34a',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              border: '1px solid #bbf7d0'
            }}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN MODE */}
          {mode === 'login' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#102a43', marginBottom: '8px' }}>
                Đăng Nhập Tài Khoản
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                Chào mừng bạn quay lại với <strong style={{ color: '#f97316' }}>FIX</strong><strong style={{ color: '#102a43' }}>247</strong>
              </p>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email hoặc Số điện thoại
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="minhkhang@example.com hoặc 0989..."
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Mật khẩu
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      style={{
                        width: '100%',
                        padding: '12px 40px 12px 40px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '13px', color: '#94a3b8' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setForgotStep(1); setErrorMessage(''); }}
                    style={{ color: '#2563eb', fontWeight: 600 }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '13px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '15px',
                    marginTop: '8px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  Đăng Nhập
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#64748b' }}>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(''); }}
                  style={{ color: '#2563eb', fontWeight: 700 }}
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          )}

          {/* 2. REGISTER MODE WITH SECURITY QUESTIONS (PRD 3.3) */}
          {mode === 'register' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-blue">PRD 3.3</span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#102a43' }}>
                  Tạo Tài Khoản & Thiết Lập Câu Hỏi Bảo Mật
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                Hệ thống yêu cầu chọn 2 câu hỏi bảo mật riêng biệt để phục hồi tài khoản an toàn tuyệt đối.
              </p>

              <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="an.nguyen@gmail.com"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0988 123 456"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Nhập lại mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Khớp với mật khẩu trên"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                {/* Security Question 1 */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>
                    Câu hỏi bảo mật 1 *
                  </label>
                  <select
                    value={regQ1}
                    onChange={(e) => setRegQ1(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '6px' }}
                  >
                    {SECURITY_QUESTIONS.map(q => (
                      <option key={q.id} value={q.id}>{q.question}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={regA1}
                    onChange={(e) => setRegA1(e.target.value)}
                    placeholder="Nhập câu trả lời 1"
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                {/* Security Question 2 */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>
                    Câu hỏi bảo mật 2 (Khác câu 1) *
                  </label>
                  <select
                    value={regQ2}
                    onChange={(e) => setRegQ2(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '6px' }}
                  >
                    {SECURITY_QUESTIONS.map(q => (
                      <option key={q.id} value={q.id}>{q.question}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={regA2}
                    onChange={(e) => setRegA2(e.target.value)}
                    placeholder="Nhập câu trả lời 2"
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span>Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của FixNow AI.</span>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{ flex: 1, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                  >
                    Quay Lại
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      background: '#2563eb',
                      color: '#ffffff',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    Đăng Ký Tài Khoản
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. FORGOT PASSWORD (PRD 3.4 4 STEPS) */}
          {mode === 'forgot' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-warning">PRD 3.4</span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#102a43' }}>
                  Khôi Phục Mật Khẩu Bằng Câu Hỏi Bảo Mật
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      background: forgotStep >= s ? '#2563eb' : '#e2e8f0'
                    }}
                  />
                ))}
              </div>

              {/* Step 1: Identifier */}
              {forgotStep === 1 && (
                <form onSubmit={handleForgotStep1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Bước 1: Nhập Email hoặc Số điện thoại tài khoản của bạn để truy xuất câu hỏi bảo mật đã đăng ký.
                  </p>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      Email hoặc SĐT
                    </label>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="minhkhang@example.com"
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ background: '#2563eb', color: '#fff', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
                  >
                    Tiếp Tục Xác Minh
                  </button>
                </form>
              )}

              {/* Step 2: Answer 2 questions */}
              {forgotStep === 2 && (
                <form onSubmit={handleForgotStep2} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Bước 2: Trả lời đúng cả 2 câu hỏi bảo mật để xác thực quyền sở hữu tài khoản.
                  </p>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#102a43', marginBottom: '6px' }}>
                      1. {SECURITY_QUESTIONS[0].question}
                    </p>
                    <input
                      type="text"
                      value={forgotA1}
                      onChange={(e) => setForgotA1(e.target.value)}
                      placeholder="Gợi ý demo: bachkhoa"
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#102a43', marginBottom: '6px' }}>
                      2. {SECURITY_QUESTIONS[1].question}
                    </p>
                    <input
                      type="text"
                      value={forgotA2}
                      onChange={(e) => setForgotA2(e.target.value)}
                      placeholder="Gợi ý demo: hanoi"
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ background: '#2563eb', color: '#fff', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
                  >
                    Xác Nhận Câu Trả Lời
                  </button>
                </form>
              )}

              {/* Step 3: Set New Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleForgotStep3} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Bước 3: Xác minh thành công! Vui lòng nhập mật khẩu mới cho tài khoản.
                  </p>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Mật khẩu mới</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ background: '#16a34a', color: '#fff', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
                  >
                    Lưu Mật Khẩu Mới
                  </button>
                </form>
              )}

              {/* Step 4: Finished */}
              {forgotStep === 4 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircle2 size={54} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#102a43', marginBottom: '8px' }}>
                    Đổi Mật Khẩu Thành Công!
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                    Các phiên đăng nhập cũ đã được thu hồi an toàn. Bạn có thể đăng nhập ngay với mật khẩu mới.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); }}
                    style={{ background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontWeight: 700 }}
                  >
                    Đăng Nhập Ngay
                  </button>
                </div>
              )}

              {forgotStep < 4 && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ display: 'block', margin: '16px auto 0', color: '#64748b', fontSize: '13px' }}
                >
                  Hủy & Quay lại đăng nhập
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
