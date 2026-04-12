package employeehub.controller;

import employeehub.domain.Employee;
import employeehub.dto.ApiResponse;
import employeehub.repository.EmployeeRepository;
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

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "Login and receive a JWT token")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody Map<String, String> body) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.get("email"), body.get("password"))
        );
        Employee employee = employeeRepository.findByEmail(body.get("email")).orElseThrow();
        String token = jwtUtil.generateToken(employee.getEmail(), employee.getRole().name());
        return ResponseEntity.ok(ApiResponse.ok(Map.of("token", token)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated employee profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(@AuthenticationPrincipal UserDetails userDetails) {
        Employee employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Map<String, Object> profile = Map.ofEntries(
                Map.entry("id", employee.getId()),
                Map.entry("employeeNumber", employee.getEmployeeNumber()),
                Map.entry("firstName", employee.getFirstName()),
                Map.entry("lastName", employee.getLastName()),
                Map.entry("email", employee.getEmail()),
                Map.entry("jobTitle", employee.getJobTitle()),
                Map.entry("role", employee.getRole()),
                Map.entry("employmentStatus", employee.getEmploymentStatus()),
                Map.entry("profilePhoto", employee.getProfilePhoto() != null ? employee.getProfilePhoto() : "")
        );
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
