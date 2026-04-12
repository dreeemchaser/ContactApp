package employeehub.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaySlipGenerateRequest {
    private String employeeId;
    private String month;           // e.g. "2025-06"
    private BigDecimal medicalAid;
    private BigDecimal pensionFund;
    private BigDecimal otherDeductions;
}
