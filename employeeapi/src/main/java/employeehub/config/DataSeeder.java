package employeehub.config;

import employeehub.domain.LeaveType;
import employeehub.repository.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final LeaveTypeRepository leaveTypeRepository;

    @Override
    public void run(ApplicationArguments args) {
        seedLeaveTypes();
    }

    private void seedLeaveTypes() {
        List<LeaveType> types = List.of(
                leaveType("Annual Leave", 15, 1, false, true),
                leaveType("Sick Leave", 30, 3, true, true),
                leaveType("Family Responsibility", 3, 1, false, true),
                leaveType("Maternity Leave", 120, 1, true, true),
                leaveType("Parental Leave", 10, 1, false, true),
                leaveType("Study Leave", 5, 1, true, false)
        );

        for (LeaveType type : types) {
            if (!leaveTypeRepository.existsByName(type.getName())) {
                leaveTypeRepository.save(type);
            }
        }
    }

    private LeaveType leaveType(String name, int days, int cycleYears, boolean requiresDocs, boolean isPaid) {
        LeaveType t = new LeaveType();
        t.setName(name);
        t.setDefaultDays(days);
        t.setCycleYears(cycleYears);
        t.setRequiresDocumentation(requiresDocs);
        t.setIsPaid(isPaid);
        return t;
    }
}
