package com.xebia.lms.model.analytics;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analytics_trainings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Training {
    @Id
    private String id;
    private String name;
    private String category; // Compliance, Technical, AI & GenAI, Leadership Development, Upskilling, Certifications, Flagship Programs
    private Boolean isAI;
    private String flagshipProgramName; // YMP, Quantum Shift, Tech AI Thon, Databricks Program, GCV Certification Program, Kiro Learning Initiative, Copilot Learning Initiative
    private Double feedbackScore;
    private Double rating;
}
