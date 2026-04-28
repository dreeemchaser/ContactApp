package employeehub.repository;

import employeehub.domain.PerformanceGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceGoalRepository extends JpaRepository<PerformanceGoal, String> {
    List<PerformanceGoal> findByEmployeeId(String employeeId);
}
