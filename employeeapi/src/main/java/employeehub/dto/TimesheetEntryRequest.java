package employeehub.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TimesheetEntryRequest {
    private LocalDate date;
    private BigDecimal hoursWorked;
    private String description;
    private String projectOrTask;
}
