package com.xebia.lms.repository;

import com.xebia.lms.model.Submodule;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmoduleRepository extends JpaRepository<Submodule, String> {
    List<Submodule> findByModuleIdOrderByOrderAsc(String moduleId);
    long countByModuleId(String moduleId);

    @Query("SELECT s FROM Submodule s WHERE s.slug = :submoduleSlug AND s.moduleId IN " +
           "(SELECT m.id FROM Module m WHERE m.courseId = " +
           "(SELECT c.id FROM Course c WHERE c.slug = :courseSlug))")
    Optional<Submodule> findByCourseSlugAndSubmoduleSlug(
        @Param("courseSlug") String courseSlug,
        @Param("submoduleSlug") String submoduleSlug
    );
}
