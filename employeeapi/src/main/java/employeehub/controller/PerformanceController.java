package employeehub.controller;

import employeehub.domain.PerformanceCycle;
import employeehub.domain.PerformanceGoal;
import employeehub.domain.PerformanceReview;
import employeehub.domain.enums.PerformanceGoalStatus;
import employeehub.dto.*;
import employeehub.service.EmployeeService;
import employeehub.service.PerformanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/performance")
@RequiredArgsConstructor
@Tag(name = "Performance")
public class PerformanceController {

    private final PerformanceService performanceService;
    private final EmployeeService employeeService;

    // ── Cycles ───────────────────────────────────────────────────────

    @PostMapping("/cycles")
    @Operation(summary = "Create a performance cycle (HR)")
    public ResponseEntity<ApiResponse<PerformanceCycle>> createCycle(@RequestBody PerformanceCycleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(performanceService.createCycle(request)));
    }

    @GetMapping("/cycles")
    @Operation(summary = "List all performance cycles")
    public ResponseEntity<ApiResponse<List<PerformanceCycle>>> getCycles() {
        return ResponseEntity.ok(ApiResponse.ok(performanceService.getCycles()));
    }

    // ── Goals ─────────────────────────────────────────────────────────

    @PostMapping("/goals")
    @Operation(summary = "Create a goal for an employee (Manager/HR)")
    public ResponseEntity<ApiResponse<PerformanceGoal>> createGoal(
            @RequestBody PerformanceGoalRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        var creator = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(performanceService.createGoal(request, creator.getId())));
    }

    @GetMapping("/goals/my")
    @Operation(summary = "Get current employee's goals")
    public ResponseEntity<ApiResponse<List<PerformanceGoal>>> getMyGoals(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(performanceService.getMyGoals(employee.getId())));
    }

    @PatchMapping("/goals/{id}/status")
    @Operation(summary = "Update goal status")
    public ResponseEntity<ApiResponse<PerformanceGoal>> updateGoalStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        PerformanceGoalStatus status = PerformanceGoalStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok(performanceService.updateGoalStatus(id, status)));
    }

    // ── Reviews ───────────────────────────────────────────────────────

    @PostMapping("/reviews")
    @Operation(summary = "Submit a performance review (Manager)")
    public ResponseEntity<ApiResponse<PerformanceReview>> createReview(
            @RequestBody PerformanceReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        var reviewer = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(performanceService.createReview(request, reviewer.getId())));
    }

    @GetMapping("/reviews/my")
    @Operation(summary = "Get current employee's reviews")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getMyReviews(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(performanceService.getMyReviews(employee.getId())));
    }

    @PatchMapping("/reviews/{id}/acknowledge")
    @Operation(summary = "Acknowledge a performance review (Employee)")
    public ResponseEntity<ApiResponse<PerformanceReview>> acknowledge(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(performanceService.acknowledge(id, employee.getId())));
    }
}
