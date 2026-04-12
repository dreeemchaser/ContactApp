package employeehub.service;

import employeehub.domain.AuditLog;
import employeehub.domain.Employee;
import employeehub.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(Employee performedBy, String action, String entityType, String entityId,
                    String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setPerformedBy(performedBy);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        auditLogRepository.save(log);
    }

    public Page<AuditLog> getAll(String entityType, String employeeId,
                                  LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return auditLogRepository.findAllFiltered(entityType, employeeId, from, to, pageable);
    }
}
