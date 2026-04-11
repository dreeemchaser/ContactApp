package employeehub.controller;

import employeehub.domain.Department;
import employeehub.dto.ApiResponse;
import employeehub.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
@Tag(name = "Departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Get all departments")
    public ResponseEntity<ApiResponse<List<Department>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(departmentService.getAll()));
    }

    @PostMapping
    @Operation(summary = "Create a department")
    public ResponseEntity<ApiResponse<Department>> create(@RequestBody Department department) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(departmentService.create(department)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a department")
    public ResponseEntity<ApiResponse<Department>> update(@PathVariable Long id, @RequestBody Department department) {
        return ResponseEntity.ok(ApiResponse.ok(departmentService.update(id, department)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a department")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Department deleted", null));
    }
}
