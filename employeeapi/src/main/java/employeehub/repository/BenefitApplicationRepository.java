package employeehub.repository;

import employeehub.domain.BenefitApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BenefitApplicationRepository extends JpaRepository<BenefitApplication, String> {
    List<BenefitApplication> findByEmployeeId(String employeeId);
}
