package com.xebia.lms.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "course_id")
    private String courseId;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private String createdAt;

    private String status = "PUBLISHED";

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    public Assessment() {}

    public Assessment(String id, String title, String description, String courseId, String createdBy, String createdAt, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.courseId = courseId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }

    public void addQuestion(Question question) {
        questions.add(question);
        question.setAssessment(this);
    }
}
