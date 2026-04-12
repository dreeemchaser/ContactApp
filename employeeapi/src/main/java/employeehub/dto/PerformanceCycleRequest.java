package employeehub.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PerformanceCycleRequest {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
}
