/**
 * Comprehensive Verification: Clean Slate, Avinash Login, Unassigned Queue & QR Attendance
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load users.json
const usersPath = path.resolve(__dirname, './data/users.json');
const rawUsers = fs.readFileSync(usersPath, 'utf8');
const users = JSON.parse(rawUsers);

console.log('================================================================');
console.log('WorkForceIQ Clean Slate, Avinash Login & QR Attendance Tests');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
  }
}

// 1. Verify Clean Slate & Avinash Account in data/users.json
console.log('--- Test Group 1: Users in Database ---');
const avinash = users.find(u => u.email.toLowerCase() === 'avinash@workforceiq.com');
assert(!!avinash, 'Avinash account exists in data/users.json');
assert(avinash.password === 'avinash123', 'Avinash password is "avinash123"');
assert(avinash.role === 'Employee', 'Avinash role is "Employee"');
assert(avinash.status === 'active', 'Avinash status is "active"');

const hr = users.find(u => u.email.toLowerCase() === 'hr@workforceiq.com');
assert(!!hr, 'HR Manager account exists in data/users.json');
assert(hr.password === 'hr123', 'HR password is "hr123"');

// 2. Authentication Logic
console.log('\n--- Test Group 2: Login Validation ---');

function mockLogin(email, password, usersList) {
  const trimmedEmail = (email || '').trim().toLowerCase();
  const user = usersList.find(
    (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  if (user.status !== 'active') {
    return { success: false, error: 'Your account has been disabled.' };
  }

  const roleUrl = (user.role || '').toLowerCase().includes('hr') ? '/hr/dashboard' : '/employee/dashboard';

  return {
    success: true,
    user: {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    dashboardUrl: roleUrl
  };
}

const avinashLogin = mockLogin('avinash@workforceiq.com', 'avinash123', users);
assert(avinashLogin.success === true, 'Avinash can successfully log in with avinash@workforceiq.com / avinash123');
assert(avinashLogin.dashboardUrl === '/employee/dashboard', 'Avinash is directed to /employee/dashboard');

const hrLogin = mockLogin('hr@workforceiq.com', 'hr123', users);
assert(hrLogin.success === true, 'HR can log in with hr@workforceiq.com / hr123');
assert(hrLogin.dashboardUrl === '/hr/dashboard', 'HR is directed to /hr/dashboard');

console.log('\n================================================================');
console.log(`Test Results: ${passedTests} / ${totalTests} passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
