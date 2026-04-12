package employeehub.controller;

import employeehub.domain.Employee;
import employeehub.domain.enums.EmploymentStatus;
import employeehub.domain.enums.EmploymentType;
import employeehub.domain.enums.Role;
import employeehub.dto.ApiResponse;
import employeehub.repository.DepartmentRepository;
import employeehub.repository.EmployeeRepository;
import employeehub.repository.TeamRepository;
import employeehub.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    @Operation(summary = "Register a new employee (defaults to EMPLOYEE role)")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String firstName = body.get("firstName");
        String lastName = body.get("lastName");

        if (employeeRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Email already registered"));
        }

        var department = departmentRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No department found — seed one first"));
        var team = teamRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No team found — seed one first"));

        Employee employee = new Employee();
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setPassword(passwordEncoder.encode(password));
        employee.setJobTitle("Employee");
        employee.setEmploymentType(EmploymentType.FULL_TIME);
        employee.setEmploymentStatus(EmploymentStatus.ACTIVE);
        employee.setStartDate(LocalDate.now());
        employee.setRole(Role.EMPLOYEE);
        employee.setDepartment(department);
        employee.setTeam(team);
        employee.setEmployeeNumber(generateEmployeeNumber());
        employeeRepository.save(employee);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Employee registered successfully", null));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive a JWT token")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody Map<String, String> body) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.get("email"), body.get("password"))
        );
        Employee employee = employeeRepository.findByEmail(body.get("email"))
                .orElseThrow();
        String token = jwtUtil.generateToken(employee.getEmail(), employee.getRole().name());
        return ResponseEntity.ok(ApiResponse.ok(Map.of("token", token)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated employee profile")
    public ResponseEntity<ApiResponse<Employee>> me(@AuthenticationPrincipal UserDetails userDetails) {
        Employee employee = employeeRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(employee));
    }

    private String generateEmployeeNumber() {
        long count = employeeRepository.countAll() + 1;
        return String.format("EMP-%03d", count);
    }
}
