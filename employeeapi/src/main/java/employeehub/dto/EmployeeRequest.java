package employeehub.dto;

import employeehub.domain.enums.EmploymentStatus;
import employeehub.domain.enums.EmploymentType;
import employeehub.domain.enums.Role;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String nationality;
    private String idNumber;
    private String address;
    private String jobTitle;
    private EmploymentType employmentType;
    private EmploymentStatus employmentStatus;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long departmentId;
    private Long teamId;
    private String managerId;
    private Role role;
}
