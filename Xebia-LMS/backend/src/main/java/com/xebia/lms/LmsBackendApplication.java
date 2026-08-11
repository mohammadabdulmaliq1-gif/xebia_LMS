package com.xebia.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {"com.xebia.lms", "com.assessmentportal"})
@EnableJpaRepositories(basePackages = "com.xebia.lms.repository")
@EnableMongoRepositories(basePackages = "com.assessmentportal.repository")
public class LmsBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(LmsBackendApplication.class, args);
    }
}
