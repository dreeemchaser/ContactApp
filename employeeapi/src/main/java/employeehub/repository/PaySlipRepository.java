package employeehub.repository;

import employeehub.domain.PaySlip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaySlipRepository extends JpaRepository<PaySlip, String> {
    List<PaySlip> findByEmployeeIdOrderByCreatedAtDesc(String employeeId);
}
