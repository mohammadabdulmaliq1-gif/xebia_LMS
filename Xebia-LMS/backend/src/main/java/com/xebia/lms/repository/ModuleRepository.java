package com.xebia.lms.repository;

import com.xebia.lms.model.Module;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, String> {
    List<Module> findByCourseIdOrderByOrderAsc(String courseId);
    long countByCourseId(String courseId);
}
