package employeehub.repository;

import employeehub.domain.SalaryIncreaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryIncreaseRequestRepository extends JpaRepository<SalaryIncreaseRequest, String> {
    List<SalaryIncreaseRequest> findByEmployeeId(String employeeId);
}
