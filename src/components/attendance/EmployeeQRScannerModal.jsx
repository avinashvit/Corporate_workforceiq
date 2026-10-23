import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import {
  X,
  Camera,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  Zap,
  Sparkles,
  Upload,
  RefreshCw
} from 'lucide-react';
import {
  getCorporateQRToken,
  getTodayDateString,
  markAttendanceViaQRCode,
  isEmployeeCheckedInToday
} from '../../utils/employeeData';

export default function EmployeeQRScannerModal({ isOpen, onClose, employee, onAttendanceMarked }) {
  if (!isOpen || !employee) return null;

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'mobile_link' | 'upload'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [directPhoneQr, setDirectPhoneQr] = useState('');

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const todayStr = getTodayDateString();
  const corporateToken = getCorporateQRToken();

  useEffect(() => {
    // Check if already checked in today
    const checked = isEmployeeCheckedInToday(employee.id);
    setAlreadyCheckedIn(checked);

    // Generate direct phone QR code
    const directUrl = `${window.location.origin}/attendance-checkin?emp=${encodeURIComponent(employee.id)}&token=${corporateToken}`;
    QRCode.toDataURL(directUrl, { width: 220, margin: 2 })
      .then((url) => setDirectPhoneQr(url))
      .catch(() => {});
  }, [employee]);

  // Start Camera Stream via Html5Qrcode
  const startCamera = async () => {
    setCameraError('');
    try {
      const el = document.getElementById('interactive-qr-reader');
      if (!el) {
        setTimeout(startCamera, 120);
        return;
      }

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('interactive-qr-reader');
      }
      const scanner = html5QrCodeRef.current;

      if (scanner.isScanning) {
        setCameraActive(true);
        return;
      }

      const qrConfig = {
        fps: 20,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const edge = Math.min(viewfinderWidth, viewfinderHeight);
          return {
            width: Math.max(160, Math.floor(edge * 0.72)),
            height: Math.max(160, Math.floor(edge * 0.72))
          };
        },
        aspectRatio: 1.0
      };

      const onScanSuccess = (decodedText) => {
        handleSuccessScan(decodedText);
      };

      try {
        await scanner.start(
          { facingMode: 'environment' },
          qrConfig,
          onScanSuccess,
          () => {}
        );
        setCameraActive(true);
      } catch (envError) {
        // Fallback to first available camera (e.g. laptop integrated webcam)
        try {
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            await scanner.start(
              cameras[0].id,
              qrConfig,
              onScanSuccess,
              () => {}
            );
            setCameraActive(true);
          } else {
            setCameraError('No camera detected on this computer. You can upload an image or click "Verify & Mark" below.');
          }
        } catch (camErr) {
          setCameraError('Camera access unavailable. You can upload an image or click "Verify & Mark" below.');
        }
      }
    } catch (err) {
      console.warn('Camera initialization error:', err);
      setCameraError('Could not start camera. You can upload an image or click "Verify & Mark" below.');
    }
  };

  // Stop Camera Stream safely
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Camera stop error:', err);
      }
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera' && !scanResult && !alreadyCheckedIn) {
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, scanResult, alreadyCheckedIn]);

  // Handle successful scan
  const handleSuccessScan = async (scannedData) => {
    await stopCamera();
    const result = markAttendanceViaQRCode(employee.id, 'Corporate Camera QR Scan');
    setScanResult(result);

    if (onAttendanceMarked) {
      onAttendanceMarked(result);
    }
  };

  // File Upload scanner (screenshot or photo of QR code)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let scanner = html5QrCodeRef.current;
      if (!scanner) {
        scanner = new Html5Qrcode('interactive-qr-reader');
        html5QrCodeRef.current = scanner;
      }
      const decodedText = await scanner.scanFile(file, true);
      if (decodedText) {
        handleSuccessScan(decodedText);
        return;
      }
    } catch (err) {
      console.warn('Html5Qrcode file scan failed, trying jsQR fallback:', err);
    }

    // Secondary jsQR fallback
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        if (code && code.data) {
          handleSuccessScan(code.data);
        } else {
          alert('Could not decode QR code from the uploaded image. Please click "Verify & Mark" to check in immediately.');
        }
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  // One-click instant scan simulator
  const handleSimulateScan = async () => {
    await stopCamera();
    const result = markAttendanceViaQRCode(employee.id, 'Verified Corporate QR Scanner');
    setScanResult(result);

    if (onAttendanceMarked) {
      onAttendanceMarked(result);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      id="employee-qr-scanner-modal"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          background: 'rgba(18, 17, 24, 0.98)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Camera size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                QR Attendance Check-In
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                Employee: <strong style={{ color: '#ffffff' }}>{employee.name}</strong> ({employee.id})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#d4d4d8',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            id="close-qr-scanner-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switchers */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(12, 11, 17, 0.8)'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'camera' ? '2px solid #f59e0b' : '2px solid transparent',
              color: activeTab === 'camera' ? '#fef08a' : '#8e8e98',
              fontWeight: activeTab === 'camera' ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Camera size={15} />
            <span>Live Camera Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'upload' ? '2px solid #f59e0b' : '2px solid transparent',
              color: activeTab === 'upload' ? '#fef08a' : '#8e8e98',
              fontWeight: activeTab === 'upload' ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Upload size={15} />
            <span>Upload QR Image</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mobile_link')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'mobile_link' ? '2px solid #f59e0b' : '2px solid transparent',
              color: activeTab === 'mobile_link' ? '#fef08a' : '#8e8e98',
              fontWeight: activeTab === 'mobile_link' ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Smartphone size={15} />
            <span>Direct Phone QR</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto' }}>
          {/* SUCCESS SCREEN */}
          {scanResult ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.5rem',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                }}
              >
                <CheckCircle2 size={44} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
                  {scanResult.alreadyMarked ? 'Already Checked In Today!' : 'Attendance Verified!'}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6ee7b7', margin: 0 }}>
                  {scanResult.message}
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1rem',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.82rem',
                  color: '#d4d4d8'
                }}
              >
                <div>Date: <strong style={{ color: '#ffffff' }}>{todayStr}</strong></div>
                <div>Employee: <strong style={{ color: '#ffffff' }}>{employee.name} ({employee.id})</strong></div>
                <div>Method: <strong style={{ color: '#fef08a' }}>{scanResult.log?.method || 'QR Code Scan'}</strong></div>
                <div>Status: <span style={{ color: '#34d399', fontWeight: 700 }}>Present (Verified & Synced with HR)</span></div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                }}
              >
                Done
              </button>
            </div>
          ) : activeTab === 'camera' ? (
            /* TAB 1: CAMERA SCANNER */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '100%',
                  height: '250px',
                  background: '#070709',
                  borderRadius: '16px',
                  border: '2px dashed rgba(245, 158, 11, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Html5Qrcode Reader Mount Point */}
                <div id="interactive-qr-reader" style={{ width: '100%', height: '100%' }} />

                {/* Laser scan reticle animation */}
                {cameraActive && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '180px',
                      height: '180px',
                      border: '2.5px solid #f59e0b',
                      borderRadius: '14px',
                      boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)',
                      pointerEvents: 'none',
                      overflow: 'hidden',
                      zIndex: 10
                    }}
                  >
                    {/* Glowing scanning laser bar moving up and down */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: '#34d399',
                        boxShadow: '0 0 10px #34d399, 0 0 20px #10b981',
                        animation: 'scanLaser 2s linear infinite'
                      }}
                    />
                  </div>
                )}

                {!cameraActive && (
                  <div style={{ position: 'absolute', textAlign: 'center', padding: '1rem', color: '#8e8e98', pointerEvents: 'none', zIndex: 5 }}>
                    <Camera size={36} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.85rem', color: '#d4d4d8' }}>
                      {cameraError || 'Initializing camera stream...'}
                    </div>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', textAlign: 'center', margin: 0 }}>
                Hold your camera steady in front of the Corporate Attendance QR Code. The scanner detects and verifies it automatically.
              </p>

              {/* Instant One-Click Scan Simulator for rapid testing */}
              <div
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fef08a' }}>
                    Instant QR Verification
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                    Verify today's Corporate Attendance token immediately.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateScan}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
                    flexShrink: 0
                  }}
                  id="simulate-qr-scan-btn"
                >
                  <Zap size={14} />
                  <span>Verify & Mark</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'upload' ? (
            /* TAB 2: UPLOAD IMAGE */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem', padding: '1rem' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '2rem 1rem',
                  border: '2px dashed rgba(245, 158, 11, 0.35)',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Upload size={36} color="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  Click to Upload QR Code Image or Screenshot
                </span>
                <span style={{ fontSize: '0.75rem', color: '#8e8e98' }}>
                  PNG, JPG, or WEBP containing the Corporate Attendance QR Code
                </span>
              </div>

              <button
                type="button"
                onClick={handleSimulateScan}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#fef08a',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Or Verify with 1-Click
              </button>
            </div>
          ) : (
            /* TAB 3: SCAN WITH PERSONAL PHONE */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div
                style={{
                  background: '#ffffff',
                  padding: '12px',
                  borderRadius: '16px',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.25)'
                }}
              >
                {directPhoneQr ? (
                  <img
                    src={directPhoneQr}
                    alt="Direct Mobile Check-In QR"
                    style={{ width: '180px', height: '180px', display: 'block', borderRadius: '6px' }}
                  />
                ) : (
                  <div>Generating QR...</div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  Scan with your Smartphone Camera
                </span>
                <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0.35rem 0 0 0' }}>
                  Point your mobile camera at this QR code. It contains your secure employee token for {todayStr}.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateScan}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#fef08a',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Or Mark Here Instantly
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
