package employeehub.domain;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@Table(name = "tax_brackets")
public class TaxBracket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer taxYear;

    @Column(nullable = false)
    private BigDecimal minIncome;

    private BigDecimal maxIncome;

    @Column(nullable = false)
    private BigDecimal baseTax;

    @Column(nullable = false)
    private BigDecimal marginalRate;

    @Column(nullable = false)
    private BigDecimal rebate;
}
