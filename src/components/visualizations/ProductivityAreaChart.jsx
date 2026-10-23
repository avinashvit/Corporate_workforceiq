import React, { useState } from 'react';
import { TrendingUp, Activity, CheckCircle, ArrowUpRight } from 'lucide-react';

export default function ProductivityAreaChart({ monthlyData = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const hasData = Array.isArray(monthlyData) && monthlyData.length > 0;
  const data = hasData ? monthlyData : [];

  const width = 560;
  const height = 190;
  const padding = { top: 25, right: 25, bottom: 35, left: 35 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const minScore = 60;
  const maxScore = 100;

  // Calculate points
  const points = hasData
    ? data.map((d, index) => {
        const x = padding.left + (index / Math.max(1, data.length - 1)) * graphWidth;
        const y = padding.top + graphHeight - ((d.score - minScore) / (maxScore - minScore)) * graphHeight;
        return { x, y, ...d };
      })
    : [];

  // Generate smooth SVG curve path (cubic bezier)
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = hasData && points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`
    : '';

  // Compute average and peak
  const avgScore = hasData ? Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length) : null;
  const latestItem = hasData ? data[data.length - 1] : null;

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
      {/* Header and Quick Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
            <TrendingUp size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Output & Productivity Trajectory
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: 0 }}>
            Monthly deliverable execution score logged and appraised by HR.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#8e8e98', display: 'block' }}>Average Velocity</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fef08a' }}>
              {hasData ? `${avgScore}%` : 'Pending'}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#8e8e98', display: 'block' }}>Current Velocity</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '2px' }}>
              {latestItem ? `${latestItem.score}%` : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Body or Empty State */}
      {hasData ? (
        <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', minWidth: '420px', display: 'block' }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="curveStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>

              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {[60, 70, 80, 90, 100].map((val) => {
              const y = padding.top + graphHeight - ((val - minScore) / (maxScore - minScore)) * graphHeight;
              return (
                <g key={`grid-y-${val}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#71717a"
                    fontWeight="600"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

            {/* Curved Line Stroke */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#curveStrokeGrad)"
                strokeWidth="3"
                filter="url(#lineGlow)"
                strokeLinecap="round"
              />
            )}

            {/* Month X-axis Labels */}
            {points.map((p, idx) => (
              <g key={`axis-x-${idx}`}>
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill={hoveredIndex === idx ? '#fef08a' : '#8e8e98'}
                  fontWeight={hoveredIndex === idx ? '800' : '600'}
                >
                  {p.month}
                </text>
              </g>
            ))}

            {/* Data Points on Line */}
            {points.map((p, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g
                  key={`point-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 7 : 4.5}
                    fill={isHovered ? '#ffffff' : '#f59e0b'}
                    stroke={isHovered ? '#f59e0b' : '#0e0d12'}
                    strokeWidth="2.5"
                    style={{ transition: 'all 0.15s ease' }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hovered Tooltip Card */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: `${Math.min(75, Math.max(15, (points[hoveredIndex].x / width) * 100))}%`,
                transform: 'translateX(-50%)',
                background: 'rgba(12, 11, 17, 0.95)',
                border: '1px solid #f59e0b',
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                fontSize: '0.78rem',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                zIndex: 10
              }}
            >
              <div>
                <span style={{ color: '#fcd34d', fontWeight: 800 }}>{points[hoveredIndex].month}</span>
                <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>
                  {points[hoveredIndex].score}% Velocity
                </div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '0.5rem', color: '#a1a1aa' }}>
                <span>{points[hoveredIndex].tasks} deliverables</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '14px',
            border: '1px dashed rgba(245, 158, 11, 0.25)',
            padding: '1.25rem',
            margin: '0.5rem 0'
          }}
        >
          <Activity size={34} color="#f59e0b" style={{ marginBottom: '0.6rem', opacity: 0.85 }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
            No Monthly Output Points Logged Yet
          </span>
          <span style={{ fontSize: '0.78rem', color: '#a1a1aa', maxWidth: '380px', marginTop: '0.25rem' }}>
            Monthly deliverable execution trajectory will be charted here automatically once appraisal reviews are conducted by HR.
          </span>
        </div>
      )}

      {/* Footer Insight */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.76rem',
          color: '#8e8e98'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle size={13} color={hasData ? '#10b981' : '#f59e0b'} />
          <span>
            {hasData
              ? `Logged Data Points: ${data.length} review cycles`
              : 'Awaiting Initial HR Monthly Review'}
          </span>
        </div>
        <span>Evaluation Cadence: Monthly</span>
      </div>
    </div>
  );
}
