package com.xebia.lms.repository.analytics;

import com.xebia.lms.model.analytics.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
}
