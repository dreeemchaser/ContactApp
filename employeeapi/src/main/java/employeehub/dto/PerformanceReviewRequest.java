package employeehub.dto;

import lombok.Data;

@Data
public class PerformanceReviewRequest {
    private String employeeId;
    private String cycleId;
    private Integer overallRating;
    private String strengths;
    private String areasForImprovement;
    private String comments;
}
