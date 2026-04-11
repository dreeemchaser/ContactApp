package employeehub.controller;

import employeehub.domain.Employee;
import employeehub.domain.enums.EmploymentStatus;
import employeehub.dto.ApiResponse;
import employeehub.dto.EmployeeRequest;
import employeehub.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@Tag(name = "Employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "Get all employees (paginated, filterable)")
    public ResponseEntity<ApiResponse<Page<Employee>>> getAll(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) EmploymentStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getAll(departmentId, teamId, status, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<ApiResponse<Employee>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new employee")
    public ResponseEntity<ApiResponse<Employee>> create(@RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(employeeService.create(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an employee")
    public ResponseEntity<ApiResponse<Employee>> update(@PathVariable String id, @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.update(id, request)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update employee employment status")
    public ResponseEntity<ApiResponse<Employee>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        EmploymentStatus status = EmploymentStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok(employeeService.updateStatus(id, status)));
    }
}
