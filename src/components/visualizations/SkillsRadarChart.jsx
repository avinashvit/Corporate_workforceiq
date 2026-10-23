import React, { useState } from 'react';
import { Sliders, Sparkles } from 'lucide-react';

export default function SkillsRadarChart({ skills = {} }) {
  const [hoveredAxis, setHoveredAxis] = useState(null);

  const axes = [
    { key: 'technicalMastery', label: 'Technical Mastery', short: 'Tech' },
    { key: 'problemSolving', label: 'Problem Solving', short: 'Problem' },
    { key: 'communication', label: 'Communication', short: 'Comm' },
    { key: 'leadership', label: 'Leadership', short: 'Lead' },
    { key: 'deliverySpeed', label: 'Delivery Velocity', short: 'Speed' },
    { key: 'creativityInnovation', label: 'Innovation', short: 'Innovate' }
  ];

  const hasSkillsEvaluated = Object.values(skills || {}).some((v) => Number(v) > 0);

  const size = 320;
  const center = size / 2;
  const maxRadius = 110;
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to calculate coordinates
  const getCoordinates = (radius, angle) => {
    // Start from top (- PI / 2)
    const adjustedAngle = angle - Math.PI / 2;
    return {
      x: center + radius * Math.cos(adjustedAngle),
      y: center + radius * Math.sin(adjustedAngle)
    };
  };

  // Generate grid polygon points
  const getGridPolygonPoints = (levelRatio) => {
    return axes
      .map((_, i) => {
        const { x, y } = getCoordinates(maxRadius * levelRatio, i * angleStep);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Generate data polygon points
  const dataPoints = axes.map((axis, i) => {
    const rawVal = hasSkillsEvaluated ? Number(skills[axis.key]) || 0 : 0;
    const clamped = Math.max(0, Math.min(100, rawVal));
    const radius = (clamped / 100) * maxRadius;
    const coords = getCoordinates(radius, i * angleStep);
    return {
      ...coords,
      value: clamped,
      axis: axis.label,
      short: axis.short,
      key: axis.key
    };
  });

  const polygonPointsString = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sliders size={15} color="#f59e0b" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            6-Axis Competency Radar
          </span>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            background: hasSkillsEvaluated ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.06)',
            color: hasSkillsEvaluated ? '#fef08a' : '#d4d4d8',
            border: hasSkillsEvaluated ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            fontWeight: 700
          }}
        >
          {hasSkillsEvaluated ? 'HR Assessed' : 'Awaiting HR Evaluation'}
        </span>
      </div>

      <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0 0 1rem 0' }}>
        {hasSkillsEvaluated
          ? 'Dynamic polygonal visualization mapping the 6 skill competencies verified by HR.'
          : 'Competency matrix will be charted here once HR evaluates and assigns your skill scores.'}
      </p>

      {/* SVG Canvas */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </radialGradient>
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Web concentric polygons */}
          {levels.map((level, idx) => (
            <polygon
              key={`grid-${idx}`}
              points={getGridPolygonPoints(level)}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray={idx === levels.length - 1 ? 'none' : '2,2'}
            />
          ))}

          {/* Spokes / Axis lines */}
          {axes.map((_, i) => {
            const { x, y } = getCoordinates(maxRadius, i * angleStep);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Filled Data Polygon */}
          <polygon
            points={polygonPointsString}
            fill="url(#radarFillGrad)"
            stroke="#f59e0b"
            strokeWidth="2.5"
            filter="url(#radarGlow)"
            style={{
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          {/* Vertices / Data Nodes with interactive hover */}
          {dataPoints.map((point, i) => {
            const isHovered = hoveredAxis === point.key;
            return (
              <g key={`point-${i}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 6 : 4.5}
                  fill={isHovered ? '#fef08a' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={() => setHoveredAxis(point.key)}
                  onMouseLeave={() => setHoveredAxis(null)}
                />
              </g>
            );
          })}

          {/* Axis Labels positioned outside */}
          {axes.map((axis, i) => {
            const { x, y } = getCoordinates(maxRadius + 22, i * angleStep);
            const score = hasSkillsEvaluated ? Number(skills[axis.key]) || 0 : null;
            const isHovered = hoveredAxis === axis.key;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHovered ? '#fef08a' : '#d4d4d8'}
                fontSize="10"
                fontWeight={isHovered ? '800' : '600'}
                fontFamily="inherit"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                {axis.short} {score !== null ? `(${score}%)` : ''}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip if vertex is hovered */}
        {hoveredAxis && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              padding: '0.35rem 0.8rem',
              background: 'rgba(12, 11, 17, 0.95)',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Sparkles size={12} color="#f59e0b" />
            <span>
              {axes.find((a) => a.key === hoveredAxis)?.label}:{' '}
              <strong style={{ color: '#fef08a' }}>
                {hasSkillsEvaluated ? `${skills[hoveredAxis] || 0}%` : 'Pending HR Evaluation'}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Breakdown chips below radar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          marginTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '0.75rem'
        }}
      >
        {axes.map((axis) => {
          const score = hasSkillsEvaluated ? `${skills[axis.key] || 0}%` : '—';
          return (
            <div
              key={`chip-${axis.key}`}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '0.68rem', color: '#8e8e98' }}>{axis.short}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: hasSkillsEvaluated ? '#ffffff' : '#fef08a' }}>
                {score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
