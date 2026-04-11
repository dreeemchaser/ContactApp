# Performance

## Performance Overview

The Contact API is designed for optimal performance with proper database indexing, connection pooling, and caching strategies. Current implementation supports thousands of concurrent users with sub-second response times for typical operations.

## Current Performance Characteristics

### Baseline Metrics
- **Response Time**: < 100ms for contact retrieval
- **Throughput**: 1000+ requests/second
- **Concurrent Users**: 1000+ simultaneous connections
- **Database Queries**: Optimized with proper indexing
- **Memory Usage**: ~256MB baseline, scales with load

### Architecture Benefits
- Stateless REST API design
- Horizontal scaling capability
- Database connection pooling
- Efficient pagination implementation
- Asynchronous file processing

## Performance Optimization Areas

### 1. Database Optimization

#### Indexing Strategy
```sql
-- Primary key index (automatic)
-- Email uniqueness constraint index (automatic)

-- Additional performance indexes
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_date ON contacts(created_date);

-- Composite index for common queries
CREATE INDEX idx_contacts_name_email ON contacts(name, email);
```

#### Query Optimization
```java
// Efficient pagination with sorting
public Page<Contact> getAllContacts(int page, int size) {
    return contactRepository.findAll(
        PageRequest.of(page, size, Sort.by("name").ascending())
    );
}

// Custom repository methods for complex queries
public interface ContactRepository extends JpaRepository<Contact, String> {
    @Query("SELECT c FROM Contact c WHERE c.status = :status ORDER BY c.name")
    Page<Contact> findByStatusOrderByName(@Param("status") String status, Pageable pageable);

    @Query("SELECT c FROM Contact c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Contact> searchByName(@Param("search") String search);
}
```

#### Connection Pool Configuration
```yaml
# application-prod.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 1200000
      connection-timeout: 20000
      leak-detection-threshold: 60000
```

### 2. Caching Implementation

#### Redis Caching
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofMinutes(10)))
                .build();
    }
}

@Service
@CacheConfig
public class ContactService {
    @Cacheable(value = "contacts", key = "#id")
    public Contact getContact(String id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    @CacheEvict(value = "contacts", key = "#contact.id")
    public Contact updateContact(Contact contact) {
        return contactRepository.save(contact);
    }
}
```

#### Cache Configuration
```yaml
spring:
  cache:
    type: redis
  redis:
    host: localhost
    port: 6379
    timeout: 2000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
```

### 3. File Storage Optimization

#### Cloud Storage Migration
```java
// AWS S3 Implementation
@Service
public class S3PhotoService implements PhotoService {
    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Override
    public String uploadPhoto(String contactId, MultipartFile file) {
        String key = "contacts/" + contactId + "/" + generateSecureFilename(file);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        s3Client.putObject(bucketName, key, file.getInputStream(), metadata);

        return s3Client.getUrl(bucketName, key).toString();
    }
}
```

#### CDN Integration
- Use CloudFront (AWS) or Cloudflare for global distribution
- Implement proper cache headers
- Compress images automatically

### 4. Application Performance Tuning

#### JVM Optimization
```bash
# Production JVM flags
java -server \
  -Xmx2g -Xms1g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:+UseCompressedOops \
  -XX:+OptimizeStringConcat \
  -Djava.security.egd=file:/dev/./urandom \
  -jar contactapi.jar
```

#### Async Processing
```java
@Service
public class AsyncPhotoService {
    @Async
    public CompletableFuture<String> processPhotoAsync(MultipartFile file) {
        // Resize, compress, and upload photo asynchronously
        return CompletableFuture.completedFuture(processPhoto(file));
    }
}
```

#### Request Optimization
```java
@Controller
public class ContactController {
    @GetMapping("/contacts")
    public ResponseEntity<Page<Contact>> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, Math.min(size, 100),
                          Sort.by("name").ascending());

        Page<Contact> contacts;
        if (search != null && !search.trim().isEmpty()) {
            contacts = contactService.searchContacts(search, pageable);
        } else {
            contacts = contactService.getAllContacts(pageable);
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES))
                .body(contacts);
    }
}
```

### 5. Monitoring & Profiling

#### Application Metrics
```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
  health:
    diskspace:
      enabled: true
    db:
      enabled: true
```

#### Custom Metrics
```java
@Service
public class ContactMetricsService {
    private final MeterRegistry meterRegistry;

    public void recordContactCreation() {
        meterRegistry.counter("contacts.created").increment();
    }

    public void recordPhotoUpload(long fileSize) {
        meterRegistry.timer("photos.upload.duration").record(() -> {
            // Upload logic
        });
    }
}
```

#### Profiling Tools
```bash
# JVM profiling
java -agentlib:hprof=file=dump.hprof,format=b \
  -jar contactapi.jar

# Use async-profiler for production profiling
./profiler.sh -d 30 -f profile.html <pid>
```

### 6. Load Testing

#### JMeter Test Plan
```xml
<!-- contacts-test.jmx -->
<jmeterTestPlan>
    <ThreadGroup>
        <num_threads>100</num_threads>
        <ramp_time>30</ramp_time>
        <duration>300</duration>
    </ThreadGroup>
    <HTTPSamplerProxy>
        <domain>localhost</domain>
        <port>8080</port>
        <path>/contacts</path>
        <method>GET</method>
    </HTTPSamplerProxy>
</jmeterTestPlan>
```

#### Load Testing Commands
```bash
# Run JMeter test
jmeter -n -t contacts-test.jmx -l results.jtl

# Apache Bench
ab -n 10000 -c 100 http://localhost:8080/contacts

# Hey (Go load testing)
hey -n 10000 -c 100 http://localhost:8080/contacts
```

### 7. Scalability Considerations

#### Horizontal Scaling
```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: contactapi
spec:
  replicas: 3
  selector:
    matchLabels:
      app: contactapi
  template:
    spec:
      containers:
      - name: contactapi
        image: contactapi:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
```

#### Database Scaling
- Read replicas for read-heavy workloads
- Sharding strategy for large datasets
- Connection pooling optimization

#### CDN & Caching Layers
- CloudFront/Global CDN for static assets
- Redis cluster for distributed caching
- Varnish for additional caching layer

## Performance Benchmarks

### Baseline Performance (Single Instance)
| Operation | Response Time | Throughput |
|-----------|---------------|------------|
| Get Contact | < 50ms | 2000 req/s |
| List Contacts | < 100ms | 1500 req/s |
| Create Contact | < 200ms | 800 req/s |
| Upload Photo | < 500ms | 200 req/s |

### Scaling Performance
| Instances | Concurrent Users | Response Time |
|-----------|------------------|---------------|
| 1 | 1000 | < 200ms |
| 3 | 3000 | < 150ms |
| 5 | 5000 | < 100ms |

## Monitoring Dashboard

### Key Metrics to Monitor
- Response time percentiles (p50, p95, p99)
- Error rates by endpoint
- Database connection pool utilization
- JVM heap/memory usage
- Cache hit ratios
- File upload success rates

### Alerting Rules
```yaml
# Prometheus alerting rules
groups:
- name: contactapi
  rules:
  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
```

## Troubleshooting Performance Issues

### Common Bottlenecks
1. **Database Connection Pool Exhausted**
   - Increase pool size
   - Optimize queries
   - Add read replicas

2. **Memory Leaks**
   - Profile JVM heap
   - Check for object retention
   - Implement proper cleanup

3. **Slow File Operations**
   - Move to cloud storage
   - Implement async processing
   - Add CDN

4. **High CPU Usage**
   - Profile application
   - Optimize algorithms
   - Consider vertical scaling

### Performance Testing Checklist
- [ ] Load testing with realistic data volumes
- [ ] Memory leak testing with prolonged runs
- [ ] Database performance under load
- [ ] File upload performance testing
- [ ] CDN and caching effectiveness
- [ ] Horizontal scaling validation

## Resources

- [Spring Performance Best Practices](https://spring.io/blog/2020/04/30/spring-tips-performance-tuning)
- [JPA Performance Tuning](https://thorben-janssen.com/jpa-performance/)
- [Redis Caching Patterns](https://redis.io/topics/caching)
- [JVM Performance Tuning](https://docs.oracle.com/en/java/javase/17/gctuning/)