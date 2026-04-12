package employeehub.repository;

import employeehub.domain.TaxBracket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface TaxBracketRepository extends JpaRepository<TaxBracket, Long> {

    boolean existsByTaxYear(Integer taxYear);

    @Query("SELECT t FROM TaxBracket t WHERE t.taxYear = :year AND t.minIncome <= :income " +
           "AND (t.maxIncome IS NULL OR t.maxIncome >= :income) ORDER BY t.minIncome DESC")
    Optional<TaxBracket> findBracketForIncome(@Param("year") Integer year, @Param("income") BigDecimal income);
}
