package employeehub.repository;

import employeehub.domain.LeaveRequest;
import employeehub.domain.enums.LeaveStatus;
import employeehub.domain.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {

    List<LeaveRequest> findByEmployeeId(String employeeId);
    void deleteByEmployeeId(String employeeId);

    @Query("SELECT lr FROM LeaveRequest lr WHERE " +
           "(:managerId IS NULL OR lr.employee.manager.id = :managerId) AND " +
           "(:status IS NULL OR lr.status = :status)")
    List<LeaveRequest> findAllFiltered(
            @Param("managerId") String managerId,
            @Param("status") LeaveStatus status);
}
