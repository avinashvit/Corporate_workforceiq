import React from 'react';
import { Award, ShieldCheck, Calendar, Sparkles, MessageSquareQuote } from 'lucide-react';

export default function HRFeedbackDossier({ hrReview = {} }) {
  const {
    reviewedBy = 'Pending Review',
    reviewerRole = 'HR Director',
    reviewDate = 'Pending',
    nextReviewDate = 'TBD',
    feedback = 'Newly registered employee. Awaiting initial performance appraisal and metrics setup by HR.',
    badges = []
  } = hrReview || {};

  const isPending = !reviewedBy || reviewedBy === 'Pending Review' || reviewedBy === 'Pending';

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
          <MessageSquareQuote size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Official HR Appraisal & Endorsement
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isPending ? '#fef08a' : '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
          <ShieldCheck size={14} />
          <span>{isPending ? 'Pending Evaluation' : 'Verified HR Record'}</span>
        </div>
      </div>

      {/* Quote Block */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.05)',
          borderLeft: '3px solid #f59e0b',
          borderRadius: '0 12px 12px 0',
          padding: '1rem 1.25rem',
          fontSize: '0.88rem',
          color: '#e4e4e7',
          lineHeight: '1.6',
          fontStyle: 'italic',
          marginBottom: '1.25rem'
        }}
      >
        "{feedback}"
      </div>

      {/* Badges strip */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.72rem', color: '#8e8e98', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
          Conferred Honors & Recognition
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {badges && badges.length > 0 ? (
            badges.map((badge, idx) => (
              <div
                key={`badge-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fef08a',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)'
                }}
              >
                <Award size={13} color="#f59e0b" />
                <span>{badge}</span>
              </div>
            ))
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#8e8e98' }}>
              No honors or milestone badges assigned yet by HR.
            </span>
          )}
        </div>
      </div>

      {/* Sign-off Strip */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: '#a1a1aa'
        }}
      >
        <div>
          <span>Appraised By: </span>
          <strong style={{ color: '#ffffff' }}>{reviewedBy}</strong> ({reviewerRole}) on {reviewDate}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} color="#f59e0b" />
          <span>Next Appraisal Cycle: <strong style={{ color: '#fef08a' }}>{nextReviewDate}</strong></span>
        </div>
      </div>
    </div>
  );
}
