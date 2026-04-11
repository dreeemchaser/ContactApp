package employeehub.service;

import employeehub.domain.Department;
import employeehub.domain.Employee;
import employeehub.domain.Team;
import employeehub.domain.enums.EmploymentStatus;
import employeehub.dto.EmployeeRequest;
import employeehub.exception.ResourceNotFoundException;
import employeehub.repository.DepartmentRepository;
import employeehub.repository.EmployeeRepository;
import employeehub.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamRepository teamRepository;

    public Employee create(EmployeeRequest req) {
        if (employeeRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());
        }
        Employee employee = mapToEmployee(new Employee(), req);
        employee.setEmployeeNumber(generateEmployeeNumber());
        return employeeRepository.save(employee);
    }

    public Employee getById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    public Page<Employee> getAll(Long departmentId, Long teamId, EmploymentStatus status, Pageable pageable) {
        return employeeRepository.findAllFiltered(departmentId, teamId, status, pageable);
    }

    public Employee update(String id, EmployeeRequest req) {
        Employee existing = getById(id);
        return employeeRepository.save(mapToEmployee(existing, req));
    }

    public Employee updateStatus(String id, EmploymentStatus status) {
        Employee employee = getById(id);
        employee.setEmploymentStatus(status);
        if (status == EmploymentStatus.TERMINATED) {
            employee.setEndDate(java.time.LocalDate.now());
        }
        return employeeRepository.save(employee);
    }

    private Employee mapToEmployee(Employee employee, EmployeeRequest req) {
        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + req.getDepartmentId()));
        Team team = teamRepository.findById(req.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + req.getTeamId()));

        employee.setFirstName(req.getFirstName());
        employee.setLastName(req.getLastName());
        employee.setEmail(req.getEmail());
        employee.setPhone(req.getPhone());
        employee.setDateOfBirth(req.getDateOfBirth());
        employee.setGender(req.getGender());
        employee.setNationality(req.getNationality());
        employee.setIdNumber(req.getIdNumber());
        employee.setAddress(req.getAddress());
        employee.setJobTitle(req.getJobTitle());
        employee.setEmploymentType(req.getEmploymentType());
        employee.setStartDate(req.getStartDate());
        employee.setEndDate(req.getEndDate());
        employee.setDepartment(department);
        employee.setTeam(team);
        employee.setRole(req.getRole() != null ? req.getRole() : employee.getRole());
        employee.setEmploymentStatus(req.getEmploymentStatus() != null ? req.getEmploymentStatus() : employee.getEmploymentStatus());

        if (req.getManagerId() != null) {
            Employee manager = employeeRepository.findById(req.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found: " + req.getManagerId()));
            employee.setManager(manager);
        }

        return employee;
    }

    private String generateEmployeeNumber() {
        long count = employeeRepository.countAll() + 1;
        return String.format("EMP-%03d", count);
    }
}
