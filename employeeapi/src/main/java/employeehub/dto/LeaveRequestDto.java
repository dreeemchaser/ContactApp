package employeehub.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestDto {
    private Long leaveTypeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
}
