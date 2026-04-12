package employeehub.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalaryRecordRequest {
    private String employeeId;
    private BigDecimal basicSalary;
    private LocalDate effectiveDate;
}
