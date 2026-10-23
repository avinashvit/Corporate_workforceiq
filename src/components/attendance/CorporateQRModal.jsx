import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, ShieldCheck, Clock, Users, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { getCorporateQRToken, getTodayDateString, getLiveAttendanceFeed, onEmployeeDataChange } from '../../utils/employeeData';

export default function CorporateQRModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [liveFeed, setLiveFeed] = useState([]);
  const today = getTodayDateString();
  const token = getCorporateQRToken();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    // Generate clean low-density token QR code for maximum camera scanning speed
    const qrPayload = `WORKFORCEIQ-ATTENDANCE-${today}`;

    QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 3,
      errorCorrectionLevel: 'L',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));

    setLiveFeed(getLiveAttendanceFeed());

    const unsubscribe = onEmployeeDataChange(() => {
      setLiveFeed(getLiveAttendanceFeed());
    });
    return () => unsubscribe();
  }, [today, token]);

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
      id="corporate-qr-modal"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
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
        {/* Modal Header */}
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
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)'
              }}
            >
              <QrCode size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Corporate Attendance QR Terminal
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                Daily Station for Employee Smartphone Check-In • {formattedDate}
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
            id="close-qr-terminal-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.75rem',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 320px) 1fr',
            gap: '1.5rem',
            alignItems: 'center'
          }}
        >
          {/* QR Code Presentation Box */}
          <div
            style={{
              background: 'rgba(12, 11, 17, 0.9)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* White frame holding QR code */}
            <div
              style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '16px',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Corporate Attendance QR Code"
                  style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }}
                />
              ) : (
                <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  Generating QR...
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#6ee7b7',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <ShieldCheck size={14} />
              <span>Token Active for Today</span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#8e8e98', margin: '0.5rem 0 0 0' }}>
              Employees point their smartphone camera at this code to automatically mark attendance.
            </p>
          </div>

          {/* Instructions & Live Check-in Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1rem 1.25rem'
              }}
            >
              <span style={{ fontSize: '0.78rem', color: '#fef08a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                How It Works:
              </span>
              <ul style={{ margin: '0.5rem 0 0 1.2rem', padding: 0, fontSize: '0.82rem', color: '#d4d4d8', lineHeight: 1.6 }}>
                <li>Keep this QR code projected at reception or office entry.</li>
                <li>Employees open their WorkForceIQ portal on their phone or laptop.</li>
                <li>They click <strong>"Scan Attendance QR Code"</strong> and point the camera at this code.</li>
                <li>Their attendance is immediately logged, present days increment, and the HR registry updates.</li>
              </ul>
            </div>

            {/* Live Check-in Ticker */}
            <div
              style={{
                background: 'rgba(12, 11, 17, 0.85)',
                border: '1px solid rgba(253, 230, 138, 0.15)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} color="#f59e0b" />
                  <span>Today's Live Check-Ins</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                  {liveFeed.length} Checked In
                </span>
              </div>

              <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {liveFeed.length === 0 ? (
                  <div style={{ fontSize: '0.78rem', color: '#71717a', fontStyle: 'italic', padding: '0.5rem 0' }}>
                    No check-ins logged yet today. QR code is ready for scanning.
                  </div>
                ) : (
                  liveFeed.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={13} color="#10b981" />
                        <strong style={{ color: '#ffffff' }}>{item.employeeName}</strong>
                        <span style={{ color: '#8e8e98' }}>({item.department})</span>
                      </div>
                      <span style={{ color: '#fef08a', fontWeight: 600 }}>{item.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(10, 9, 14, 0.9)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#8e8e98' }}>
            WorkForceIQ Attendance Terminal • Token: <code>{token}</code>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.84rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
}
