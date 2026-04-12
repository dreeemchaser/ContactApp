package employeehub.domain;

import employeehub.domain.enums.SalaryIncreaseStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "salary_increase_requests")
public class SalaryIncreaseRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by_id", nullable = false)
    private Employee requestedBy;

    @Column(nullable = false)
    private BigDecimal currentSalary;

    @Column(nullable = false)
    private BigDecimal proposedSalary;

    @Column(nullable = false)
    private BigDecimal increasePercentage;

    @Column(nullable = false)
    private String justification;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SalaryIncreaseStatus status = SalaryIncreaseStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private Employee reviewedBy;

    private LocalDateTime reviewedAt;

    private String rejectionReason;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
