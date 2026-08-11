package com.xebia.lms.controller;

import com.xebia.lms.dto.LearnerCredentialRequest;
import com.xebia.lms.dto.LearnerCredentialResponse;
import com.xebia.lms.service.LearnerCredentialService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/iam/learner-credentials")
public class LearnerCredentialController {

    private final LearnerCredentialService service;

    public LearnerCredentialController(LearnerCredentialService service) {
        this.service = service;
    }

    @GetMapping
    public List<LearnerCredentialResponse> getLearnerCredentials() {
        return service.findAll();
    }

    @PostMapping
    public LearnerCredentialResponse createLearnerCredential(@Valid @RequestBody LearnerCredentialRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearnerCredential(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
