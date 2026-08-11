package com.xebia.lms.config;

import com.xebia.lms.model.Assessment;
import com.xebia.lms.model.Question;
import com.xebia.lms.model.User;
import com.xebia.lms.repository.AssessmentRepository;
import com.xebia.lms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDemoData(UserRepository userRepository, AssessmentRepository assessmentRepository) {
        return args -> {
            if (!userRepository.findByEmail("admin@xebia.com").isPresent()) {
                userRepository.save(User.builder()
                        .id("u-admin")
                        .learnerName("Enterprise Admin")
                        .email("admin@xebia.com")
                        .username("admin")
                        .password("admin123")
                        .role("admin")
                        .status("ACTIVE")
                        .createdAt(Instant.now().toString())
                        .build());
            }

            if (!userRepository.findByEmail("learner@xebia.com").isPresent()) {
                userRepository.save(User.builder()
                        .id("u-learner")
                        .learnerName("Xebia Consultant")
                        .email("learner@xebia.com")
                        .username("learner")
                        .password("learner123")
                        .role("learner")
                        .status("ACTIVE")
                        .createdAt(Instant.now().toString())
                        .build());
            }

            if (assessmentRepository.count() == 0) {
                Assessment assessment = new Assessment(
                        "assessment-demo-1",
                        "Spring Boot Fundamentals Quiz",
                        "Evaluate your understanding of Spring Boot essentials.",
                        "course-springboot",
                        "u-admin",
                        Instant.now().toString(),
                        "PUBLISHED"
                );

                assessment.addQuestion(new Question(
                        "q-1",
                        "Which annotation marks a Spring Boot application class?",
                        "MCQ",
                        Arrays.asList("@Service", "@SpringBootApplication", "@Controller", "@Repository"),
                        "@SpringBootApplication"
                ));
                assessment.addQuestion(new Question(
                        "q-2",
                        "What does JPA stand for?",
                        "MCQ",
                        Arrays.asList("Java Persistence API", "Java Process Automation", "JSON Persistence Access", "Java Public Access"),
                        "Java Persistence API"
                ));

                assessmentRepository.save(assessment);
            }
        };
    }
}
