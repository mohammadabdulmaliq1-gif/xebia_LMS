package com.xebia.lms.repository.analytics;

import com.xebia.lms.model.analytics.Nomination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NominationRepository extends JpaRepository<Nomination, String> {
}
