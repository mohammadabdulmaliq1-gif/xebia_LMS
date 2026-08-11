package com.xebia.lms.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class LearnerCredentialRequest {

    @NotBlank
    private String learnerName;

    @Email
    @NotBlank
    private String email;

    private String username;

    private String password;

    private String tenantId;

    private String batchId;

    private Boolean forcePasswordReset;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}
