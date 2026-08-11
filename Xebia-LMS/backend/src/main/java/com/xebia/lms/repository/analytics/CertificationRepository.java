package com.xebia.lms.repository.analytics;

import com.xebia.lms.model.analytics.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, String> {
}
