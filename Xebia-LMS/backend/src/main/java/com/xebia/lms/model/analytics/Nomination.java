package com.xebia.lms.model.analytics;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analytics_nominations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Nomination {
    @Id
    private String id;
    private String employeeId;
    private String trainingId;
    private String status; // NOMINATED, TRAINED
    private String nominatedDate; // YYYY-MM-DD
}
