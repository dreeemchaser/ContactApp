package employeehub.repository;

import employeehub.domain.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    @Query(value = "SELECT * FROM audit_logs a WHERE " +
           "(:entityType IS NULL OR a.entity_type = :entityType) AND " +
           "(:employeeId IS NULL OR a.performed_by_id = :employeeId) AND " +
           "(:from IS NULL OR a.timestamp >= CAST(:from AS TIMESTAMP)) AND " +
           "(:to IS NULL OR a.timestamp <= CAST(:to AS TIMESTAMP))",
           countQuery = "SELECT COUNT(*) FROM audit_logs a WHERE " +
           "(:entityType IS NULL OR a.entity_type = :entityType) AND " +
           "(:employeeId IS NULL OR a.performed_by_id = :employeeId) AND " +
           "(:from IS NULL OR a.timestamp >= CAST(:from AS TIMESTAMP)) AND " +
           "(:to IS NULL OR a.timestamp <= CAST(:to AS TIMESTAMP))",
           nativeQuery = true)
    Page<AuditLog> findAllFiltered(
            @Param("entityType") String entityType,
            @Param("employeeId") String employeeId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);
}
