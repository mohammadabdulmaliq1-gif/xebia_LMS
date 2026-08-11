package com.xebia.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private com.xebia.lms.repository.UserRepository jpaUserRepository;

    @Autowired
    private com.assessmentportal.repository.UserRepository mongoUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String emailOrUsername = credentials.get("email");
        if (emailOrUsername == null || emailOrUsername.isEmpty()) {
            emailOrUsername = credentials.get("username");
        }
        String password = credentials.get("password");
        String requestedRole = credentials.get("role"); // Optional role from Assessment portal

        if (emailOrUsername == null || password == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Email/Username and Password are required");
            return ResponseEntity.badRequest().body(err);
        }

        // 1. Try to authenticate against MongoDB first
        try {
            Optional<com.assessmentportal.model.User> mongoUserOpt = mongoUserRepository.findByEmail(emailOrUsername.trim().toLowerCase());
            if (mongoUserOpt.isPresent()) {
                com.assessmentportal.model.User mongoUser = mongoUserOpt.get();
                if (mongoUser.getPassword().equals(password)) {
                    // If a specific role is requested, verify it matches
                    if (requestedRole != null && !requestedRole.equalsIgnoreCase(mongoUser.getRole())) {
                        Map<String, String> err = new HashMap<>();
                        err.put("error", "Invalid role for this user");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
                    }

                    Map<String, Object> response = new HashMap<>();
                    response.put("id", mongoUser.getId());
                    response.put("name", mongoUser.getName());
                    response.put("email", mongoUser.getEmail());
                    response.put("role", mongoUser.getRole().toLowerCase());
                    response.put("avatar", mongoUser.getAvatar() != null ? mongoUser.getAvatar() : "");
                    response.put("batch", mongoUser.getBatch() != null ? mongoUser.getBatch() : "");
                    response.put("rollNumber", mongoUser.getRollNumber() != null ? mongoUser.getRollNumber() : "");
                    response.put("token", "jwt-token-for-mongo-" + mongoUser.getId() + "-" + System.currentTimeMillis());
                    return ResponseEntity.ok(response);
                }
            }
        } catch (Exception e) {
            System.err.println("[AuthController] WARNING: MongoDB lookup failed, falling back to JPA: " + e.getMessage());
        }

        // 2. Fallback to JPA H2 repository (for Course LMS users)
        Optional<com.xebia.lms.model.User> jpaUserOpt = jpaUserRepository.findByEmail(emailOrUsername);
        if (!jpaUserOpt.isPresent()) {
            jpaUserOpt = jpaUserRepository.findByUsername(emailOrUsername);
        }

        if (jpaUserOpt.isPresent()) {
            com.xebia.lms.model.User jpaUser = jpaUserOpt.get();
            if (jpaUser.getPassword().equals(password)) {
                if (requestedRole != null && !requestedRole.equalsIgnoreCase(jpaUser.getRole())) {
                    Map<String, String> err = new HashMap<>();
                    err.put("error", "Invalid role for this user");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
                }

                Map<String, Object> response = new HashMap<>();
                response.put("id", jpaUser.getId());
                response.put("name", jpaUser.getLearnerName());
                response.put("email", jpaUser.getEmail());
                response.put("role", jpaUser.getRole().toLowerCase());
                response.put("avatar", "");
                response.put("batch", jpaUser.getBatchId() != null ? jpaUser.getBatchId() : "");
                response.put("rollNumber", "");
                response.put("token", "jwt-token-for-jpa-" + jpaUser.getId() + "-" + System.currentTimeMillis());
                return ResponseEntity.ok(response);
            }
        }

        Map<String, String> err = new HashMap<>();
        err.put("error", "Invalid email/username or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }
}
