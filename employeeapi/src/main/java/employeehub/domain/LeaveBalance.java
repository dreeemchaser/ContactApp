package employeehub.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name = "leave_balances")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private BigDecimal totalDays;

    @Column(nullable = false)
    private BigDecimal usedDays = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal remainingDays;

    @Column(nullable = false)
    private LocalDate cycleStartDate;

    @Column(nullable = false)
    private LocalDate cycleEndDate;
}
