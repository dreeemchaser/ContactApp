package employeehub.repository;

import employeehub.domain.EmployeeBenefit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeBenefitRepository extends JpaRepository<EmployeeBenefit, String> {
    List<EmployeeBenefit> findByEmployeeId(String employeeId);
}
