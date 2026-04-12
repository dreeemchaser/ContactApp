package employeehub.config;

import employeehub.domain.LeaveType;
import employeehub.domain.TaxBracket;
import employeehub.repository.LeaveTypeRepository;
import employeehub.repository.TaxBracketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final LeaveTypeRepository leaveTypeRepository;
    private final TaxBracketRepository taxBracketRepository;

    @Override
    public void run(ApplicationArguments args) {
        seedLeaveTypes();
        seedTaxBrackets();
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

    // SA 2025/2026 tax year brackets (annual income)
    // Primary rebate: R17 235 | UIF: 1% employee capped at R177.12/month
    private void seedTaxBrackets() {
        if (taxBracketRepository.existsByTaxYear(2025)) return;

        List<TaxBracket> brackets = List.of(
                taxBracket(2025, 0L,          237_100L,    0L,          18.00, 17_235L),
                taxBracket(2025, 237_101L,    370_500L,    42_678L,     26.00, 17_235L),
                taxBracket(2025, 370_501L,    512_800L,    77_362L,     31.00, 17_235L),
                taxBracket(2025, 512_801L,    673_000L,    121_475L,    36.00, 17_235L),
                taxBracket(2025, 673_001L,    857_900L,    179_147L,    39.00, 17_235L),
                taxBracket(2025, 857_901L,    1_817_000L,  251_258L,    41.00, 17_235L),
                taxBracket(2025, 1_817_001L,  null,        644_489L,    45.00, 17_235L)
        );
        taxBracketRepository.saveAll(brackets);
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

    private TaxBracket taxBracket(int year, long min, Long max, long base, double rate, long rebate) {
        TaxBracket t = new TaxBracket();
        t.setTaxYear(year);
        t.setMinIncome(BigDecimal.valueOf(min));
        t.setMaxIncome(max != null ? BigDecimal.valueOf(max) : null);
        t.setBaseTax(BigDecimal.valueOf(base));
        t.setMarginalRate(BigDecimal.valueOf(rate));
        t.setRebate(BigDecimal.valueOf(rebate));
        return t;
    }
}
