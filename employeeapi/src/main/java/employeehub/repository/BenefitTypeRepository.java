package employeehub.repository;

import employeehub.domain.BenefitType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BenefitTypeRepository extends JpaRepository<BenefitType, Long> {
    boolean existsByName(String name);
}
