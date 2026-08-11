package com.assessmentportal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    private String id;

    private String title;

    private String description;

    private String bannerImage;

    private String category;

    private String department;

    private String organizer;

    private String venue;

    private String location;

    private String startDate;

    private String endDate;

    private String registrationDeadline;

    private int maximumCapacity;

    private int currentRegistrations = 0;

    private String eligibility;

    private List<String> batchRestrictions = new ArrayList<>();

    private List<String> courseRestrictions = new ArrayList<>();

    private String mode; // ONLINE, OFFLINE, HYBRID

    private String meetingLink;

    private String status; // DRAFT, PUBLISHED, CLOSED, CANCELLED

    private String createdBy;

    private String createdAt;

    private String updatedAt;
}
