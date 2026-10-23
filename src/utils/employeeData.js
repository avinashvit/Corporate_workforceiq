/**
 * WorkForceIQ - Employee Data, HR Evaluation & QR Attendance Store
 * Manages dynamically registered employees, HR evaluations, and QR Code attendance.
 */

const STORAGE_KEY = 'workforceiq_employee_records_v5';
const ATTENDANCE_FEED_KEY = 'workforceiq_attendance_live_feed_v5';
const EVENT_NAME = 'workforceiq_employee_data_updated';

/**
 * Returns today's ISO date string: YYYY-MM-DD
 */
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates official corporate QR attendance token for today.
 */
export function getCorporateQRToken() {
  const today = getTodayDateString();
  return `WORKFORCEIQ-ATTENDANCE-${today}`;
}

/**
 * Retrieve all employee records.
 * Default is empty until new users register as employees!
 */
export function getAllEmployeeRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading employee records from storage:', err);
  }
  return [];
}

/**
 * Save records list and dispatch live sync event.
 */
function saveEmployeeRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { recordsCount: records.length } }));
  } catch (err) {
    console.error('Failed to save employee records:', err);
  }
}

/**
 * Get employee record by ID or Email.
 */
export function getEmployeeRecord(identifier) {
  if (!identifier) return null;
  const list = getAllEmployeeRecords();
  const lower = String(identifier).trim().toLowerCase();
  return list.find(
    (emp) =>
      emp.id.toLowerCase() === lower ||
      emp.email.toLowerCase() === lower ||
      emp.name.toLowerCase() === lower
  ) || null;
}

/**
 * Automatically creates an unassigned employee record when a user registers.
 */
export function registerUnassignedEmployee({ id, name, email, department }) {
  const list = getAllEmployeeRecords();
  const trimmedEmail = email.toLowerCase().trim();

  // Avoid duplicates
  const existing = list.find((e) => e.email.toLowerCase() === trimmedEmail);
  if (existing) return existing;

  const newEmp = {
    id: id || `USR${String(list.length + 1).padStart(3, '0')}`,
    name: name.trim(),
    email: trimmedEmail,
    role: 'Employee',
    department: department || 'General',
    position: 'Pending HR Assignment',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    avatar: null,
    status: 'unassigned', // unassigned until HR evaluates and assigns!
    isAssigned: false,
    isEvaluated: false,
    location: 'Corporate HQ',
    reportingManager: 'Sarah Johnson (HR Director)',

    // Clean slate metrics awaiting HR calculation & assignment
    metrics: {
      performanceScore: null, // Will be calculated by HR!
      performanceRatingText: 'Pending HR Appraisal',
      kpiTargetAchievement: null,
      qualityIndex: null,
      efficiencyScore: null,

      // Empty until HR adds monthly review points
      monthlyProductivity: [],

      // 0 until HR evaluates competencies
      skills: {
        technicalMastery: 0,
        problemSolving: 0,
        communication: 0,
        leadership: 0,
        deliverySpeed: 0,
        creativityInnovation: 0
      },

      // Empty until HR assigns goals
      goals: [],

      // 0 present days until employee scans QR code
      attendance: {
        rate: 0,
        presentDays: 0,
        remoteDays: 0,
        casualLeaves: 0,
        sickLeaves: 0,
        totalWorkingDays: 20,
        punctualityRate: 100,
        dailyLogs: []
      },

      projects: {
        completed: 0,
        inProgress: 0,
        codeReviews: 0,
        csatScore: null
      },

      compensation: {
        baseSalary: 'Pending HR Assignment',
        bonusPercentage: 0,
        lastAppraisalIncrease: 'N/A',
        currentBand: 'Pending HR Review',
        nextBand: 'Pending HR Review',
        promotionReadiness: 0
      },

      hrReview: {
        reviewedBy: 'Pending Review',
        reviewerRole: 'HR Director',
        reviewDate: 'Pending',
        nextReviewDate: 'TBD',
        feedback: 'Newly registered employee. Awaiting initial performance appraisal and metrics setup by HR.',
        badges: []
      }
    }
  };

  list.push(newEmp);
  saveEmployeeRecords(list);
  return newEmp;
}

/**
 * HR completes evaluation, calculates performance score, and marks employee as assigned.
 */
export function evaluateAndAssignEmployee(employeeId, newMetrics, updatedInfo = {}) {
  const list = getAllEmployeeRecords();
  const index = list.findIndex((e) => e.id === employeeId || e.email.toLowerCase() === employeeId.toLowerCase());

  if (index === -1) {
    return { success: false, error: 'Employee not found' };
  }

  const existing = list[index];

  // Auto-calculate performance score if not manually set:
  // Weighted blend: 40% KPI, 30% Quality, 20% Skills average, 10% Attendance
  let finalScore = Number(newMetrics.performanceScore);
  if (!finalScore || isNaN(finalScore)) {
    const kpi = Number(newMetrics.kpiTargetAchievement) || 85;
    const quality = Number(newMetrics.qualityIndex) || 90;
    const skillsList = Object.values(newMetrics.skills || {});
    const avgSkill = skillsList.length > 0 ? skillsList.reduce((a, b) => a + Number(b), 0) / skillsList.length : 80;
    const attRate = Number(newMetrics.attendance?.rate) || 95;
    finalScore = Math.round(kpi * 0.4 + quality * 0.3 + avgSkill * 0.2 + attRate * 0.1);
  }

  // Derive rating text
  let ratingText = 'Meets Key Objectives';
  if (finalScore >= 90) ratingText = 'Exceeds Expectations (Top Tier)';
  else if (finalScore >= 80) ratingText = 'Strong Performer (High Impact)';
  else if (finalScore < 70) ratingText = 'Needs Mentorship / Improvement';

  const updated = {
    ...existing,
    ...updatedInfo,
    isAssigned: true,
    isEvaluated: true,
    status: 'active',
    metrics: {
      ...existing.metrics,
      ...newMetrics,
      performanceScore: finalScore,
      performanceRatingText: newMetrics.performanceRatingText || ratingText,
      hrReview: {
        ...existing.metrics?.hrReview,
        ...(newMetrics.hrReview || {}),
        reviewedBy: 'Sarah Johnson',
        reviewerRole: 'HR Director',
        reviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    }
  };

  list[index] = updated;
  saveEmployeeRecords(list);
  return { success: true, record: updated };
}

/**
 * QR Code Attendance: Mark employee attendance via phone QR scan.
 */
export function markAttendanceViaQRCode(employeeIdentifier, scanMethod = 'QR Code Mobile Scan') {
  const list = getAllEmployeeRecords();
  const index = list.findIndex(
    (e) =>
      e.id.toLowerCase() === employeeIdentifier.toLowerCase() ||
      e.email.toLowerCase() === employeeIdentifier.toLowerCase()
  );

  if (index === -1) {
    return { success: false, error: 'Employee not found' };
  }

  const emp = list[index];
  const todayStr = getTodayDateString();
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const existingLogs = emp.metrics?.attendance?.dailyLogs || [];
  const alreadyMarked = existingLogs.some((log) => log.date === todayStr);

  if (alreadyMarked) {
    const existingLog = existingLogs.find((log) => log.date === todayStr);
    return {
      success: true,
      alreadyMarked: true,
      message: `Already checked in today at ${existingLog.time}!`,
      log: existingLog,
      employee: emp
    };
  }

  // Record new check-in
  const newLog = {
    date: todayStr,
    time: timeStr,
    method: scanMethod,
    status: 'Present (On-Time)'
  };

  const newPresentDays = (emp.metrics?.attendance?.presentDays || 0) + 1;
  const totalDays = emp.metrics?.attendance?.totalWorkingDays || 20;
  const newAttendanceRate = Math.min(100, Math.round(((newPresentDays + (emp.metrics?.attendance?.remoteDays || 0)) / totalDays) * 1000) / 10);

  const updatedEmployee = {
    ...emp,
    metrics: {
      ...emp.metrics,
      attendance: {
        ...emp.metrics?.attendance,
        presentDays: newPresentDays,
        rate: newAttendanceRate,
        dailyLogs: [newLog, ...existingLogs]
      }
    }
  };

  list[index] = updatedEmployee;
  saveEmployeeRecords(list);

  // Add to global corporate live feed for HR visibility
  addAttendanceFeedEntry({
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    date: todayStr,
    time: timeStr,
    method: scanMethod,
    status: 'Present'
  });

  return {
    success: true,
    alreadyMarked: false,
    message: `Attendance marked successfully at ${timeStr}!`,
    log: newLog,
    employee: updatedEmployee
  };
}

/**
 * Check if employee is checked in today.
 */
export function isEmployeeCheckedInToday(employeeIdentifier) {
  const emp = getEmployeeRecord(employeeIdentifier);
  if (!emp) return false;
  const todayStr = getTodayDateString();
  const logs = emp.metrics?.attendance?.dailyLogs || [];
  return logs.some((l) => l.date === todayStr);
}

/**
 * Add an entry to the company-wide live attendance feed for HR.
 */
function addAttendanceFeedEntry(entry) {
  try {
    const raw = localStorage.getItem(ATTENDANCE_FEED_KEY);
    const feed = raw ? JSON.parse(raw) : [];
    feed.unshift({ ...entry, id: `ATT-${Date.now()}` });
    localStorage.setItem(ATTENDANCE_FEED_KEY, JSON.stringify(feed.slice(0, 30)));
  } catch (e) {}
}

/**
 * Get company-wide live attendance check-ins feed for HR.
 */
export function getLiveAttendanceFeed() {
  try {
    const raw = localStorage.getItem(ATTENDANCE_FEED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Clear all demo records (for clean start).
 */
export function resetEmployeeStorageClean() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ATTENDANCE_FEED_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { recordsCount: 0 } }));
  } catch (e) {}
}

/**
 * Listen for live updates.
 */
export function onEmployeeDataChange(callback) {
  const handler = (e) => callback(e.detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
