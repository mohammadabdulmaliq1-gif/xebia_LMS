package com.xebia.lms.model;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    private String id;

    @Column(name = "assessment_id", nullable = false)
    private String assessmentId;

    @Column(name = "learner_id", nullable = false)
    private String learnerId;

    @Column(name = "submitted_at")
    private String submittedAt;

    private String status = "SUBMITTED";

    @ElementCollection
    @MapKeyColumn(name = "question_id")
    @Column(name = "answer")
    @CollectionTable(name = "submission_answers", joinColumns = @JoinColumn(name = "submission_id"))
    private Map<String, String> answers = new HashMap<>();

    @Column(name = "marks_obtained")
    private Integer marksObtained = 0;

    @Column(name = "total_marks")
    private Integer totalMarks = 0;

    public Submission() {}

    public Submission(String id, String assessmentId, String learnerId, String submittedAt, String status) {
        this.id = id;
        this.assessmentId = assessmentId;
        this.learnerId = learnerId;
        this.submittedAt = submittedAt;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }

    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }

    public Integer getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Integer marksObtained) { this.marksObtained = marksObtained; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }
}
