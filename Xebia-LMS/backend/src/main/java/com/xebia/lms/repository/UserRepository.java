package com.xebia.lms.repository;

import com.xebia.lms.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("jpaUserRepository")
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
    boolean existsByEmailOrUsername(String email, String username);
}
