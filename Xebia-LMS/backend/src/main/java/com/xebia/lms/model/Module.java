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
@Table(name = "modules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Module {

    @Id
    private String id;

    @Column(name = "course_id", nullable = false)
    private String courseId;

    @Column(nullable = false)
    private String title;

    @Column(name = "sort_order")
    private Integer order;

    @Column(name = "pdf_url", length = 1000)
    private String pdfUrl;

    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "video_url", length = 1000)
    private String videoUrl;
}
