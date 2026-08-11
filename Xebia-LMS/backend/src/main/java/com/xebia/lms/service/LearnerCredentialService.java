package com.xebia.lms.service;

import com.xebia.lms.dto.LearnerCredentialRequest;
import com.xebia.lms.dto.LearnerCredentialResponse;
import com.xebia.lms.model.LearnerCredential;
import com.xebia.lms.repository.LearnerCredentialRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LearnerCredentialService {

    private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";

    private final LearnerCredentialRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public LearnerCredentialService(LearnerCredentialRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<LearnerCredentialResponse> findAll() {
        return repository.findAll().stream()
                .map(LearnerCredentialResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LearnerCredentialResponse create(LearnerCredentialRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String username = normalizeUsername(request.getUsername(), email);

        repository.findByEmail(email).ifPresent(existing -> {
            throw new IllegalArgumentException("A learner credential already exists for this email.");
        });
        repository.findByUsername(username).ifPresent(existing -> {
            throw new IllegalArgumentException("A learner credential already exists for this username.");
        });

        String temporaryPassword = hasText(request.getPassword()) ? request.getPassword().trim() : generatePassword();

        LearnerCredential credential = LearnerCredential.builder()
                .id("learner-" + System.currentTimeMillis())
                .learnerName(request.getLearnerName().trim())
                .email(email)
                .username(username)
                .passwordHash(passwordEncoder.encode(temporaryPassword))
                .role("LEARNER")
                .status("ACTIVE")
                .tenantId(defaultIfBlank(request.getTenantId(), "xebia-enterprise"))
                .batchId(defaultIfBlank(request.getBatchId(), "default-batch"))
                .forcePasswordReset(request.getForcePasswordReset() == null || request.getForcePasswordReset())
                .createdAt(LocalDateTime.now())
                .build();

        LearnerCredentialResponse response = LearnerCredentialResponse.fromEntity(repository.save(credential));
        response.setTemporaryPassword(temporaryPassword);
        return response;
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    private String normalizeUsername(String requestedUsername, String email) {
        if (hasText(requestedUsername)) {
            return requestedUsername.trim().toLowerCase();
        }
        return email.substring(0, email.indexOf("@")).replaceAll("[^a-zA-Z0-9._-]", "").toLowerCase();
    }

    private String generatePassword() {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            builder.append(PASSWORD_CHARS.charAt(secureRandom.nextInt(PASSWORD_CHARS.length())));
        }
        return builder.toString();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String defaultIfBlank(String value, String fallback) {
        return hasText(value) ? value.trim() : fallback;
    }
}
