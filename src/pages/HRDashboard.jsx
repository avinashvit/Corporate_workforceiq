import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Calendar,
  Search,
  Filter,
  Sliders,
  TrendingUp,
  CheckCircle2,
  Clock,
  Briefcase,
  ShieldCheck,
  Building,
  Sparkles,
  QrCode,
  UserCheck,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import HREvaluationModal from '../components/HREvaluationModal';
import CorporateQRModal from '../components/attendance/CorporateQRModal';
import {
  getAllEmployeeRecords,
  getLiveAttendanceFeed,
  onEmployeeDataChange
} from '../utils/employeeData';

export default function HRDashboard() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [liveAttendanceFeed, setLiveAttendanceFeed] = useState([]);

  const loadData = () => {
    const list = getAllEmployeeRecords();
    setEmployees(list);
    setLiveAttendanceFeed(getLiveAttendanceFeed());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = onEmployeeDataChange(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  // Separate unassigned employees awaiting HR performance calculation vs assigned active employees
  const unassignedEmployees = employees.filter((e) => !e.isAssigned || e.status === 'unassigned');
  const assignedEmployees = employees.filter((e) => e.isAssigned && e.status !== 'unassigned');

  // Filtered employees for directory table
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.position || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // Calculate Organization-wide aggregate stats
  const totalEmployees = employees.length;
  const evaluatedEmployees = employees.filter((e) => e.isEvaluated && e.metrics?.performanceScore !== null);
  const avgPerformance = evaluatedEmployees.length > 0
    ? Math.round(evaluatedEmployees.reduce((acc, e) => acc + (e.metrics?.performanceScore || 0), 0) / evaluatedEmployees.length)
    : 0;
  const avgAttendance = totalEmployees > 0
    ? (employees.reduce((acc, e) => acc + (e.metrics?.attendance?.rate || 0), 0) / totalEmployees).toFixed(1)
    : '0.0';

  const departments = ['All', ...new Set(employees.map((e) => e.department).filter(Boolean))];

  const handleOpenEvaluation = (emp) => {
    setSelectedEmployeeForEdit(emp);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
        {/* HR Command Header */}
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
          {/* Glowing highlight */}
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

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fef08a',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                <ShieldCheck size={14} />
                <span>HR Administration Console</span>
              </div>
              <span style={{ color: '#8e8e98', fontSize: '0.8rem' }}>• Corporate Workforce Registry</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
              Employee Performance & QR Attendance Hub
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#d4d4d8', maxWidth: '640px' }}>
              When a new employee registers, they appear in the queue below for assignment and performance score calculation. Project the Daily QR Code to enable smartphone attendance check-ins.
            </p>
          </div>

          {/* Action Buttons: Project Daily Attendance QR Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.2s'
              }}
              id="open-attendance-qr-btn"
            >
              <QrCode size={18} />
              <span>Project Daily Attendance QR Code</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Registered Employees
              </span>
              <Users size={16} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
              {totalEmployees}
            </div>
            <span style={{ fontSize: '0.75rem', color: unassignedEmployees.length > 0 ? '#fcd34d' : '#10b981', fontWeight: 600 }}>
              {unassignedEmployees.length > 0 ? `${unassignedEmployees.length} Pending Assignment` : 'All Assigned'}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                Average Calculated Score
              </span>
              <Award size={16} color="#fef08a" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
              {avgPerformance ? `${avgPerformance}%` : 'N/A'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 600 }}>
              {evaluatedEmployees.length} Evaluated
            </span>
          </div>

          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                QR Attendance Rate
              </span>
              <Calendar size={16} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
              {avgAttendance}%
            </div>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
              Scanned via Smartphone QR
            </span>
          </div>

          <div
            style={{
              background: 'rgba(18, 17, 24, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8e8e98', textTransform: 'uppercase', fontWeight: 600 }}>
                Today's QR Check-Ins
              </span>
              <Clock size={16} color="#10b981" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>
              {liveAttendanceFeed.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              Live Logged Today
            </span>
          </div>
        </div>

        {/* SECTION 1: UNASSIGNED EMPLOYEES QUEUE (PENDING HR EVALUATION) */}
        {unassignedEmployees.length > 0 && (
          <div
            style={{
              background: 'rgba(18, 17, 24, 0.95)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.15)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b'
                  }}
                >
                  <AlertTriangle size={17} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Newly Registered Employees Awaiting HR Evaluation ({unassignedEmployees.length})
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#fde68a' }}>
                    These users have signed up as employees. Calculate their performance score and assign their role metrics.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem' }}>
              {unassignedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '14px',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        border: '1.5px solid #fef08a'
                      }}
                    >
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.98rem' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.76rem', color: '#8e8e98' }}>{emp.email} • {emp.id}</div>
                      <div style={{ fontSize: '0.74rem', color: '#fef08a', marginTop: '2px' }}>
                        Dept: {emp.department} • Joined {emp.joinDate}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      color: '#fef08a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Clock size={13} />
                    <span>Performance Score: Not calculated yet</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEvaluation(emp)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
                    }}
                    id={`assign-emp-btn-${emp.id}`}
                  >
                    <Sliders size={14} />
                    <span>Assign & Calculate Performance</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: LIVE QR CHECK-IN FEED */}
        <div
          style={{
            background: 'rgba(18, 17, 24, 0.85)',
            border: '1px solid rgba(253, 230, 138, 0.15)',
            borderRadius: '18px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrCode size={16} color="#f59e0b" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Smartphone QR Attendance Feed
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
              {liveAttendanceFeed.length} Attendance Verified Today
            </span>
          </div>

          {liveAttendanceFeed.length === 0 ? (
            <div style={{ padding: '0.75rem 0', fontSize: '0.82rem', color: '#71717a', fontStyle: 'italic' }}>
              No QR scans logged today yet. Click <strong>"Project Daily Attendance QR Code"</strong> above to allow employees to scan with their phones.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.65rem' }}>
              {liveAttendanceFeed.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#10b981" />
                    <div>
                      <strong style={{ color: '#ffffff' }}>{log.employeeName}</strong>
                      <div style={{ fontSize: '0.7rem', color: '#8e8e98' }}>{log.method}</div>
                    </div>
                  </div>
                  <span style={{ color: '#fef08a', fontWeight: 700 }}>{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: EMPLOYEE DIRECTORY TABLE */}
        <div
          style={{
            background: 'rgba(18, 17, 24, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.28)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Filter Bar */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Workforce Directory & Appraisal Registry
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#8e8e98', margin: '0.2rem 0 0 0' }}>
                All employees managed by HR. Only employees who sign in appear here.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0e0d12', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <Search size={14} color="#f59e0b" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              {departments.length > 1 && (
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  style={{ background: '#0e0d12', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem' }}
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Table */}
          {filteredEmployees.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#8e8e98' }}>
              <Users size={44} color="#f59e0b" style={{ marginBottom: '0.75rem', opacity: 0.7 }} />
              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                No Employees Registered Yet
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#a1a1aa', maxWidth: '440px', margin: '0 auto' }}>
                When a new user registers as an Employee on the sign-in page, they will automatically appear here as an unassigned employee for HR evaluation and performance calculation.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <th style={{ padding: '0.9rem 1.25rem', color: '#8e8e98', fontWeight: 600 }}>Employee</th>
                    <th style={{ padding: '0.9rem 1rem', color: '#8e8e98', fontWeight: 600 }}>Department & Title</th>
                    <th style={{ padding: '0.9rem 1rem', color: '#8e8e98', fontWeight: 600 }}>Calculated Score</th>
                    <th style={{ padding: '0.9rem 1rem', color: '#8e8e98', fontWeight: 600 }}>QR Attendance</th>
                    <th style={{ padding: '0.9rem 1rem', color: '#8e8e98', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '0.9rem 1.25rem', color: '#8e8e98', fontWeight: 600, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => {
                    const m = emp.metrics || {};
                    return (
                      <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1rem',
                                border: '1.5px solid #fef08a'
                              }}
                            >
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#ffffff' }}>{emp.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#8e8e98' }}>{emp.id} • {emp.email}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1rem' }}>
                          <div style={{ color: '#ffffff', fontWeight: 600 }}>{emp.position || 'Pending Assignment'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#fef08a' }}>{emp.department}</div>
                        </td>

                        <td style={{ padding: '1rem 1rem' }}>
                          {m.performanceScore !== null && m.performanceScore !== undefined ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span
                                style={{
                                  fontSize: '0.82rem',
                                  fontWeight: 800,
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '6px',
                                  background: m.performanceScore >= 85 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                  color: m.performanceScore >= 85 ? '#fef08a' : '#6ee7b7',
                                  border: `1px solid ${m.performanceScore >= 85 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                                }}
                              >
                                {m.performanceScore}%
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                                {m.performanceRatingText?.split('(')[0]}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#fcd34d', fontStyle: 'italic' }}>
                              Needs Calculation
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '1rem 1rem' }}>
                          <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                            {m.attendance?.rate || 0}%
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#8e8e98' }}>
                            {m.attendance?.presentDays || 0}d present
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.18rem 0.55rem',
                              borderRadius: '9999px',
                              background: emp.isAssigned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: emp.isAssigned ? '#6ee7b7' : '#fef08a',
                              border: `1px solid ${emp.isAssigned ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`
                            }}
                          >
                            {emp.isAssigned ? 'Active & Appraised' : 'Unassigned'}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEvaluation(emp)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.5rem 0.95rem',
                              borderRadius: '8px',
                              background: 'rgba(245, 158, 11, 0.15)',
                              border: '1px solid rgba(245, 158, 11, 0.35)',
                              color: '#fef08a',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            id={`edit-evaluation-btn-${emp.id}`}
                          >
                            <Sliders size={13} />
                            <span>{emp.isAssigned ? 'Edit Evaluation' : 'Assign & Calculate'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* HR Evaluation Modal */}
        <HREvaluationModal
          employee={selectedEmployeeForEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={() => {
            loadData();
          }}
        />

        {/* Corporate QR Code Terminal Modal */}
        <CorporateQRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
