package com.xebia.lms.model.analytics;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analytics_certifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
    @Id
    private String id;
    private String employeeId;
    private String name;
    private String technology; // Databricks, AWS, Azure, GCP, Snowflake, PMP
    private String status; // Assigned, Enrolled, Started, Completed, Submitted, Approved
    private String completionDate; // YYYY-MM-DD
    private String region;
    private String project;
    private String grade;
}
