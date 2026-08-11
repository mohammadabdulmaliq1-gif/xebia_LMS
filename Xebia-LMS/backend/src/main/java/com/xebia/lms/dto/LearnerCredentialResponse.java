package com.xebia.lms.dto;

import com.xebia.lms.model.LearnerCredential;
import java.time.LocalDateTime;

public class LearnerCredentialResponse {

    private String id;
    private String learnerName;
    private String email;
    private String username;
    private String temporaryPassword;
    private String role;
    private String status;
    private String tenantId;
    private String batchId;
    private Boolean forcePasswordReset;
    private LocalDateTime createdAt;

    public static LearnerCredentialResponse fromEntity(LearnerCredential credential) {
        LearnerCredentialResponse response = new LearnerCredentialResponse();
        response.setId(credential.getId());
        response.setLearnerName(credential.getLearnerName());
        response.setEmail(credential.getEmail());
        response.setUsername(credential.getUsername());
        response.setRole(credential.getRole());
        response.setStatus(credential.getStatus());
        response.setTenantId(credential.getTenantId());
        response.setBatchId(credential.getBatchId());
        response.setForcePasswordReset(credential.getForcePasswordReset());
        response.setCreatedAt(credential.getCreatedAt());
        return response;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLearnerName() {
        return learnerName;
    }

    public void setLearnerName(String learnerName) {
        this.learnerName = learnerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(String temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public Boolean getForcePasswordReset() {
        return forcePasswordReset;
    }

    public void setForcePasswordReset(Boolean forcePasswordReset) {
        this.forcePasswordReset = forcePasswordReset;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
