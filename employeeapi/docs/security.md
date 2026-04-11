# Security

## Current Security Status

**⚠️ CRITICAL**: This application currently has **NO security measures implemented**. It is suitable only for development environments. **Do not deploy to production without implementing the security measures outlined below.**

## Security Assessment

### Current Vulnerabilities
- ❌ No authentication or authorization
- ❌ No input validation or sanitization
- ❌ No HTTPS/TLS encryption
- ❌ No rate limiting or DDoS protection
- ❌ File upload vulnerabilities (path traversal, malicious files)
- ❌ No audit logging
- ❌ Default error messages expose internal information
- ❌ Database credentials in plain text

### Risk Level: **HIGH**

## Required Security Implementations

### 1. Authentication & Authorization

#### JWT-Based Authentication
```java
// Add to pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
```

#### Implementation Steps
1. Create `JwtAuthenticationFilter`
2. Implement `UserDetailsService`
3. Configure `SecurityConfig` with JWT
4. Add `@PreAuthorize` annotations to controllers
5. Create login/signup endpoints

### 2. Input Validation & Sanitization

#### Bean Validation
```java
// Contact.java
@Entity
public class Contact {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    // ... other validations
}
```

#### Controller Validation
```java
@PostMapping
public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
    // Implementation
}
```

### 3. File Upload Security

#### Secure File Handling
```java
// Service method
public String uploadPhoto(String id, MultipartFile file) {
    // Validate file type
    String contentType = file.getContentType();
    if (!ALLOWED_TYPES.contains(contentType)) {
        throw new IllegalArgumentException("Invalid file type");
    }

    // Validate file size
    if (file.getSize() > MAX_FILE_SIZE) {
        throw new IllegalArgumentException("File too large");
    }

    // Generate secure filename
    String extension = getFileExtension(file.getOriginalFilename());
    String secureFilename = id + "_" + System.currentTimeMillis() + "." + extension;

    // Save to secure location
    Path targetLocation = Paths.get(PHOTO_DIRECTORY).resolve(secureFilename);
    Files.copy(file.getInputStream(), targetLocation, REPLACE_EXISTING);

    return ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/contacts/image/" + secureFilename)
            .toString();
}
```

#### Cloud Storage Migration
For production, migrate to cloud storage:
- AWS S3 with proper IAM roles
- Azure Blob Storage
- Google Cloud Storage

### 4. HTTPS Configuration

#### Application Configuration
```yaml
# application-prod.yml
server:
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_PASSWORD}
    keyStoreType: PKCS12
    keyAlias: contactapi
  port: 8443

security:
  require-ssl: true
```

#### Force HTTPS Redirect
```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.requiresChannel()
            .anyRequest()
            .requiresSecure();
    }
}
```

### 5. CORS Configuration

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/contacts/**")
                .allowedOrigins("https://yourdomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 6. Rate Limiting

#### Using Bucket4j
```java
@Configuration
public class RateLimitConfig {
    @Bean
    public Bucket createBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.simple(100, Duration.ofMinutes(1)))
                .build();
    }
}
```

### 7. Security Headers

```java
@Configuration
public class SecurityHeadersConfig {
    @Bean
    public FilterRegistrationBean<HeaderFilter> headerFilter() {
        HeaderFilter filter = new HeaderFilter();
        FilterRegistrationBean<HeaderFilter> registration = new FilterRegistrationBean<>(filter);
        registration.addUrlPatterns("/*");
        return registration;
    }
}

public class HeaderFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        httpResponse.setHeader("X-Frame-Options", "DENY");
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        chain.doFilter(request, response);
    }
}
```

### 8. Database Security

#### Connection Encryption
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contactapi?ssl=true&sslmode=require
```

#### Query Parameterization
JPA automatically handles SQL injection prevention.

#### Database User Permissions
```sql
-- Create limited user for application
CREATE USER contactapi_app WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON contacts TO contactapi_app;
GRANT USAGE ON SEQUENCE contacts_id_seq TO contactapi_app;
```

### 9. Logging & Monitoring

#### Security Event Logging
```java
@Service
@Slf4j
public class SecurityAuditService {
    public void logSecurityEvent(String event, String user, String details) {
        log.warn("SECURITY EVENT: {} - User: {} - Details: {}", event, user, details);
    }
}
```

#### Spring Security Audit
```yaml
logging:
  level:
    org.springframework.security: DEBUG
```

### 10. Environment Security

#### Secrets Management
```yaml
# Use environment variables or external config
spring:
  datasource:
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

#### Docker Security
```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup
USER appuser
```

## Security Checklist

### Pre-Production Checklist
- [ ] JWT authentication implemented
- [ ] Password hashing with bcrypt
- [ ] Input validation on all endpoints
- [ ] HTTPS configured
- [ ] CORS properly configured
- [ ] File upload security implemented
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] Database credentials secured
- [ ] Audit logging implemented
- [ ] Error messages sanitized
- [ ] Dependencies scanned for vulnerabilities

### Production Monitoring
- [ ] Failed login attempts monitored
- [ ] Suspicious file uploads flagged
- [ ] Rate limit violations logged
- [ ] Security events alerted
- [ ] Regular security scans scheduled

## Security Testing

### Tools & Commands
```bash
# OWASP ZAP for API security testing
# Run vulnerability scans
./mvnw org.owasp:dependency-check-maven:check

# Security headers check
curl -I https://your-api.com/contacts

# SSL/TLS check
openssl s_client -connect your-api.com:443
```

### Penetration Testing Checklist
- [ ] SQL injection attempts
- [ ] XSS attacks
- [ ] CSRF attacks
- [ ] File upload vulnerabilities
- [ ] Authentication bypass attempts
- [ ] Rate limiting bypass
- [ ] SSL/TLS configuration

## Compliance Considerations

### GDPR Compliance
- Implement data encryption at rest
- Add data retention policies
- Implement right to erasure
- Add data processing consent

### Industry Standards
- OWASP Top 10 compliance
- ISO 27001 alignment
- SOC 2 requirements

## Emergency Response

### Security Incident Response
1. **Detection**: Monitor logs and alerts
2. **Assessment**: Evaluate impact and scope
3. **Containment**: Disable compromised accounts
4. **Recovery**: Restore from clean backups
5. **Lessons Learned**: Update security measures

### Contact Information
- Security Team: security@company.com
- Emergency: +1-800-SECURITY

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [SSL/TLS Configuration](https://ssl-config.mozilla.org/)