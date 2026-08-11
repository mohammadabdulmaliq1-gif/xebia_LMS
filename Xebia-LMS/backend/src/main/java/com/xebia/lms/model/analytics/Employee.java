package com.xebia.lms.model.analytics;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analytics_employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    private String id;
    private String name;
    private String email;
    private String region;
    private String location;
    private String businessUnit;
    private String department;
    private String project;
    private String practice;
    private String grade;
    private String createdAt; // YYYY-MM-DD
}
