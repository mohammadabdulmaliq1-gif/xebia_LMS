package com.assessmentportal.repository;

import com.assessmentportal.model.EventRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends MongoRepository<EventRegistration, String> {
    List<EventRegistration> findByEventId(String eventId);
    List<EventRegistration> findByLearnerId(String learnerId);
    Optional<EventRegistration> findByEventIdAndLearnerId(String eventId, String learnerId);
    List<EventRegistration> findByEventIdAndStatus(String eventId, String status);
}
