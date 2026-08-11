package com.xebia.lms.model;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learner_credentials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearnerCredential {

    @Id
    private String id;

    @Column(nullable = false)
    private String learnerName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Builder.Default
    private String role = "LEARNER";

    @Builder.Default
    private String status = "ACTIVE";

    private String tenantId;

    private String batchId;

    private Boolean forcePasswordReset;

    private LocalDateTime createdAt;
}
