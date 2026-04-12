package employeehub.repository;

import employeehub.domain.PerformanceCycle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerformanceCycleRepository extends JpaRepository<PerformanceCycle, String> {
}
