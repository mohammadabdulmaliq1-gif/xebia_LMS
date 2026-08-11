package com.assessmentportal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "event_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration {

    @Id
    private String id;

    private String eventId;

    private String learnerId;

    private String registrationTime;

    private String status; // REGISTERED, CANCELLED
}
