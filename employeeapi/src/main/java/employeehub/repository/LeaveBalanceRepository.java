package employeehub.repository;

import employeehub.domain.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByEmployeeId(String employeeId);
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeId(String employeeId, Long leaveTypeId);
    void deleteByEmployeeId(String employeeId);
}
