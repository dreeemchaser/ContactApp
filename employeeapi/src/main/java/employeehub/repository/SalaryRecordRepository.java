package employeehub.repository;

import employeehub.domain.SalaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, String> {
    List<SalaryRecord> findByEmployeeIdOrderByEffectiveDateDesc(String employeeId);
    Optional<SalaryRecord> findFirstByEmployeeIdOrderByEffectiveDateDesc(String employeeId);
}
