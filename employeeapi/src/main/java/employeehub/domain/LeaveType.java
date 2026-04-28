package employeehub.domain;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
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
