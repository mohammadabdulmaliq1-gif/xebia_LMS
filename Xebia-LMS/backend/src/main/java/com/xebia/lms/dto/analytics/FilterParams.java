package com.xebia.lms.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterParams {
    private String year;
    private String quarter;
    private String halfYear;
    private String month;
    private String startDate;
    private String endDate;
    private String region;
    private String location;
    private String businessUnit;
    private String department;
    private String project;
    private String practice;
    private String employeeGrade;
    private String employeeId;
}
