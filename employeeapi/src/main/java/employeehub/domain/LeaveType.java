package employeehub.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "leave_types")
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer defaultDays;

    @Column(nullable = false)
    private Integer cycleYears = 1;

    @Column(nullable = false)
    private Boolean requiresDocumentation = false;

    @Column(nullable = false)
    private Boolean isPaid = true;
}
