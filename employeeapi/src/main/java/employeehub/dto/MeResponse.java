package employeehub.dto;

import employeehub.domain.Employee;
import employeehub.domain.enums.EmploymentStatus;
import employeehub.domain.enums.Role;
import lombok.Getter;

@Getter
public class MeResponse {

    private final String id;
    private final String employeeNumber;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String jobTitle;
    private final Role role;
    private final EmploymentStatus employmentStatus;
    private final String profilePhoto;

    public MeResponse(Employee employee) {
        this.id               = employee.getId();
        this.employeeNumber   = employee.getEmployeeNumber();
        this.firstName        = employee.getFirstName();
        this.lastName         = employee.getLastName();
        this.email            = employee.getEmail();
        this.jobTitle         = employee.getJobTitle();
        this.role             = employee.getRole();
        this.employmentStatus = employee.getEmploymentStatus();
        this.profilePhoto     = employee.getProfilePhoto() != null ? employee.getProfilePhoto() : "";
    }
}
