package com.xebia.lms.model.analytics;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analytics_ai_usage")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIUsage {
    @Id
    private String id;
    private String employeeId;
    private String tool; // Copilot, Kiro, Claude, Other
    private Integer activeUsageDaysMonth;
    private String recordDate; // YYYY-MM-DD
}
