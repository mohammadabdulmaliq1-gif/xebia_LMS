package com.xebia.lms.repository.analytics;

import com.xebia.lms.model.analytics.FresherApprentice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FresherApprenticeRepository extends JpaRepository<FresherApprentice, String> {
}
