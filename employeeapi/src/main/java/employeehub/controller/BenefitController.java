package employeehub.controller;

import employeehub.domain.BenefitApplication;
import employeehub.domain.BenefitType;
import employeehub.domain.EmployeeBenefit;
import employeehub.dto.ApiResponse;
import employeehub.service.EmployeeService;
import employeehub.service.BenefitService;
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
@RequestMapping("/benefits")
@RequiredArgsConstructor
@Tag(name = "Benefits")
public class BenefitController {

    private final BenefitService benefitService;
    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "List all available benefit types")
    public ResponseEntity<ApiResponse<List<BenefitType>>> getAllTypes() {
        return ResponseEntity.ok(ApiResponse.ok(benefitService.getAllTypes()));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current employee's active benefits")
    public ResponseEntity<ApiResponse<List<EmployeeBenefit>>> getMy(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(benefitService.getMyBenefits(employee.getId())));
    }

    @PostMapping("/apply")
    @Operation(summary = "Apply for a benefit")
    public ResponseEntity<ApiResponse<BenefitApplication>> apply(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Long> body) {
        var employee = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(benefitService.apply(employee.getId(), body.get("benefitTypeId"))));
    }

    @PatchMapping("/applications/{id}/approve")
    @Operation(summary = "Approve a benefit application (HR)")
    public ResponseEntity<ApiResponse<BenefitApplication>> approve(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var reviewer = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(benefitService.approve(id, reviewer.getId())));
    }

    @PatchMapping("/applications/{id}/reject")
    @Operation(summary = "Reject a benefit application (HR)")
    public ResponseEntity<ApiResponse<BenefitApplication>> reject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var reviewer = employeeService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(benefitService.reject(id, reviewer.getId())));
    }
}
