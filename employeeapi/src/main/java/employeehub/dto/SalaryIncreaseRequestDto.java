package employeehub.dto;

import lombok.Data;

@Data
public class SalaryIncreaseRequestDto {
    private String employeeId;
    private String justification;
    private java.math.BigDecimal proposedSalary;
}
