package employeehub.service;

import employeehub.domain.*;
import employeehub.domain.enums.PerformanceGoalStatus;
import employeehub.domain.enums.PerformanceReviewStatus;
import employeehub.dto.PerformanceCycleRequest;
import employeehub.dto.PerformanceGoalRequest;
import employeehub.dto.PerformanceReviewRequest;
import employeehub.exception.ResourceNotFoundException;
import employeehub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final PerformanceCycleRepository cycleRepository;
    private final PerformanceGoalRepository goalRepository;
    private final PerformanceReviewRepository reviewRepository;
    private final EmployeeRepository employeeRepository;

    // ── Cycles ───────────────────────────────────────────────────────

    public PerformanceCycle createCycle(PerformanceCycleRequest req) {
        PerformanceCycle cycle = new PerformanceCycle();
        cycle.setName(req.getName());
        cycle.setStartDate(req.getStartDate());
        cycle.setEndDate(req.getEndDate());
        return cycleRepository.save(cycle);
    }

    public List<PerformanceCycle> getCycles() {
        return cycleRepository.findAll();
    }

    // ── Goals ─────────────────────────────────────────────────────────

    public PerformanceGoal createGoal(PerformanceGoalRequest req, String createdById) {
        Employee employee = findEmployee(req.getEmployeeId());
        PerformanceCycle cycle = findCycle(req.getCycleId());
        Employee createdBy = findEmployee(createdById);

        PerformanceGoal goal = new PerformanceGoal();
        goal.setEmployee(employee);
        goal.setCycle(cycle);
        goal.setTitle(req.getTitle());
        goal.setDescription(req.getDescription());
        goal.setTargetDate(req.getTargetDate());
        goal.setCreatedBy(createdBy);
        return goalRepository.save(goal);
    }

    public List<PerformanceGoal> getMyGoals(String employeeId) {
        return goalRepository.findByEmployeeId(employeeId);
    }

    public PerformanceGoal updateGoalStatus(String goalId, PerformanceGoalStatus status) {
        PerformanceGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalId));
        goal.setStatus(status);
        return goalRepository.save(goal);
    }

    // ── Reviews ───────────────────────────────────────────────────────

    public PerformanceReview createReview(PerformanceReviewRequest req, String reviewerId) {
        Employee employee = findEmployee(req.getEmployeeId());
        PerformanceCycle cycle = findCycle(req.getCycleId());
        Employee reviewer = findEmployee(reviewerId);

        PerformanceReview review = new PerformanceReview();
        review.setEmployee(employee);
        review.setCycle(cycle);
        review.setReviewer(reviewer);
        review.setOverallRating(req.getOverallRating());
        review.setStrengths(req.getStrengths());
        review.setAreasForImprovement(req.getAreasForImprovement());
        review.setComments(req.getComments());
        return reviewRepository.save(review);
    }

    public List<PerformanceReview> getMyReviews(String employeeId) {
        return reviewRepository.findByEmployeeId(employeeId);
    }

    public PerformanceReview acknowledge(String reviewId, String employeeId) {
        PerformanceReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
        if (!review.getEmployee().getId().equals(employeeId)) {
            throw new IllegalArgumentException("You can only acknowledge your own reviews");
        }
        review.setStatus(PerformanceReviewStatus.ACKNOWLEDGED);
        review.setAcknowledgedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private Employee findEmployee(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    private PerformanceCycle findCycle(String id) {
        return cycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance cycle not found: " + id));
    }
}
