package employeehub.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PerformanceGoalRequest {
    private String employeeId;
    private String cycleId;
    private String title;
    private String description;
    private LocalDate targetDate;
}
