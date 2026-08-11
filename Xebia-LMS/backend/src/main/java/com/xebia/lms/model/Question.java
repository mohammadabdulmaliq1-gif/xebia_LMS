package com.xebia.lms.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

    @Column(nullable = false)
    private String prompt;

    @Column(name = "question_type")
    private String questionType = "MCQ";

    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_value")
    private List<String> options = new ArrayList<>();

    @Column(name = "correct_answer")
    private String correctAnswer;

    public Question() {}

    public Question(String id, String prompt, String questionType, List<String> options, String correctAnswer) {
        this.id = id;
        this.prompt = prompt;
        this.questionType = questionType;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
}
