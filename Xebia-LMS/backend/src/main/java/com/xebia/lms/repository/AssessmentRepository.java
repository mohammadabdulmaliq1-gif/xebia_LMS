package com.xebia.lms.repository;

import com.xebia.lms.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("jpaAssessmentRepository")
public interface AssessmentRepository extends JpaRepository<Assessment, String> {
}
