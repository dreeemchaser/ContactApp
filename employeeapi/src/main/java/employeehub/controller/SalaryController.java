package employeehub.controller;

import employeehub.domain.PaySlip;
import employeehub.domain.SalaryIncreaseRequest;
import employeehub.domain.SalaryRecord;
import employeehub.dto.*;
import employeehub.repository.EmployeeRepository;
import employeehub.service.SalaryService;
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
@RequestMapping("/salary")
@RequiredArgsConstructor
@Tag(name = "Salary")
public class SalaryController {

    private final SalaryService salaryService;
    private final EmployeeRepository employeeRepository;

    // ── Salary Records ───────────────────────────────────────────────

    @PostMapping("/records")
    @Operation(summary = "Set employee salary (PAYROLL_ADMIN)")
    public ResponseEntity<ApiResponse<SalaryRecord>> createRecord(
            @RequestBody SalaryRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        var creator = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(salaryService.createRecord(request, creator.getId())));
    }

    @GetMapping("/records/{employeeId}")
    @Operation(summary = "Get salary history for an employee")
    public ResponseEntity<ApiResponse<List<SalaryRecord>>> getSalaryHistory(@PathVariable String employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(salaryService.getSalaryHistory(employeeId)));
    }

    // ── Payslips ─────────────────────────────────────────────────────

    @PostMapping("/payslips/generate")
    @Operation(summary = "Generate monthly payslip with PAYE and UIF")
    public ResponseEntity<ApiResponse<PaySlip>> generatePaySlip(
            @RequestBody PaySlipGenerateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        var generator = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(salaryService.generatePaySlip(request, generator.getId())));
    }

    @GetMapping("/payslips/my")
    @Operation(summary = "Get current employee's payslips")
    public ResponseEntity<ApiResponse<List<PaySlip>>> getMyPaySlips(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(salaryService.getMyPaySlips(employee.getId())));
    }

    @GetMapping("/payslips/{id}")
    @Operation(summary = "Get a single payslip")
    public ResponseEntity<ApiResponse<PaySlip>> getPaySlip(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(salaryService.getPaySlip(id)));
    }

    // ── Salary Increase Requests ─────────────────────────────────────

    @PostMapping("/increase-requests")
    @Operation(summary = "Submit a salary increase request (Manager)")
    public ResponseEntity<ApiResponse<SalaryIncreaseRequest>> submitIncreaseRequest(
            @RequestBody SalaryIncreaseRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        var requester = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(salaryService.submitIncreaseRequest(request, requester.getId())));
    }

    @PatchMapping("/increase-requests/{id}/approve")
    @Operation(summary = "Approve a salary increase request (HR_ADMIN)")
    public ResponseEntity<ApiResponse<SalaryIncreaseRequest>> approveIncreaseRequest(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var reviewer = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(salaryService.approveIncreaseRequest(id, reviewer.getId())));
    }

    @PatchMapping("/increase-requests/{id}/reject")
    @Operation(summary = "Reject a salary increase request (HR_ADMIN)")
    public ResponseEntity<ApiResponse<SalaryIncreaseRequest>> rejectIncreaseRequest(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        var reviewer = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(salaryService.rejectIncreaseRequest(id, reviewer.getId(), body.get("reason"))));
    }
}
