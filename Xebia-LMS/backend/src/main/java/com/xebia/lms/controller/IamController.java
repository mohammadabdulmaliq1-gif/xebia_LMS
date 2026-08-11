package com.xebia.lms.controller;

import com.xebia.lms.model.User;
import com.xebia.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/iam/learner-credentials")
public class IamController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getLearners() {
        // Return users whose role is "learner" (case-insensitive)
        List<User> all = userRepository.findAll();
        List<User> learners = new ArrayList<>();
        for (User u : all) {
            if ("learner".equalsIgnoreCase(u.getRole())) {
                // Clear password before returning for security
                u.setPassword(null);
                learners.add(u);
            }
        }
        return learners;
    }

    @PostMapping
    public ResponseEntity<?> createLearner(@RequestBody Map<String, Object> payload) {
        String email = ((String) payload.get("email")).trim().toLowerCase();
        String learnerName = ((String) payload.get("learnerName")).trim();
        String username = (String) payload.get("username");
        if (username == null || username.trim().isEmpty()) {
            username = email.split("@")[0];
        }
        username = username.trim().toLowerCase();

        if (userRepository.existsByEmailOrUsername(email, username)) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "A learner credential already exists for this email or username.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        String password = (String) payload.get("password");
        String passwordToReturn = password;
        if (password == null || password.trim().isEmpty()) {
            passwordToReturn = generateTemporaryPassword();
            password = passwordToReturn;
        }

        String tenantId = (String) payload.get("tenantId");
        if (tenantId == null || tenantId.trim().isEmpty()) tenantId = "xebia-enterprise";

        String batchId = (String) payload.get("batchId");
        if (batchId == null || batchId.trim().isEmpty()) batchId = "default-batch";

        Boolean forcePasswordReset = (Boolean) payload.get("forcePasswordReset");
        if (forcePasswordReset == null) forcePasswordReset = true;

        User user = User.builder()
                .id("learner-" + System.currentTimeMillis())
                .learnerName(learnerName)
                .email(email)
                .username(username)
                .password(password)
                .role("learner")
                .status("ACTIVE")
                .tenantId(tenantId)
                .batchId(batchId)
                .forcePasswordReset(forcePasswordReset)
                .createdAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();

        User savedUser = userRepository.save(user);

        // Build return payload that matches frontend expected output (includes temporaryPassword)
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("learnerName", savedUser.getLearnerName());
        response.put("email", savedUser.getEmail());
        response.put("username", savedUser.getUsername());
        response.put("role", "LEARNER");
        response.put("status", savedUser.getStatus());
        response.put("tenantId", savedUser.getTenantId());
        response.put("batchId", savedUser.getBatchId());
        response.put("forcePasswordReset", savedUser.getForcePasswordReset());
        response.put("createdAt", savedUser.getCreatedAt());
        response.put("temporaryPassword", passwordToReturn);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearner(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
