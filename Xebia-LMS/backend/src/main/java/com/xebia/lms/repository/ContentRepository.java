package com.xebia.lms.repository;

import com.xebia.lms.model.Content;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<Content, String> {
    List<Content> findBySubmoduleIdOrderByOrderAsc(String submoduleId);
    long countBySubmoduleId(String submoduleId);
}
