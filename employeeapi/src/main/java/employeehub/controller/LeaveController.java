package employeehub.controller;

import employeehub.domain.LeaveBalance;
import employeehub.domain.LeaveRequest;
import employeehub.dto.ApiResponse;
import employeehub.dto.LeaveRequestDto;
import employeehub.repository.EmployeeRepository;
import employeehub.service.LeaveService;
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
@RequestMapping("/leave")
@RequiredArgsConstructor
@Tag(name = "Leave Management")
public class LeaveController {

    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    @GetMapping("/requests")
    @Operation(summary = "Get all leave requests (HR/Manager filtered)")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        var requester = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getAllRequests(requester)));
    }

    @GetMapping("/requests/my")
    @Operation(summary = "Get current employee's leave requests")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getMy(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getMyRequests(employee.getId())));
    }

    @PostMapping("/requests")
    @Operation(summary = "Submit a leave request")
    public ResponseEntity<ApiResponse<LeaveRequest>> submit(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody LeaveRequestDto dto) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(leaveService.submit(employee.getId(), dto)));
    }

    @PatchMapping("/requests/{id}/approve")
    @Operation(summary = "Approve a leave request")
    public ResponseEntity<ApiResponse<LeaveRequest>> approve(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var approver = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(leaveService.approve(id, approver.getId())));
    }

    @PatchMapping("/requests/{id}/reject")
    @Operation(summary = "Reject a leave request")
    public ResponseEntity<ApiResponse<LeaveRequest>> reject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        var approver = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(leaveService.reject(id, approver.getId(), body.get("reason"))));
    }

    @DeleteMapping("/requests/{id}")
    @Operation(summary = "Cancel a leave request (employee only, must be PENDING)")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        leaveService.cancel(id, employee.getId());
        return ResponseEntity.ok(ApiResponse.ok("Leave request cancelled", null));
    }

    @GetMapping("/balances/my")
    @Operation(summary = "Get current employee's leave balances")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> getMyBalances(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getMyBalances(employee.getId())));
    }
}
