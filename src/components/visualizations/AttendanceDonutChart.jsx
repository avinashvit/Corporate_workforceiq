import React from 'react';
import { Calendar, Clock, CheckCircle2, Home, Building2, AlertCircle } from 'lucide-react';

export default function AttendanceDonutChart({ attendance = {} }) {
  const {
    rate = 0,
    presentDays = 0,
    remoteDays = 0,
    casualLeaves = 0,
    sickLeaves = 0,
    totalWorkingDays = 20,
    punctualityRate = 100
  } = attendance || {};

  // Segments calculation
  const totalLogged = presentDays + remoteDays + casualLeaves + sickLeaves;
  const total = totalLogged > 0 ? totalLogged : (totalWorkingDays || 20);
  const isPendingFirstCheckin = totalLogged === 0;

  const segments = [
    { label: 'In-Office Days', value: presentDays, color: '#f59e0b', icon: Building2 },
    { label: 'Remote / WFH', value: remoteDays, color: '#10b981', icon: Home },
    { label: 'Casual Leaves', value: casualLeaves, color: '#38bdf8', icon: Calendar },
    { label: 'Sick / Medical', value: sickLeaves, color: '#f87171', icon: AlertCircle }
  ];

  const size = 180;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray offsets
  let accumulatedPercent = 0;
  const renderSegments = segments.map((seg) => {
    const percent = totalLogged > 0 ? seg.value / total : 0;
    const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
    const strokeDashoffset = -circumference * accumulatedPercent;
    accumulatedPercent += percent;
    return { ...seg, strokeDasharray, strokeDashoffset, percent: Math.round(percent * 100) };
  });

  return (
    <div
      style={{
        background: 'rgba(18, 17, 24, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245, 158, 11, 0.28)',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Calendar size={15} color="#f59e0b" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Attendance & Work Rhythm
          </span>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            background: isPendingFirstCheckin ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            color: isPendingFirstCheckin ? '#fef08a' : '#6ee7b7',
            border: isPendingFirstCheckin ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            fontWeight: 700
          }}
        >
          {isPendingFirstCheckin ? 'Awaiting QR Scan' : `${punctualityRate}% Punctuality`}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
        {/* SVG Donut */}
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />
            {renderSegments.map((seg, i) => (
              <circle
                key={`donut-seg-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'all 0.6s ease' }}
              />
            ))}
          </svg>

          {/* Center text */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <span
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                lineHeight: 1
              }}
            >
              {rate}%
            </span>
            <span style={{ fontSize: '0.68rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginTop: '3px' }}>
              Attendance
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '170px' }}>
          {segments.map((seg, idx) => {
            const Icon = seg.icon;
            return (
              <div
                key={`legend-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: seg.color }} />
                  <span style={{ color: '#d4d4d8' }}>{seg.label}</span>
                </div>
                <strong style={{ color: '#ffffff' }}>{seg.value} d</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#8e8e98'
        }}
      >
        <span>Total Annual Working Days: <strong style={{ color: '#ffffff' }}>{totalWorkingDays}</strong></span>
        <span style={{ color: '#34d399', fontWeight: 600 }}>Leaves Used: {casualLeaves + sickLeaves} d</span>
      </div>
    </div>
  );
}
