import React from 'react';
import { Award, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export default function PerformanceGauge({ score = null, ratingText = 'Pending HR Appraisal', evaluatedBy, reviewDate }) {
  const isEvaluated = score !== null && score !== undefined;
  const radius = 64;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  // Arc spans 260 degrees (-220 to 40)
  const arcLength = circumference * (260 / 360);
  const progressOffset = isEvaluated
    ? arcLength - (arcLength * Math.min(100, Math.max(0, Number(score)))) / 100
    : arcLength; // 0% arc when pending

  // Determine accent color
  const getScoreColor = (val) => {
    if (!isEvaluated) return '#8e8e98';
    if (val >= 90) return '#f59e0b'; // Gold
    if (val >= 80) return '#10b981'; // Emerald
    if (val >= 70) return '#38bdf8'; // Sky
    return '#f87171';
  };

  const accentColor = getScoreColor(score);

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
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}
    >
      {/* Top Gold Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '180px',
          height: '60px',
          background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
        <Award size={15} color="#f59e0b" />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fcd34d' }}>
          HR Overall Rating
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div style={{ position: 'relative', width: '160px', height: '145px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="160" height="150" viewBox="0 0 160 150">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx="80"
            cy="75"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(140 80 75)"
          />

          {/* Glowing Animated Value Arc */}
          <circle
            cx="80"
            cy="75"
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform="rotate(140 80 75)"
            filter="url(#gaugeGlow)"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>

        {/* Center Percentage & Score */}
        <div
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              fontSize: isEvaluated ? '2.1rem' : '1.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: isEvaluated ? '#ffffff' : '#fde68a',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textShadow: isEvaluated ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            {isEvaluated ? `${score}%` : '—'}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>
            {isEvaluated ? 'Score' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Rating Text Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.28rem 0.85rem',
          borderRadius: '9999px',
          background: isEvaluated ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
          border: isEvaluated ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
          color: isEvaluated ? '#fef08a' : '#d4d4d8',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginTop: '-0.5rem',
          boxShadow: isEvaluated ? '0 0 12px rgba(245, 158, 11, 0.25)' : 'none'
        }}
      >
        <Sparkles size={12} color={isEvaluated ? '#f59e0b' : '#a1a1aa'} />
        <span>{ratingText || (isEvaluated ? 'Active' : 'Pending HR Appraisal')}</span>
      </div>

      {/* Evaluated By Strip */}
      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: '#8e8e98'
        }}
      >
        <ShieldCheck size={14} color={isEvaluated ? '#10b981' : '#f59e0b'} />
        <span>
          {isEvaluated
            ? `Rated by ${evaluatedBy || 'HR Director'}${reviewDate ? ` • ${reviewDate}` : ''}`
            : 'Pending evaluation by HR Manager'}
        </span>
      </div>
    </div>
  );
}
