package employeehub.repository;

import employeehub.domain.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByEmployeeId(String employeeId);
}
