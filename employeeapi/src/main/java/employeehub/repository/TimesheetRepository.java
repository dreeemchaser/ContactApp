package employeehub.repository;

import employeehub.domain.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TimesheetRepository extends JpaRepository<Timesheet, String> {

    List<Timesheet> findByEmployeeId(String employeeId);

    @Query("SELECT t FROM Timesheet t WHERE " +
           "(:managerId IS NULL OR t.employee.manager.id = :managerId)")
    List<Timesheet> findAllFiltered(@Param("managerId") String managerId);
}
