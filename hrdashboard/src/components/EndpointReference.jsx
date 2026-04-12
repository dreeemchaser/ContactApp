const ENDPOINTS = [
  { method: 'POST',  path: '/auth/login',                       desc: 'Login and receive a JWT token' },
  { method: 'GET',   path: '/auth/me',                          desc: 'Get current authenticated employee profile' },
  { method: 'GET',   path: '/employees',                        desc: 'Get paginated employees (filterable by dept/team/status)' },
  { method: 'POST',  path: '/employees',                        desc: 'Create a new employee (HR_ADMIN)' },
  { method: 'GET',   path: '/employees/{id}',                   desc: 'Get employee by ID' },
  { method: 'PUT',   path: '/employees/{id}',                   desc: 'Update employee details (HR_ADMIN)' },
  { method: 'PATCH', path: '/employees/{id}/status',            desc: 'Update employment status (HR_ADMIN)' },
  { method: 'POST',  path: '/employees/{id}/photo',             desc: 'Upload employee profile photo' },
  { method: 'GET',   path: '/employees/photo/{filename}',       desc: 'Serve employee profile photo (public)' },
  { method: 'GET',   path: '/leave/requests',                   desc: 'Get all leave requests (HR/Manager filtered)' },
  { method: 'POST',  path: '/leave/requests',                   desc: 'Submit a leave request' },
  { method: 'PATCH', path: '/leave/requests/{id}/approve',      desc: 'Approve a leave request' },
  { method: 'PATCH', path: '/leave/requests/{id}/reject',       desc: 'Reject a leave request' },
  { method: 'GET',   path: '/leave/balances/my',                desc: 'Get current employee leave balances' },
  { method: 'GET',   path: '/timesheets/my',                    desc: 'Get current employee timesheets' },
  { method: 'POST',  path: '/timesheets',                       desc: 'Create a timesheet (DRAFT)' },
  { method: 'PATCH', path: '/timesheets/{id}/submit',           desc: 'Submit timesheet for approval' },
  { method: 'PATCH', path: '/timesheets/{id}/approve',          desc: 'Approve a timesheet' },
  { method: 'POST',  path: '/salary/records',                   desc: 'Set employee salary (PAYROLL_ADMIN)' },
  { method: 'POST',  path: '/salary/payslips/generate',         desc: 'Generate monthly payslip with PAYE & UIF' },
  { method: 'GET',   path: '/salary/payslips/my',               desc: 'Get current employee payslips' },
  { method: 'GET',   path: '/documents/my',                     desc: 'Get current employee documents' },
  { method: 'POST',  path: '/documents/upload',                 desc: 'Upload a document' },
  { method: 'PATCH', path: '/documents/{id}/verify',            desc: 'Verify a document (HR_ADMIN)' },
  { method: 'GET',   path: '/benefits',                         desc: 'Get all benefit types' },
  { method: 'POST',  path: '/benefits/apply',                   desc: 'Apply for a benefit' },
  { method: 'GET',   path: '/performance/goals/my',             desc: 'Get current employee performance goals' },
  { method: 'GET',   path: '/performance/reviews/my',           desc: 'Get current employee reviews' },
  { method: 'GET',   path: '/notifications/my',                 desc: 'Get current employee notifications' },
  { method: 'GET',   path: '/audit-logs',                       desc: 'Get audit logs (HR_ADMIN / SUPER_ADMIN)' },
  { method: 'GET',   path: '/actuator/health',                  desc: 'Spring Boot health check (public)' },
  { method: 'GET',   path: '/swagger-ui/index.html',            desc: 'Interactive API docs (public)' },
];

const EndpointReference = () => (
  <div className="section">
    <h2>API Endpoint Reference</h2>
    <div className="endpoint-list">
      {ENDPOINTS.map((e, i) => (
        <div className="endpoint-item" key={i}>
          <span className={`method ${e.method}`}>{e.method}</span>
          <span className="endpoint-path">{e.path}</span>
          <span className="endpoint-desc">{e.desc}</span>
        </div>
      ))}
    </div>
  </div>
);

export default EndpointReference;
