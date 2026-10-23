import React from 'react';
import { DollarSign, Award, ChevronRight, Briefcase, Zap, CheckCircle2 } from 'lucide-react';

export default function CareerProgressionLadder({ compensation = {}, projects = {} }) {
  const {
    baseSalary = 'Pending HR Assignment',
    bonusPercentage = 0,
    lastAppraisalIncrease = 'Pending',
    currentBand = 'Pending HR Review',
    nextBand = 'Pending HR Review',
    promotionReadiness = 0
  } = compensation || {};

  const {
    completed = 0,
    inProgress = 0,
    csatScore = null
  } = projects || {};

  const isPendingAppraisal = !lastAppraisalIncrease || lastAppraisalIncrease === 'Pending' || lastAppraisalIncrease === 'N/A';

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
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Briefcase size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Career Ladder & Appraisal Metrics
          </span>
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            background: isPendingAppraisal ? 'rgba(255, 255, 255, 0.06)' : 'rgba(245, 158, 11, 0.15)',
            color: isPendingAppraisal ? '#a1a1aa' : '#fef08a',
            border: isPendingAppraisal ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(245, 158, 11, 0.35)',
            fontWeight: 700
          }}
        >
          {isPendingAppraisal ? 'Pending HR Setup' : `${lastAppraisalIncrease} Last Increment`}
        </span>
      </div>

      {/* Career Level Progression Strip */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.7rem', color: '#8e8e98', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Current Level
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
            {currentBand}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Advancement Path</span>
          <ChevronRight size={16} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
          <span style={{ fontSize: '0.7rem', color: '#8e8e98', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Target Promotion Level
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fef08a' }}>
            {nextBand}
          </span>
        </div>
      </div>

      {/* Promotion Readiness Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8' }}>
            Promotion Readiness Index
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>
            {promotionReadiness}% Ready
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${promotionReadiness}%`,
              height: '100%',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #f59e0b 0%, #34d399 100%)',
              transition: 'width 0.7s ease'
            }}
          />
        </div>
      </div>

      {/* Compensation & Delivery Mini Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.7rem', color: '#8e8e98', display: 'block' }}>Base Package</span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>{baseSalary}</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.7rem', color: '#8e8e98', display: 'block' }}>Annual Bonus</span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fef08a' }}>{bonusPercentage}% Tier</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.7rem', color: '#8e8e98', display: 'block' }}>Projects Delivered</span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>{completed}</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.7rem', color: '#8e8e98', display: 'block' }}>Client CSAT</span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
            {csatScore !== null && csatScore !== undefined ? `${csatScore} / 5.0` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
