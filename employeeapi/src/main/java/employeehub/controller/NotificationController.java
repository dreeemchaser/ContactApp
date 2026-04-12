package employeehub.controller;

import employeehub.domain.Notification;
import employeehub.dto.ApiResponse;
import employeehub.repository.EmployeeRepository;
import employeehub.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final EmployeeRepository employeeRepository;

    @GetMapping("/my")
    @Operation(summary = "Get current employee's notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getMy(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getMy(employee.getId())));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(notificationService.markAsRead(id, employee.getId())));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        var employee = employeeRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        notificationService.markAllAsRead(employee.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }
}
