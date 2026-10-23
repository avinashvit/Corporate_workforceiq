import React from 'react';
import { Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function GoalsMilestonesList({ goals = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.35)' };
      case 'Near Completion':
      case 'In Progress':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fef08a', border: 'rgba(245, 158, 11, 0.35)' };
      case 'On Track':
      default:
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.35)' };
    }
  };

  const avgProgress = goals && goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
    : 0;

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
          <Target size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quarterly Goals & Milestones
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#8e8e98' }}>Overall Milestone Progress:</span>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              background: goals && goals.length > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              color: goals && goals.length > 0 ? '#fef08a' : '#a1a1aa',
              border: goals && goals.length > 0 ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {avgProgress}%
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
        {(!goals || goals.length === 0) ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              border: '1px dashed rgba(245, 158, 11, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Target size={28} color="#f59e0b" style={{ marginBottom: '0.4rem', opacity: 0.85 }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              No Quarterly Milestones Assigned
            </span>
            <span style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
              Key performance milestones and weights will be configured here by HR.
            </span>
          </div>
        ) : (
          goals.map((goal, idx) => {
          const statusStyle = getStatusColor(goal.status);
          return (
            <div
              key={goal.id || idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#a1a1aa',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px'
                    }}
                  >
                    {goal.id || `G-${idx + 1}`}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                    {goal.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#8e8e98' }}>Weight: {goal.weight || '25%'}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '9999px',
                      background: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.border}`
                    }}
                  >
                    {goal.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>
                  <span>Timeline: {goal.dueDate}</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>{goal.progress}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '7px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${goal.progress}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: goal.progress === 100
                        ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(90deg, #f59e0b 0%, #fef08a 100%)',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
