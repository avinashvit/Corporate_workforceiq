# WorkForceIQ – Corporate Workforce Intelligence Platform

WorkForceIQ is structured around **two dedicated roles** and **two streamlined dashboards**:
1. **HR Manager** (`/hr/dashboard`): Evaluates unassigned employees upon registration, auto-calculates performance scores, assigns roles/competencies, and projects the Corporate QR Attendance Code.
2. **Employee** (`/employee/dashboard`): Features an attendance terminal that scans the daily QR code via smartphone/webcam and dynamically renders visualizations generated from HR evaluations.

---

## Key Workflows

### 1. Clean Slate & Registration Queue
- All pre-seeded dummy employees have been removed.
- Initial system starts with **HR Manager** (`hr@workforceiq.com` / `hr123`).
- When a new user clicks **"Sign In as New User"** and registers with the role **"Employee"**:
  - The employee is created with status **"Unassigned / Needs Evaluation"**.
  - In the HR Dashboard, the employee immediately appears in the **"Newly Registered Employees Awaiting HR Evaluation"** queue.
  - HR clicks **"Assign & Calculate Performance"**:
    - Assigns their job position and department.
    - Sets KPI target achievement, deliverable quality, and competency radar scores.
    - HR can click **"Auto-Calculate Weighted Score"** or fine-tune manually.
    - HR clicks **"Assign & Publish Metrics"** to activate the employee profile and generate all dashboard visualizations!

### 2. QR Code Attendance System
- **HR Projection**:
  - On the HR Dashboard, click **"Project Daily Attendance QR Code"**.
  - Displays the high-resolution, dated Corporate Attendance QR Code (`WORKFORCEIQ-ATTENDANCE-YYYY-MM-DD`).
  - Contains a real-time ticker displaying today's live employee check-ins as they scan.
- **Employee Smartphone Scan**:
  - In the Employee Dashboard, click **"Scan Corporate QR Code for Attendance"**.
  - Supports live mobile camera / webcam scanner via `jsQR`, phone camera scanning, and one-click instant verification.
  - Once verified, attendance increments immediately, punctuality is logged, and attendance charts update live on both Employee and HR dashboards!

---

## Demo Credentials & Testing

| Role | Email | Password | Assigned Dashboard | Action |
| :--- | :--- | :--- | :--- | :--- |
| **HR Manager** | `hr@workforceiq.com` | `hr123` | `/hr/dashboard` | Evaluates new employees & projects QR code |
| **New Employee** | *(Register via Sign In page)* | *(Your Password)* | `/employee/dashboard` | Scans QR code & views generated charts |

---

## Running Locally

```bash
cmd /c npm run dev
```

App URL: **[http://localhost:3000](http://localhost:3000)**
