package com.xebia.lms.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    private String id;

    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 4000)
    private String description;

    private String level; // Beginner, Intermediate, Advanced

    private String duration;

    @Builder.Default
    private String language = "English";

    @Column(length = 1000)
    private String thumbnail;

    @Column(length = 1000)
    private String banner;

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", length = 2000)
    private String seoDescription;

    @Column(name = "pdf_url", length = 1000)
    private String pdfUrl;

    @Builder.Default
    private String status = "PUBLISHED";
}
