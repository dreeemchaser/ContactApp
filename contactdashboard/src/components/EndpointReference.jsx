const ENDPOINTS = [
  { method: 'POST',   path: '/auth/register',           desc: 'Register a new user account' },
  { method: 'POST',   path: '/auth/login',              desc: 'Login and receive a JWT token' },
  { method: 'GET',    path: '/contacts',                desc: 'Get paginated list of contacts (requires auth)' },
  { method: 'POST',   path: '/contacts',                desc: 'Create a new contact (requires auth)' },
  { method: 'GET',    path: '/contacts/{id}',           desc: 'Get a single contact by ID (requires auth)' },
  { method: 'PUT',    path: '/contacts/photo',          desc: 'Upload a photo for a contact (requires auth)' },
  { method: 'GET',    path: '/contacts/image/{filename}', desc: 'Serve a contact photo file' },
  { method: 'GET',    path: '/actuator/health',         desc: 'Spring Boot health check (public)' },
  { method: 'GET',    path: '/swagger-ui/index.html',   desc: 'Interactive API docs (public)' },
  { method: 'GET',    path: '/v3/api-docs',             desc: 'OpenAPI JSON spec (public)' },
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
