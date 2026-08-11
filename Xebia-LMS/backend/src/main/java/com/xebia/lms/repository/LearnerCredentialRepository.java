package com.xebia.lms.repository;

import com.xebia.lms.model.LearnerCredential;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerCredentialRepository extends JpaRepository<LearnerCredential, String> {
    Optional<LearnerCredential> findByEmail(String email);
    Optional<LearnerCredential> findByUsername(String username);
}
