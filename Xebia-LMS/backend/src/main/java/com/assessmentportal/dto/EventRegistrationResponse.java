package com.assessmentportal.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationResponse {
    private String id;
    private String eventId;
    private String learnerId;
    private String learnerName;
    private String learnerEmail;
    private String learnerBatch;
    private String learnerRollNumber;
    private String registrationTime;
    private String status; // REGISTERED, CANCELLED
}
