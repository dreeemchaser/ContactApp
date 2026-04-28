package employeehub.service;

import employeehub.domain.AuditLog;
import employeehub.domain.Employee;
import employeehub.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditServiceTest {

    @Mock AuditLogRepository auditLogRepository;

    @InjectMocks AuditService auditService;

    private Employee performer;

    @BeforeEach
    void setUp() {
        performer = new Employee();
        performer.setId("emp-1");
    }

    @Test
    void log_shouldPersistAllFields() {
        auditService.log(performer, "APPROVE", "LeaveRequest", "req-1", "PENDING", "APPROVED");

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog saved = captor.getValue();
        assertThat(saved.getPerformedBy()).isEqualTo(performer);
        assertThat(saved.getAction()).isEqualTo("APPROVE");
        assertThat(saved.getEntityType()).isEqualTo("LeaveRequest");
        assertThat(saved.getEntityId()).isEqualTo("req-1");
        assertThat(saved.getOldValue()).isEqualTo("PENDING");
        assertThat(saved.getNewValue()).isEqualTo("APPROVED");
    }

    @Test
    void log_shouldAllowNullOldAndNewValues() {
        auditService.log(performer, "CREATE", "SalaryRecord", "sr-1", null, "30000");

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        assertThat(captor.getValue().getOldValue()).isNull();
        assertThat(captor.getValue().getNewValue()).isEqualTo("30000");
    }

    @Test
    void getAll_shouldDelegateToRepository() {
        AuditLog entry = new AuditLog();
        Page<AuditLog> page = new PageImpl<>(List.of(entry));
        LocalDateTime from = LocalDateTime.now().minusDays(7);
        LocalDateTime to = LocalDateTime.now();

        when(auditLogRepository.findAllFiltered(eq("LeaveRequest"), eq("emp-1"), eq(from), eq(to), any(Pageable.class)))
                .thenReturn(page);

        Page<AuditLog> result = auditService.getAll("LeaveRequest", "emp-1", from, to, Pageable.unpaged());

        assertThat(result.getContent()).hasSize(1);
        verify(auditLogRepository).findAllFiltered("LeaveRequest", "emp-1", from, to, Pageable.unpaged());
    }

    @Test
    void getAll_shouldAcceptNullFilters() {
        when(auditLogRepository.findAllFiltered(isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(Page.empty());

        Page<AuditLog> result = auditService.getAll(null, null, null, null, Pageable.unpaged());

        assertThat(result).isEmpty();
    }
}
