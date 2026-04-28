package employeehub.service;

import employeehub.domain.*;
import employeehub.domain.enums.PerformanceGoalStatus;
import employeehub.domain.enums.PerformanceReviewStatus;
import employeehub.dto.PerformanceCycleRequest;
import employeehub.dto.PerformanceGoalRequest;
import employeehub.dto.PerformanceReviewRequest;
import employeehub.exception.ResourceNotFoundException;
import employeehub.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PerformanceServiceTest {

    @Mock PerformanceCycleRepository cycleRepository;
    @Mock PerformanceGoalRepository goalRepository;
    @Mock PerformanceReviewRepository reviewRepository;
    @Mock EmployeeRepository employeeRepository;

    @InjectMocks PerformanceService performanceService;

    private Employee employee;
    private Employee reviewer;
    private PerformanceCycle cycle;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setId("emp-1");
        employee.setFirstName("John");

        reviewer = new Employee();
        reviewer.setId("mgr-1");

        cycle = new PerformanceCycle();
        cycle.setId("cycle-1");
        cycle.setName("Q1 2025");
    }

    // ── Cycles ───────────────────────────────────────────────────────

    @Test
    void createCycle_shouldPersistAndReturn() {
        PerformanceCycleRequest req = new PerformanceCycleRequest();
        req.setName("Q2 2025");
        req.setStartDate(LocalDate.of(2025, 4, 1));
        req.setEndDate(LocalDate.of(2025, 6, 30));

        when(cycleRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PerformanceCycle result = performanceService.createCycle(req);

        assertThat(result.getName()).isEqualTo("Q2 2025");
        verify(cycleRepository).save(any());
    }

    @Test
    void getCycles_shouldReturnAll() {
        when(cycleRepository.findAll()).thenReturn(List.of(cycle));

        List<PerformanceCycle> result = performanceService.getCycles();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Q1 2025");
    }

    // ── Goals ─────────────────────────────────────────────────────────

    @Test
    void createGoal_shouldAssignEmployeeAndCycle() {
        PerformanceGoalRequest req = new PerformanceGoalRequest();
        req.setEmployeeId("emp-1");
        req.setCycleId("cycle-1");
        req.setTitle("Improve test coverage");
        req.setTargetDate(LocalDate.of(2025, 3, 31));

        when(employeeRepository.findById("emp-1")).thenReturn(Optional.of(employee));
        when(employeeRepository.findById("mgr-1")).thenReturn(Optional.of(reviewer));
        when(cycleRepository.findById("cycle-1")).thenReturn(Optional.of(cycle));
        when(goalRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PerformanceGoal result = performanceService.createGoal(req, "mgr-1");

        assertThat(result.getTitle()).isEqualTo("Improve test coverage");
        assertThat(result.getEmployee()).isEqualTo(employee);
        assertThat(result.getCycle()).isEqualTo(cycle);
        assertThat(result.getCreatedBy()).isEqualTo(reviewer);
    }

    @Test
    void createGoal_shouldThrow_whenEmployeeNotFound() {
        PerformanceGoalRequest req = new PerformanceGoalRequest();
        req.setEmployeeId("missing");
        req.setCycleId("cycle-1");

        when(employeeRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> performanceService.createGoal(req, "mgr-1"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee not found");
    }

    @Test
    void createGoal_shouldThrow_whenCycleNotFound() {
        PerformanceGoalRequest req = new PerformanceGoalRequest();
        req.setEmployeeId("emp-1");
        req.setCycleId("missing-cycle");

        when(employeeRepository.findById("emp-1")).thenReturn(Optional.of(employee));
        when(cycleRepository.findById("missing-cycle")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> performanceService.createGoal(req, "mgr-1"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Performance cycle not found");
    }

    @Test
    void getMyGoals_shouldReturnGoalsForEmployee() {
        PerformanceGoal goal = new PerformanceGoal();
        goal.setId("goal-1");
        goal.setEmployee(employee);

        when(goalRepository.findByEmployeeId("emp-1")).thenReturn(List.of(goal));

        List<PerformanceGoal> result = performanceService.getMyGoals("emp-1");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo("goal-1");
    }

    @Test
    void updateGoalStatus_shouldPersistNewStatus() {
        PerformanceGoal goal = new PerformanceGoal();
        goal.setId("goal-1");
        goal.setStatus(PerformanceGoalStatus.NOT_STARTED);

        when(goalRepository.findById("goal-1")).thenReturn(Optional.of(goal));
        when(goalRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PerformanceGoal result = performanceService.updateGoalStatus("goal-1", PerformanceGoalStatus.COMPLETED);

        assertThat(result.getStatus()).isEqualTo(PerformanceGoalStatus.COMPLETED);
    }

    @Test
    void updateGoalStatus_shouldThrow_whenGoalNotFound() {
        when(goalRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> performanceService.updateGoalStatus("missing", PerformanceGoalStatus.COMPLETED))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Goal not found");
    }

    // ── Reviews ───────────────────────────────────────────────────────

    @Test
    void createReview_shouldAssignReviewerAndEmployee() {
        PerformanceReviewRequest req = new PerformanceReviewRequest();
        req.setEmployeeId("emp-1");
        req.setCycleId("cycle-1");
        req.setOverallRating(4);
        req.setStrengths("Great communicator");
        req.setAreasForImprovement("Documentation");

        when(employeeRepository.findById("emp-1")).thenReturn(Optional.of(employee));
        when(employeeRepository.findById("mgr-1")).thenReturn(Optional.of(reviewer));
        when(cycleRepository.findById("cycle-1")).thenReturn(Optional.of(cycle));
        when(reviewRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PerformanceReview result = performanceService.createReview(req, "mgr-1");

        assertThat(result.getOverallRating()).isEqualTo(4);
        assertThat(result.getReviewer()).isEqualTo(reviewer);
        assertThat(result.getEmployee()).isEqualTo(employee);
        assertThat(result.getStrengths()).isEqualTo("Great communicator");
    }

    @Test
    void getMyReviews_shouldReturnReviewsForEmployee() {
        PerformanceReview review = new PerformanceReview();
        review.setId("rev-1");

        when(reviewRepository.findByEmployeeId("emp-1")).thenReturn(List.of(review));

        List<PerformanceReview> result = performanceService.getMyReviews("emp-1");

        assertThat(result).hasSize(1);
    }

    @Test
    void acknowledge_shouldSetAcknowledgedStatus() {
        PerformanceReview review = new PerformanceReview();
        review.setId("rev-1");
        review.setEmployee(employee);
        review.setStatus(PerformanceReviewStatus.SUBMITTED);

        when(reviewRepository.findById("rev-1")).thenReturn(Optional.of(review));
        when(reviewRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PerformanceReview result = performanceService.acknowledge("rev-1", "emp-1");

        assertThat(result.getStatus()).isEqualTo(PerformanceReviewStatus.ACKNOWLEDGED);
        assertThat(result.getAcknowledgedAt()).isNotNull();
    }

    @Test
    void acknowledge_shouldThrow_whenNotOwner() {
        PerformanceReview review = new PerformanceReview();
        review.setId("rev-1");
        review.setEmployee(employee);

        when(reviewRepository.findById("rev-1")).thenReturn(Optional.of(review));

        assertThatThrownBy(() -> performanceService.acknowledge("rev-1", "other-emp"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("your own reviews");
    }

    @Test
    void acknowledge_shouldThrow_whenReviewNotFound() {
        when(reviewRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> performanceService.acknowledge("missing", "emp-1"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Review not found");
    }
}
