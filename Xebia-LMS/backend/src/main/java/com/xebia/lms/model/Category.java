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
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(length = 2000)
    private String description;

    private String icon;

    @Builder.Default
    @Column(name = "courses_count")
    private Integer coursesCount = 0;

    @Column(name = "pdf_url", length = 1000)
    private String pdfUrl;

    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    private String color;
}
