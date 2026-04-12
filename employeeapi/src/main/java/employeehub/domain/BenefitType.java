package employeehub.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@Table(name = "benefit_types")
public class BenefitType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal employeeContribution;

    @Column(nullable = false)
    private BigDecimal employerContribution;

    @Column(nullable = false)
    private Boolean isOptional = true;
}
