package com.xebia.lms.repository.analytics;

import com.xebia.lms.model.analytics.AIUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIUsageRepository extends JpaRepository<AIUsage, String> {
}
