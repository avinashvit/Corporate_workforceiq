import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  BarChart2,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  Sliders,
  TrendingUp,
  User,
  Zap,
  Sparkles,
  Calculator,
  Briefcase
} from 'lucide-react';
import { evaluateAndAssignEmployee } from '../utils/employeeData';

export default function HREvaluationModal({ employee, isOpen, onClose, onSaved }) {
  if (!isOpen || !employee) return null;

  const [activeTab, setActiveTab] = useState('performance');
  const [formData, setFormData] = useState({
    // Basic assignment info
    position: employee.position === 'Pending HR Assignment' ? 'Associate Specialist' : (employee.position || 'Product Designer'),
    department: employee.department || 'Product Design & UX',

    // Core Performance
    performanceScore: employee.metrics?.performanceScore !== null && employee.metrics?.performanceScore !== undefined
      ? employee.metrics?.performanceScore
      : 88,
    performanceRatingText: employee.metrics?.performanceRatingText || 'Strong Performer (High Impact)',
    kpiTargetAchievement: employee.metrics?.kpiTargetAchievement || 88,
    qualityIndex: employee.metrics?.qualityIndex || 92,
    efficiencyScore: employee.metrics?.efficiencyScore || 86,

    // Skills Matrix
    skills: {
      technicalMastery: employee.metrics?.skills?.technicalMastery || 85,
      problemSolving: employee.metrics?.skills?.problemSolving || 88,
      communication: employee.metrics?.skills?.communication || 85,
      leadership: employee.metrics?.skills?.leadership || 78,
      deliverySpeed: employee.metrics?.skills?.deliverySpeed || 86,
      creativityInnovation: employee.metrics?.skills?.creativityInnovation || 90
    },

    // Attendance
    attendance: {
      presentDays: employee.metrics?.attendance?.presentDays ?? 0,
      remoteDays: employee.metrics?.attendance?.remoteDays ?? 0,
      casualLeaves: employee.metrics?.attendance?.casualLeaves ?? 0,
      sickLeaves: employee.metrics?.attendance?.sickLeaves ?? 0,
      totalWorkingDays: employee.metrics?.attendance?.totalWorkingDays ?? 20,
      punctualityRate: employee.metrics?.attendance?.punctualityRate ?? 100
    },

    // Productivity History
    monthlyProductivity: employee.metrics?.monthlyProductivity || [
      { month: 'Jul', score: 82, tasks: 20 },
      { month: 'Aug', score: 85, tasks: 24 },
      { month: 'Sep', score: 88, tasks: 27 },
      { month: 'Oct', score: 91, tasks: 32 }
    ],

    // Compensation & Career
    compensation: {
      baseSalary: employee.metrics?.compensation?.baseSalary || '$105,000',
      bonusPercentage: employee.metrics?.compensation?.bonusPercentage || 12,
      lastAppraisalIncrease: employee.metrics?.compensation?.lastAppraisalIncrease || '+10.0%',
      currentBand: employee.metrics?.compensation?.currentBand || 'Level 2 (Associate Specialist)',
      nextBand: employee.metrics?.compensation?.nextBand || 'Level 3 (Senior Specialist)',
      promotionReadiness: employee.metrics?.compensation?.promotionReadiness || 75
    },

    // HR Review Remarks & Badges
    hrReview: {
      feedback: employee.metrics?.hrReview?.feedback || 'Demonstrates strong technical aptitude and steady collaboration across initial tasks.',
      nextReviewDate: employee.metrics?.hrReview?.nextReviewDate || 'Jan 15, 2027',
      badgesString: (employee.metrics?.hrReview?.badges || ['New Talent', 'Fast Learner']).join(', ')
    }
  });

  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Sync state if employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        position: employee.position === 'Pending HR Assignment' ? 'Associate Specialist' : (employee.position || 'Product Designer'),
        department: employee.department || 'Product Design & UX',
        performanceScore: employee.metrics?.performanceScore !== null && employee.metrics?.performanceScore !== undefined
          ? employee.metrics?.performanceScore
          : 88,
        performanceRatingText: employee.metrics?.performanceRatingText || 'Strong Performer (High Impact)',
        kpiTargetAchievement: employee.metrics?.kpiTargetAchievement || 88,
        qualityIndex: employee.metrics?.qualityIndex || 92,
        efficiencyScore: employee.metrics?.efficiencyScore || 86,
        skills: {
          technicalMastery: employee.metrics?.skills?.technicalMastery || 85,
          problemSolving: employee.metrics?.skills?.problemSolving || 88,
          communication: employee.metrics?.skills?.communication || 85,
          leadership: employee.metrics?.skills?.leadership || 78,
          deliverySpeed: employee.metrics?.skills?.deliverySpeed || 86,
          creativityInnovation: employee.metrics?.skills?.creativityInnovation || 90
        },
        attendance: {
          presentDays: employee.metrics?.attendance?.presentDays ?? 0,
          remoteDays: employee.metrics?.attendance?.remoteDays ?? 0,
          casualLeaves: employee.metrics?.attendance?.casualLeaves ?? 0,
          sickLeaves: employee.metrics?.attendance?.sickLeaves ?? 0,
          totalWorkingDays: employee.metrics?.attendance?.totalWorkingDays ?? 20,
          punctualityRate: employee.metrics?.attendance?.punctualityRate ?? 100
        },
        monthlyProductivity: employee.metrics?.monthlyProductivity || [],
        compensation: {
          baseSalary: employee.metrics?.compensation?.baseSalary || '$105,000',
          bonusPercentage: employee.metrics?.compensation?.bonusPercentage || 12,
          lastAppraisalIncrease: employee.metrics?.compensation?.lastAppraisalIncrease || '+10.0%',
          currentBand: employee.metrics?.compensation?.currentBand || 'Level 2 (Associate Specialist)',
          nextBand: employee.metrics?.compensation?.nextBand || 'Level 3 (Senior Specialist)',
          promotionReadiness: employee.metrics?.compensation?.promotionReadiness || 75
        },
        hrReview: {
          feedback: employee.metrics?.hrReview?.feedback || 'Demonstrates strong technical aptitude and steady collaboration across initial tasks.',
          nextReviewDate: employee.metrics?.hrReview?.nextReviewDate || 'Jan 15, 2027',
          badgesString: (employee.metrics?.hrReview?.badges || ['New Talent', 'Fast Learner']).join(', ')
        }
      });
    }
  }, [employee]);

  // Auto-calculate performance score based on KPI, Quality, Skills, and Attendance
  const handleAutoCalculateScore = () => {
    const kpi = Number(formData.kpiTargetAchievement) || 85;
    const quality = Number(formData.qualityIndex) || 90;
    const skillsList = Object.values(formData.skills);
    const avgSkill = skillsList.length > 0 ? skillsList.reduce((a, b) => a + Number(b), 0) / skillsList.length : 80;
    const attRate = Math.min(100, (Number(formData.attendance.presentDays) + Number(formData.attendance.remoteDays)) / (Number(formData.attendance.totalWorkingDays) || 20) * 100);

    const calculated = Math.round(kpi * 0.4 + quality * 0.3 + avgSkill * 0.2 + attRate * 0.1);
    handleScoreChange(calculated);
  };

  const handleScoreChange = (score) => {
    const val = Number(score);
    let label = 'Needs Improvement';
    if (val >= 90) label = 'Exceeds Expectations (Top Tier)';
    else if (val >= 80) label = 'Strong Performer (High Impact)';
    else if (val >= 70) label = 'Meets Key Objectives';
    else if (val >= 60) label = 'Developing Competency';

    setFormData((prev) => ({
      ...prev,
      performanceScore: val,
      performanceRatingText: label
    }));
  };

  const handleSkillChange = (key, val) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [key]: Number(val)
      }
    }));
  };

  const handleAttendanceChange = (key, val) => {
    const numericVal = Number(val);
    setFormData((prev) => {
      const updatedAttendance = { ...prev.attendance, [key]: numericVal };
      const totalDays = updatedAttendance.totalWorkingDays || 20;
      const attended = (updatedAttendance.presentDays || 0) + (updatedAttendance.remoteDays || 0);
      const calculatedRate = Math.min(100, Math.round((attended / totalDays) * 1000) / 10);
      return {
        ...prev,
        attendance: {
          ...updatedAttendance,
          rate: calculatedRate
        }
      };
    });
  };

  const handleSave = () => {
    setSaving(true);
    const badgesArray = formData.hrReview.badgesString
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const totalWorking = Number(formData.attendance.totalWorkingDays) || 20;
    const attended = Number(formData.attendance.presentDays) + Number(formData.attendance.remoteDays);
    const calculatedRate = Math.min(100, Math.round((attended / totalWorking) * 1000) / 10);

    const payload = {
      performanceScore: Number(formData.performanceScore),
      performanceRatingText: formData.performanceRatingText,
      kpiTargetAchievement: Number(formData.kpiTargetAchievement),
      qualityIndex: Number(formData.qualityIndex),
      efficiencyScore: Number(formData.efficiencyScore),
      skills: formData.skills,
      attendance: {
        ...formData.attendance,
        rate: calculatedRate
      },
      monthlyProductivity: formData.monthlyProductivity,
      compensation: formData.compensation,
      hrReview: {
        feedback: formData.hrReview.feedback,
        nextReviewDate: formData.hrReview.nextReviewDate,
        badges: badgesArray.length > 0 ? badgesArray : ['Recognized Contributor']
      }
    };

    setTimeout(() => {
      const res = evaluateAndAssignEmployee(
        employee.id,
        payload,
        { position: formData.position, department: formData.department }
      );
      setSaving(false);
      if (res.success) {
        setSuccessToast(true);
        setTimeout(() => {
          setSuccessToast(false);
          if (onSaved) onSaved(res.record);
          onClose();
        }, 900);
      }
    }, 350);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      id="hr-evaluation-modal"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          background: 'rgba(18, 17, 24, 0.98)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(245, 158, 11, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                border: '2px solid #fef08a',
                boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)'
              }}
            >
              {employee.name?.charAt(0) || <User size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  HR Evaluation: {employee.name}
                </h2>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    background: employee.isAssigned ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: employee.isAssigned ? '#6ee7b7' : '#fef08a',
                    border: `1px solid ${employee.isAssigned ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                    fontWeight: 700
                  }}
                >
                  {employee.isAssigned ? 'Assigned' : 'Unassigned (Needs Setup)'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#a1a1aa' }}>
                {employee.email} • ID: {employee.id}
              </p>
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
            id="close-hr-modal-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 2rem 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
            background: 'rgba(10, 9, 14, 0.7)'
          }}
        >
          {[
            { id: 'performance', label: '1. Role & Performance Score', icon: Award },
            { id: 'skills', label: '2. Skills Radar (6-Axis)', icon: Sliders },
            { id: 'attendance', label: '3. Attendance Parameters', icon: Calendar },
            { id: 'career', label: '4. Compensation & Band', icon: DollarSign },
            { id: 'review', label: '5. Appraisal Remarks', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1rem',
                  border: 'none',
                  borderBottom: active ? '2px solid #f59e0b' : '2px solid transparent',
                  background: 'none',
                  color: active ? '#fef08a' : '#8e8e98',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                id={`tab-${tab.id}`}
              >
                <Icon size={14} color={active ? '#f59e0b' : '#8e8e98'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.75rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* TAB 1: ROLE & PERFORMANCE SCORE */}
          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Role & Department Assignment */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}
              >
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.35rem' }}>
                    Assigned Job Title / Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Senior Product Designer, Lead Engineer"
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 600, boxSizing: 'border-box' }}
                    id="hr-assign-position-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.35rem' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 600, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Score Calculation Hero */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 600, textTransform: 'uppercase' }}>
                    Calculated Overall Performance
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
                    {formData.performanceScore}%
                  </div>
                  <div style={{ color: '#6ee7b7', fontSize: '0.9rem', fontWeight: 600 }}>
                    {formData.performanceRatingText}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoCalculateScore}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid #f59e0b',
                    color: '#fef08a',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                  id="auto-calculate-score-btn"
                >
                  <Calculator size={14} />
                  <span>Auto-Calculate Weighted Score</span>
                </button>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
                  <span>Manual Score Override / Fine-Tuning</span>
                  <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{formData.performanceScore}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.performanceScore}
                  onChange={(e) => handleScoreChange(e.target.value)}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                  id="hr-input-performance-score"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    KPI Target Achievement (%)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={formData.kpiTargetAchievement}
                    onChange={(e) => setFormData({ ...formData, kpiTargetAchievement: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    Deliverable Quality Index (%)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={formData.qualityIndex}
                    onChange={(e) => setFormData({ ...formData, qualityIndex: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    Efficiency Score (%)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={formData.efficiencyScore}
                    onChange={(e) => setFormData({ ...formData, efficiencyScore: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS RADAR (6 AXES) */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ color: '#d4d4d8', fontSize: '0.88rem', margin: 0 }}>
                Adjust the 6 competency dimensions (0 - 100) to render the employee's 6-Axis Spider Radar chart.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {[
                  { key: 'technicalMastery', label: 'Technical Mastery' },
                  { key: 'problemSolving', label: 'Problem Solving' },
                  { key: 'communication', label: 'Communication & Teamwork' },
                  { key: 'leadership', label: 'Leadership & Mentorship' },
                  { key: 'deliverySpeed', label: 'Delivery Velocity' },
                  { key: 'creativityInnovation', label: 'Creativity & Innovation' }
                ].map((skill) => (
                  <div
                    key={skill.key}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '1.1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>{skill.label}</span>
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>{formData.skills[skill.key]}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={formData.skills[skill.key]}
                      onChange={(e) => handleSkillChange(skill.key, e.target.value)}
                      style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ color: '#d4d4d8', fontSize: '0.88rem', margin: 0 }}>
                Baseline attendance parameters. When employee scans the daily QR code, their present days and attendance percentage update automatically.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    Present Days (QR Verified)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="260"
                    value={formData.attendance.presentDays}
                    onChange={(e) => handleAttendanceChange('presentDays', e.target.value)}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    Total Working Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="260"
                    value={formData.attendance.totalWorkingDays}
                    onChange={(e) => handleAttendanceChange('totalWorkingDays', e.target.value)}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAREER & COMPENSATION */}
          {activeTab === 'career' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    Base Annual Compensation
                  </label>
                  <input
                    type="text"
                    value={formData.compensation.baseSalary}
                    onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, baseSalary: e.target.value } })}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    Current Career Band
                  </label>
                  <input
                    type="text"
                    value={formData.compensation.currentBand}
                    onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, currentBand: e.target.value } })}
                    style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                    Promotion Readiness Index (%)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={formData.compensation.promotionReadiness}
                      onChange={(e) => setFormData({ ...formData, compensation: { ...formData.compensation, promotionReadiness: Number(e.target.value) } })}
                      style={{ flex: 1, accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#f59e0b', fontWeight: 700, minWidth: '40px' }}>
                      {formData.compensation.promotionReadiness}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: APPRAISAL REMARKS */}
          {activeTab === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                  Official Appraisal Feedback & Commendation
                </label>
                <textarea
                  rows={4}
                  value={formData.hrReview.feedback}
                  onChange={(e) => setFormData({ ...formData, hrReview: { ...formData.hrReview, feedback: e.target.value } })}
                  style={{
                    width: '100%',
                    background: '#0e0d12',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                  id="hr-review-feedback-textarea"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.4rem' }}>
                  Conferred Badges (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.hrReview.badgesString}
                  onChange={(e) => setFormData({ ...formData, hrReview: { ...formData.hrReview, badgesString: e.target.value } })}
                  placeholder="e.g. Innovation Champion, Fast Learner, Reliable Contributor"
                  style={{ width: '100%', background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.6rem', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(10, 9, 14, 0.85)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.82rem' }}>
            <Sparkles size={14} color="#f59e0b" />
            <span>Saves evaluation and dynamically generates employee visualizations</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#d4d4d8',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
              }}
              id="save-hr-evaluation-btn"
            >
              {saving ? (
                <span>Calculating & Publishing...</span>
              ) : successToast ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Evaluation Published!</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Assign & Publish Metrics</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
