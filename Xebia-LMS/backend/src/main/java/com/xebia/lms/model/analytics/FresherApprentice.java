package com.xebia.lms.model.analytics;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analytics_fresher_apprentice")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FresherApprentice {
    @Id
    private String id;
    private String employeeId;
    private String hiringDate; // YYYY-MM-DD
    private String status; // Campus Hiring, Training Enrollment, Training Completion, Certification Completion, Project Allocation, Billable Deployment
    private Integer timeToDeploymentDays;
}
