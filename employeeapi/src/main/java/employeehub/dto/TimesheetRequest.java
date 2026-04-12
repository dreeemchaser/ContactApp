package employeehub.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TimesheetRequest {
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
}
