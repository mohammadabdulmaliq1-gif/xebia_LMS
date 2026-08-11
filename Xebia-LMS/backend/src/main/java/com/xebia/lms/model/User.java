package com.xebia.lms.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @Column(name = "learner_name", nullable = false)
    private String learnerName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password; // Stored password

    private String role; // admin, learner

    private String status; // ACTIVE, INACTIVE

    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "batch_id")
    private String batchId;

    @Column(name = "force_password_reset")
    private Boolean forcePasswordReset;

    @Column(name = "created_at")
    private String createdAt;
}
