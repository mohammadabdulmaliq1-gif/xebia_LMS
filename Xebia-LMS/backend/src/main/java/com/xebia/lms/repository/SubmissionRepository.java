package com.xebia.lms.repository;

import com.xebia.lms.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("jpaSubmissionRepository")
public interface SubmissionRepository extends JpaRepository<Submission, String> {
}
