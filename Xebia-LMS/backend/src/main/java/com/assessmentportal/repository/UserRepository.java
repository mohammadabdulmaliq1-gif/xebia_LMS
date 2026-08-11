package com.assessmentportal.repository;

import com.assessmentportal.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository("mongoUserRepository")
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmailAndRole(String email, String role);
    Optional<User> findByEmail(String email);
}
