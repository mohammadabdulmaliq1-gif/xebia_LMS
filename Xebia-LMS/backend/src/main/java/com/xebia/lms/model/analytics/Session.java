package com.xebia.lms.model.analytics;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analytics_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    private String id;
    private String trainingId;
    private String sessionDate; // YYYY-MM-DD
    private Integer attendeesCount;
    private Double learningHours;
    private Double durationHours;
}
