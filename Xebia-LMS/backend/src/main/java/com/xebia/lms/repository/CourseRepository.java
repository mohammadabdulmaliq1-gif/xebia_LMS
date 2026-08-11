package com.xebia.lms.repository;

import com.xebia.lms.model.Course;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    Optional<Course> findBySlug(String slug);

    @Query("SELECT c FROM Course c WHERE " +
           "(:categoryId IS NULL OR :categoryId = '' OR c.categoryId = :categoryId) AND " +
           "(:level IS NULL OR :level = '' OR :level = 'All' OR c.level = :level) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Course> findCoursesWithFilters(
        @Param("search") String search,
        @Param("categoryId") String categoryId,
        @Param("level") String level
    );
}
