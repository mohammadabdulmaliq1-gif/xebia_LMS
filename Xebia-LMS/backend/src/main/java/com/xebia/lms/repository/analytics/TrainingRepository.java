package com.xebia.lms.repository.analytics;

import com.xebia.lms.model.analytics.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingRepository extends JpaRepository<Training, String> {
}
