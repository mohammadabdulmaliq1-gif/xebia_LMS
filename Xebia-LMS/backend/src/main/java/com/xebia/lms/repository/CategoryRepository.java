package com.xebia.lms.repository;

import com.xebia.lms.model.Category;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
}
