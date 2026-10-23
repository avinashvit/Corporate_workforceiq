import React, { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Sliders,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Zap,
  Target,
  ArrowRight,
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import PerformanceGauge from '../components/visualizations/PerformanceGauge';
import SkillsRadarChart from '../components/visualizations/SkillsRadarChart';
import ProductivityAreaChart from '../components/visualizations/ProductivityAreaChart';
import AttendanceDonutChart from '../components/visualizations/AttendanceDonutChart';
import GoalsMilestonesList from '../components/visualizations/GoalsMilestonesList';
import CareerProgressionLadder from '../components/visualizations/CareerProgressionLadder';
import HRFeedbackDossier from '../components/visualizations/HRFeedbackDossier';
import EmployeeQRScannerModal from '../components/attendance/EmployeeQRScannerModal';
import { getCurrentUser } from '../utils/auth';
import {
  getAllEmployeeRecords,
  getEmployeeRecord,
  registerUnassignedEmployee,
  isEmployeeCheckedInToday,
  getTodayDateString,
  onEmployeeDataChange
} from '../utils/employeeData';

export default function EmployeeDashboard() {
  const currentUser = getCurrentUser();
  const [employeeData, setEmployeeData] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [todayCheckinLog, setTodayCheckinLog] = useState(null);

  const todayStr = getTodayDateString();

  const loadData = () => {
    let records = getAllEmployeeRecords();

    // If current logged in user is employee but not yet registered in employee records, register them
    if (currentUser && currentUser.email) {
      let currentRec = records.find(
        (r) => r.email.toLowerCase() === currentUser.email.toLowerCase()
      );

      if (!currentRec && currentUser.role === 'Employee') {
        currentRec = registerUnassignedEmployee({
          id: currentUser.userId || currentUser.id,
          name: currentUser.name || 'New Employee',
          email: currentUser.email,
          department: currentUser.department || 'General'
        });
        records = getAllEmployeeRecords();
      }

      setEmployeeData(currentRec || records[0] || null);

      if (currentRec) {
        const checked = isEmployeeCheckedInToday(currentRec.id);
        setIsCheckedInToday(checked);

        const logs = currentRec.metrics?.attendance?.dailyLogs || [];
        const todayLog = logs.find((l) => l.date === todayStr);
        setTodayCheckinLog(todayLog || null);
      }
    } else if (records.length > 0) {
      setEmployeeData(records[0]);
    }

    setLastSyncTime(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    loadData();

    // Subscribe to live HR and QR attendance updates
    const unsubscribe = onEmployeeDataChange(() => {
      loadData();
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!employeeData) {
    return (
      <DashboardLayout>
        <div
          style={{
            background: 'rgba(18, 17, 24, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center',
            color: '#ffffff',
            maxWidth: '560px',
            margin: '2rem auto'
          }}
        >
          <User size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            Welcome to WorkForceIQ
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
            Your account has been created. Awaiting HR assignment and initial appraisal.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { metrics, isAssigned } = employeeData;
  const isPerformanceCalculated = metrics?.performanceScore !== null && metrics?.performanceScore !== undefined;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
        {/* Top Profile & Sync Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(18, 17, 24, 0.95) 0%, rgba(30, 27, 40, 0.85) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '24px',
            padding: '1.75rem 2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          {/* Top highlight bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #fef08a, transparent)'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 2 }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.85rem',
                border: '2.5px solid #fef08a',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                flexShrink: 0
              }}
            >
              {employeeData.name ? employeeData.name.charAt(0) : <User size={32} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {employeeData.name}
                </h1>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.18rem 0.6rem',
                    borderRadius: '9999px',
                    background: isAssigned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: isAssigned ? '#6ee7b7' : '#fef08a',
                    border: `1px solid ${isAssigned ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`
                  }}
                >
                  {isAssigned ? 'Verified Employee' : 'Newly Registered'}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', color: '#fef08a', fontWeight: 600, marginBottom: '0.35rem' }}>
                {employeeData.position} • {employeeData.department}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: '#a1a1aa' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} color="#f59e0b" /> {employeeData.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={13} color="#f59e0b" /> Joined {employeeData.joinDate}
                </span>
                <span>ID: <code style={{ color: '#fef08a' }}>{employeeData.id}</code></span>
              </div>
            </div>
          </div>

          {/* Right Controls: QR Code Attendance Check-In Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', zIndex: 2 }}>
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                background: isCheckedInToday
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: isCheckedInToday ? '#6ee7b7' : '#ffffff',
                border: isCheckedInToday ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: isCheckedInToday ? '0 0 15px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.2s'
              }}
              id="employee-scan-qr-attendance-btn"
            >
              {isCheckedInToday ? (
                <>
                  <CheckCircle2 size={18} color="#34d399" />
                  <span>Checked In Today ({todayCheckinLog?.time || 'Present'})</span>
                </>
              ) : (
                <>
                  <QrCode size={18} />
                  <span>Scan Corporate QR Code for Attendance</span>
                </>
              )}
            </button>

            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
              <span>Live Synced with HR Console • {lastSyncTime}</span>
            </div>
          </div>
        </div>

        {/* Status Alert if newly registered and pending initial HR appraisal */}
        {!isPerformanceCalculated && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#fef08a', fontSize: '0.92rem' }}>
                Initial Appraisal In Progress by HR
              </strong>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#d4d4d8' }}>
                Your employee profile has been placed in the HR evaluation queue. Once HR completes your appraisal and calculates your performance score, your full performance metrics will be fully activated below. You can mark daily attendance using the QR scanner anytime!
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Metric Highlights (Driven by HR metrics) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                HR Calculated Performance
              </span>
              <Award size={15} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
              {isPerformanceCalculated ? `${metrics?.performanceScore}%` : 'Calculating...'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 600 }}>
              {metrics?.performanceRatingText}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                KPI Target Achievement
              </span>
              <Target size={15} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
              {metrics?.kpiTargetAchievement !== null && metrics?.kpiTargetAchievement !== undefined
                ? `${metrics.kpiTargetAchievement}%`
                : 'Pending'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              Quality Index:{' '}
              {metrics?.qualityIndex !== null && metrics?.qualityIndex !== undefined
                ? `${metrics.qualityIndex}%`
                : 'Pending'}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                QR Attendance Rate
              </span>
              <Calendar size={15} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
              {metrics?.attendance?.rate || 0}%
            </div>
            <span style={{ fontSize: '0.75rem', color: isCheckedInToday ? '#34d399' : '#38bdf8', fontWeight: 600 }}>
              {isCheckedInToday ? 'Checked in today' : `${metrics?.attendance?.presentDays || 0}d Verified`}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                Promotion Readiness
              </span>
              <TrendingUp size={15} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
              {metrics?.compensation?.promotionReadiness || 0}%
            </div>
            <span style={{ fontSize: '0.75rem', color: '#fcd34d', fontWeight: 600 }}>
              Target: {metrics?.compensation?.nextBand?.split('(')[0] || 'Pending Setup'}
            </span>
          </div>
        </div>

        {/* Visualizations Row 1: Performance Gauge & Skills Radar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
          <PerformanceGauge
            score={metrics?.performanceScore}
            ratingText={metrics?.performanceRatingText}
            evaluatedBy={metrics?.hrReview?.reviewedBy}
            reviewDate={metrics?.hrReview?.reviewDate}
          />
          <SkillsRadarChart skills={metrics?.skills} />
        </div>

        {/* Visualizations Row 2: Monthly Productivity Trend & Attendance Donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
          <ProductivityAreaChart monthlyData={metrics?.monthlyProductivity} />
          <AttendanceDonutChart attendance={metrics?.attendance} />
        </div>

        {/* Visualizations Row 3: Goals & Milestones + Career Progression Ladder */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
          <GoalsMilestonesList goals={metrics?.goals} />
          <CareerProgressionLadder
            compensation={metrics?.compensation}
            projects={metrics?.projects}
          />
        </div>

        {/* Visualizations Row 4: Official HR Appraisal Dossier */}
        <HRFeedbackDossier hrReview={metrics?.hrReview} />

        {/* QR Code Scanner Modal */}
        <EmployeeQRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          employee={employeeData}
          onAttendanceMarked={() => {
            loadData();
          }}
        />
      </div>
    </DashboardLayout>
  );
}
