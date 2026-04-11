package employeehub.service;

import employeehub.domain.Department;
import employeehub.domain.Team;
import employeehub.exception.ResourceNotFoundException;
import employeehub.repository.DepartmentRepository;
import employeehub.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final DepartmentRepository departmentRepository;

    public List<Team> getAll(Long departmentId) {
        if (departmentId != null) {
            return teamRepository.findByDepartmentId(departmentId);
        }
        return teamRepository.findAll();
    }

    public Team create(Long departmentId, Team team) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + departmentId));
        team.setDepartment(department);
        return teamRepository.save(team);
    }

    public Team update(Long id, Team updated) {
        Team existing = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + id));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        if (updated.getDepartment() != null && updated.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(updated.getDepartment().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + updated.getDepartment().getId()));
            existing.setDepartment(department);
        }
        return teamRepository.save(existing);
    }

    public void delete(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Team not found: " + id);
        }
        teamRepository.deleteById(id);
    }
}
