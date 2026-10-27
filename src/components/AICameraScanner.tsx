import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, ArrowRight, ShieldAlert, Sparkles, X, Cpu, CheckCircle2 } from 'lucide-react';
import { DetectedDefect } from '../types';
import { classifyVehicleDamage, VisualInferenceResult } from '../services/aiVisionClassifier';
import { VEHICLE_DEFECTS_DATASET } from '../data/vehicleDefectsDataset';

interface AICameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDefectToDiagnosis: (defect: DetectedDefect, photoUrl: string) => void;
}

export const AICameraScanner: React.FC<AICameraScannerProps> = ({
  isOpen,
  onClose,
  onApplyDefectToDiagnosis
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState(true);
  const [activeDefect, setActiveDefect] = useState<DetectedDefect | null>(null);
  const [detectedInference, setDetectedInference] = useState<VisualInferenceResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start real webcam when opened
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setActiveDefect(null);
      setDetectedInference(null);
      setHasAnalyzed(false);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, cameraFacing]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera thực tế chưa cấp quyền hoặc không sẵn sàng:', err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Automated AI Classification from image pixels
  const analyzeImageContent = async (imageDataUrl: string, fileHint?: string) => {
    setIsAnalyzing(true);
    setScanProgress(0);

    const progressTimer = setInterval(() => {
      setScanProgress(prev => (prev < 90 ? prev + 15 : prev));
    }, 80);

    try {
      // Run visual classifier algorithm on the actual pixel matrix (with optional file hint)
      const inference = await classifyVehicleDamage(imageDataUrl, fileHint);

      clearInterval(progressTimer);
      setScanProgress(100);

      const defectResult: DetectedDefect = {
        id: inference.defect.id,
        name: inference.defect.name,
        category: inference.defect.category as any,
        severity: inference.defect.severity,
        confidence: inference.confidence,
        description: inference.defect.description,
        safetyWarning: inference.defect.safetyWarning,
        suggestedAction: inference.defect.suggestedAction,
        box: inference.boundingBox,
        estimatedCost: inference.defect.estimatedCost
      };

      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveDefect(defectResult);
        setDetectedInference(inference);
        setHasAnalyzed(true);
      }, 200);
    } catch (err) {
      clearInterval(progressTimer);
      setIsAnalyzing(false);
      console.error('Lỗi phân tích AI:', err);
    }
  };

  // 1. User captures snapshot from live camera
  const handleCaptureSnapshot = () => {
    if (videoRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        analyzeImageContent(dataUrl);
      }
    } else {
      // Default sample vehicle crash for testing when camera is unavailable
      const defaultSample = 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=700&auto=format&fit=crop&q=80';
      setCapturedImage(defaultSample);
      analyzeImageContent(defaultSample, 'xe ô tô va chạm vỡ cản trước');
    }
  };

  // 2. User uploads ANY image file (car, motorbike, AC, fridge, mist fan, etc.)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgData = event.target.result as string;
          setCapturedImage(imgData);
          analyzeImageContent(imgData, fileName);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (!activeDefect || !capturedImage) return;
    onApplyDefectToDiagnosis(activeDefect, capturedImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(10, 25, 47, 0.94)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#0b1d30',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1120px',
        maxHeight: '94vh',
        overflowY: 'auto',
        color: '#ffffff',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 0 50px rgba(37, 99, 235, 0.35)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header HUD */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(16, 42, 67, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(37, 99, 235, 0.6)'
            }}>
              <Camera size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>
                  Camera AI Quét & Tự Động Nhận Diện Sự Cố (Xe & Đồ Gia Dụng Trong Nhà)
                </h3>
                <span className="badge badge-green" style={{ fontSize: '11px', animation: 'pulse 2s infinite' }}>
                  ● MULTI-VISION AI
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Tải lên ảnh bất kỳ (Xe ô tô, xe máy, điều hòa, tủ lạnh, quạt hơi nước...) để AI tự động nhận diện và tính chi phí
              </p>
            </div>
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
              color: '#cbd5e1'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Main interactive area: Camera Viewport (Left) + AI Diagnostic Panel (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '20px',
          padding: '20px'
        }}>
          {/* Left Column: Camera Viewfinder + AI Analysis Engine Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Camera Viewport */}
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              backgroundColor: '#030712',
              aspectRatio: '16/10',
              boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8)',
              border: '2px solid rgba(59, 130, 246, 0.4)'
            }}>
              {/* Display live camera or captured/uploaded photo */}
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Ảnh sự cố"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : isCameraActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                /* Camera Standby Viewfinder Interface (No pre-loaded photo) */
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at center, #112240 0%, #030712 100%)',
                  padding: '20px',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  {/* Grid Lines Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none'
                  }} />

                  <div style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '2px dashed #60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                    boxShadow: '0 0 25px rgba(37, 99, 235, 0.3)'
                  }}>
                    <Camera size={38} color="#93c5fd" />
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                    Khung Ngắm Camera AI Tự Động
                  </h4>
                  <p style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '340px', lineHeight: 1.5, marginBottom: '14px' }}>
                    Nhấn nút <strong>Tải Ảnh Lên</strong> (ảnh chụp xe bất kỳ) hoặc <strong>Chụp & Quét</strong> để AI tự động nhận diện 100%.
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={startCamera}
                      style={{
                        background: 'rgba(37, 99, 235, 0.3)',
                        border: '1px solid #3b82f6',
                        color: '#93c5fd',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RefreshCw size={13} />
                      <span>Bật Webcam Trực Tiếp</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic HUD Bounding Box calculated directly from image damage cluster */}
              {hasAnalyzed && activeDefect && (
                <div style={{
                  position: 'absolute',
                  left: `${activeDefect.box.x}%`,
                  top: `${activeDefect.box.y}%`,
                  width: `${activeDefect.box.width}%`,
                  height: `${activeDefect.box.height}%`,
                  border: activeDefect.severity === 'nguy_cap' ? '2px solid #ef4444' : '2px solid #f59e0b',
                  borderRadius: '8px',
                  boxShadow: activeDefect.severity === 'nguy_cap' ? '0 0 20px rgba(239, 68, 68, 0.7)' : '0 0 20px rgba(245, 158, 11, 0.7)',
                  pointerEvents: 'none',
                  transition: 'all 0.4s ease'
                }}>
                  {/* 4 Corner Crosshairs */}
                  <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '12px', height: '12px', borderTop: '3px solid #60a5fa', borderLeft: '3px solid #60a5fa' }} />
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', borderTop: '3px solid #60a5fa', borderRight: '3px solid #60a5fa' }} />
                  <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '12px', height: '12px', borderBottom: '3px solid #60a5fa', borderLeft: '3px solid #60a5fa' }} />
                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '12px', height: '12px', borderBottom: '3px solid #60a5fa', borderRight: '3px solid #60a5fa' }} />

                  {/* Floating Defect Label */}
                  <div style={{
                    position: 'absolute',
                    top: '-26px',
                    left: '0',
                    background: activeDefect.severity === 'nguy_cap' ? '#ef4444' : '#f59e0b',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{activeDefect.name}</span>
                    <span style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '3px' }}>
                      {activeDefect.confidence}%
                    </span>
                  </div>
                </div>
              )}

              {/* Scanning Laser Line Animation */}
              {isScanning && !capturedImage && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #38bdf8, #60a5fa, transparent)',
                  boxShadow: '0 0 15px #38bdf8',
                  animation: 'pulseScan 2.5s infinite linear',
                  pointerEvents: 'none'
                }} />
              )}

              {/* HUD Center Crosshair */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                pointerEvents: 'none',
                opacity: 0.5
              }}>
                <div style={{ position: 'absolute', top: 0, left: '29px', width: '2px', height: '12px', background: '#38bdf8' }} />
                <div style={{ position: 'absolute', bottom: 0, left: '29px', width: '2px', height: '12px', background: '#38bdf8' }} />
                <div style={{ position: 'absolute', left: 0, top: '29px', width: '12px', height: '2px', background: '#38bdf8' }} />
                <div style={{ position: 'absolute', right: 0, top: '29px', width: '12px', height: '2px', background: '#38bdf8' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', margin: '27px auto' }} />
              </div>

              {/* Analysis Progress Overlay */}
              {isAnalyzing && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(11, 29, 48, 0.9)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  zIndex: 10
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    border: '4px solid rgba(59, 130, 246, 0.2)',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#60a5fa' }}>
                    AI đang trích xuất ma trận điểm ảnh... {scanProgress}%
                  </p>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Phân tích gradient vết nứt, tổn hại va chạm và đối soát với tập dữ liệu xe
                  </span>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{
                flex: 2,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
                cursor: 'pointer'
              }}>
                <Upload size={18} />
                <span>Tải Ảnh Bất Kỳ Lên (Xe & Đồ Gia Dụng)</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              <button
                type="button"
                onClick={handleCaptureSnapshot}
                style={{
                  flex: 1.2,
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                }}
              >
                <Camera size={17} />
                <span>Chụp & Quét</span>
              </button>

              <button
                type="button"
                onClick={toggleCameraFacing}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Đổi camera trước/sau"
              >
                <RefreshCw size={17} />
              </button>

              {capturedImage && (
                <button
                  type="button"
                  onClick={() => { setCapturedImage(null); setHasAnalyzed(false); setActiveDefect(null); setDetectedInference(null); }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  Xóa Ảnh
                </button>
              )}
            </div>

            {/* 2. BẢNG MÔ HÌNH AI TỰ ĐỘNG (Không có các nút/thẻ thủ công) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} color="#60a5fa" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#93c5fd', letterSpacing: '0.2px' }}>
                    BỘ MÔ HÌNH AI HUẤN LUYỆN (DATASET: XE CƠ GIỚI & ĐIỆN LẠNH, GIA DỤNG)
                  </span>
                </div>
                <span className="badge badge-green" style={{ fontSize: '10px' }}>
                  TỰ ĐỘNG 100%
                </span>
              </div>

              {detectedInference ? (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontWeight: 700 }}>
                    <CheckCircle2 size={15} />
                    <span>AI đã tự động phân loại thiết bị & phát hiện sự cố thành công:</span>
                  </div>
                  <div style={{ color: '#ffffff', lineHeight: 1.5 }}>
                    • {detectedInference.detectedFeatures.summary}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                    <div>Phân loại: <strong style={{ color: '#cbd5e1' }}>{detectedInference.detectedFeatures.domainName}</strong></div>
                    <div>Vùng quét tổn hại: <strong style={{ color: '#cbd5e1' }}>{detectedInference.detectedFeatures.anomalyZonePercent}% diện tích</strong></div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  fontSize: '12px',
                  color: '#94a3b8',
                  lineHeight: 1.6
                }}>
                  💡 <strong>Hệ thống tự động 100% (không cần chọn nút thủ công):</strong> Khi tải ảnh lên, mô hình AI tự động nhận diện đối tượng và lỗi hư hỏng trực tiếp từ ma trận điểm ảnh:
                  <div style={{ marginTop: '6px', color: '#cbd5e1' }}>
                    • <strong>Đồ gia dụng & điện lạnh:</strong> Điều hòa (chảy nước máng xả, rò gas đóng tuyết, nổ tụ), Tủ lạnh (không đông đá, hỏng cảm biến xả đá, rách gioăng cửa), Quạt hơi nước (hỏng bơm chìm, kẹt motor), Đường ống nước...<br />
                    • <strong>Xe cơ giới:</strong> Ô tô (vỡ cản trước, nứt kính, móp méo thân vỏ), Xe máy (thủng mòn lốp, ắc quy tụt áp, cong đĩa phanh)...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Diagnostic Result & Cost Quotation Preview */}
          <div style={{
            background: 'rgba(16, 42, 67, 0.7)',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {hasAnalyzed && activeDefect ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="badge badge-blue" style={{ background: 'rgba(37, 99, 235, 0.2)', border: '1px solid #3b82f6', color: '#93c5fd' }}>
                    KẾT QUẢ CHẨN ĐOÁN TỰ ĐỘNG
                  </span>
                  <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700 }}>
                    Độ tin cậy: {activeDefect.confidence}%
                  </span>
                </div>

                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: '8px' }}>
                  {activeDefect.name}
                </h4>

                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px' }}>
                  {activeDefect.description}
                </p>

                {/* Safety Warning if Critical (PRD 6.3 & 6.5) */}
                {activeDefect.safetyWarning && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '12px',
                    borderRadius: '10px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    marginBottom: '14px'
                  }}>
                    <ShieldAlert size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', display: 'block' }}>
                        CẢNH BÁO AN TOÀN KỸ THUẬT:
                      </span>
                      <span style={{ fontSize: '11px', color: '#fca5a5' }}>
                        {activeDefect.safetyWarning}
                      </span>
                    </div>
                  </div>
                )}

                {/* Suggested Action */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                    Phương án sửa chữa tối ưu:
                  </span>
                  <p style={{ fontSize: '13px', color: '#e2e8f0', background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '8px' }}>
                    {activeDefect.suggestedAction}
                  </p>
                </div>

                {/* Itemized Cost Breakdown from PRD line 239-251 */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>DỰ TOÁN CHI PHÍ CỐ ĐỊNH (PRD 6.4):</span>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>CAM KẾT KHÔNG PHÁT SINH</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                    <span style={{ color: '#cbd5e1' }}>1. Công thợ kỹ thuật:</span>
                    <span style={{ fontWeight: 700 }}>{activeDefect.estimatedCost.labor.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                    <span style={{ color: '#cbd5e1' }}>2. {activeDefect.estimatedCost.partsName}:</span>
                    <span style={{ fontWeight: 700 }}>{activeDefect.estimatedCost.parts.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                    <span style={{ color: '#cbd5e1' }}>3. Phí di chuyển tận nơi:</span>
                    <span style={{ fontWeight: 700 }}>{activeDefect.estimatedCost.travel.toLocaleString('vi-VN')} ₫</span>
                  </div>

                  <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    marginTop: '8px',
                    paddingTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Tổng thanh toán trọn gói:</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#4ade80' }}>
                      {(
                        activeDefect.estimatedCost.labor +
                        activeDefect.estimatedCost.parts +
                        activeDefect.estimatedCost.travel
                      ).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Standby State before Scanning */
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px 16px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Sparkles size={32} color="#60a5fa" />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Sẵn Sàng Nhận Diện Tự Động
                </h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '320px', marginBottom: '20px' }}>
                  Hệ thống được huấn luyện từ tập dữ liệu 10 lớp lỗi xe. Chỉ cần tải lên 1 ảnh bất kỳ, AI sẽ tự động phân tích và tạo báo giá cố định theo <strong>PRD Mục 6.6 & 6.8</strong>.
                </p>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#cbd5e1',
                  textAlign: 'left',
                  width: '100%',
                  lineHeight: 1.6
                }}>
                  <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>🚀 Cách hoạt động:</div>
                  <div>1. Nhấn nút màu cam <strong>[Tải Ảnh Xe Bất Kỳ Lên]</strong>.</div>
                  <div>2. AI quét điểm ảnh, tự nhận diện lỗi và định vị khung hư hỏng.</div>
                  <div>3. Hiển thị báo giá cố định minh bạch 100%.</div>
                </div>
              </div>
            )}

            {/* Bottom Apply Action */}
            {hasAnalyzed && activeDefect && (
              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleApply}
                  style={{
                    width: '100%',
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
                    boxShadow: '0 4px 16px rgba(22, 163, 74, 0.4)',
                    cursor: 'pointer'
                  }}
                >
                  <span>Áp Dụng Lỗi Này & Tạo Báo Giá Cố Định</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
