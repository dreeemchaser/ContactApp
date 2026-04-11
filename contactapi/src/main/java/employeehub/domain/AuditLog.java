package employeehub.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String entityType;

    private String entityId;

    @Column(nullable = false)
    private String action;

    private String performedBy;

    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
