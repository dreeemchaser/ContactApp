package employeehub.domain;

import employeehub.domain.enums.PerformanceReviewStatus;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@Table(name = "performance_reviews")
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Employee reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private PerformanceCycle cycle;

    @Column(nullable = false)
    private Integer overallRating;

    private String strengths;
    private String areasForImprovement;
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerformanceReviewStatus status = PerformanceReviewStatus.SUBMITTED;

    private LocalDateTime acknowledgedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
